import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
import { generateDownloadToken } from '../../lib/jwt';
import { sendDownloadEmail } from '../../lib/resend';

const router = Router();

// GET /api/admin/orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, email, page = '1', limit = '20' } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status) where['status'] = status;
    if (email) where['buyerEmail'] = { contains: email, mode: 'insensitive' };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { select: { title: true, coverImage: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('[admin:orders:list]', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/admin/orders/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (err) {
    console.error('[admin:orders:detail]', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/admin/orders/:id/resend-email
router.post('/:id/resend-email', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.status !== 'APPROVED' && order.status !== 'DELIVERED') {
      res.status(400).json({ error: 'Order is not in a downloadable state' });
      return;
    }

    const downloadToken = generateDownloadToken();
    const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
    const downloadUrl = `${siteUrl}/download?token=${downloadToken}`;

    await prisma.order.update({
      where: { id: order.id },
      data: { downloadToken, tokenExpiresAt },
    });

    const productTitle =
      order.items.length === 1
        ? order.items[0]!.product.title
        : `${order.items.length} productos`;

    await sendDownloadEmail({
      to: order.buyerEmail,
      buyerName: order.buyerName,
      productTitle,
      downloadUrl,
      expiresAt: tokenExpiresAt,
    });

    res.json({ success: true, newTokenExpiresAt: tokenExpiresAt });
  } catch (err) {
    console.error('[admin:orders:resend]', err);
    res.status(500).json({ error: 'Failed to resend email' });
  }
});

// POST /api/admin/orders/:id/sync-payment
// Manually check payment status with MercadoPago (replaces webhook for local dev)
router.post('/:id/sync-payment', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.status !== 'PENDING') {
      res.json({ message: `Order already ${order.status}`, order });
      return;
    }

    // Search for payments with this order's external_reference in MP
    const mpToken = process.env.MP_ACCESS_TOKEN ?? '';
    const searchRes = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${id}&sort=date_created&criteria=desc`,
      { headers: { Authorization: `Bearer ${mpToken}` } },
    );

    if (!searchRes.ok) {
      res.status(502).json({ error: 'Failed to query MercadoPago API' });
      return;
    }

    const searchData = await searchRes.json() as {
      results: { id: number; status: string }[];
    };

    const approvedPayment = searchData.results?.find(
      (p: { status: string }) => p.status === 'approved',
    );

    if (!approvedPayment) {
      res.json({
        message: 'No approved payment found in MercadoPago',
        mpResults: searchData.results?.map((p: { id: number; status: string }) => ({
          id: p.id,
          status: p.status,
        })),
      });
      return;
    }

    // Approve the order and send email
    const downloadToken = generateDownloadToken();
    const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
    const downloadUrl = `${siteUrl}/download?token=${downloadToken}`;

    await prisma.order.update({
      where: { id },
      data: {
        status: 'APPROVED',
        mpPaymentId: String(approvedPayment.id),
        downloadToken,
        tokenExpiresAt,
        emailSentAt: new Date(),
      },
    });

    const productTitle =
      order.items.length === 1
        ? order.items[0]!.product.title
        : `${order.items.length} productos`;

    try {
      await sendDownloadEmail({
        to: order.buyerEmail,
        buyerName: order.buyerName,
        productTitle,
        downloadUrl,
        expiresAt: tokenExpiresAt,
      });
    } catch (emailErr) {
      console.error('[admin:sync-payment] Email failed:', emailErr);
    }

    res.json({
      message: 'Order approved and email sent',
      mpPaymentId: approvedPayment.id,
      status: 'APPROVED',
    });
  } catch (err) {
    console.error('[admin:orders:sync-payment]', err);
    res.status(500).json({ error: 'Failed to sync payment' });
  }
});

export default router;
