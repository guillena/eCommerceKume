import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { sendDownloadEmail } from '../lib/resend';
import { generateDownloadToken } from '../lib/jwt';

const router = Router();

// POST /api/webhook — MercadoPago IPN webhook
router.post('/', async (req: Request, res: Response) => {
  try {
    // Verify signature if secret is configured
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (secret) {
      const signature = req.headers['x-signature'] as string | undefined;
      const requestId = req.headers['x-request-id'] as string | undefined;
      const topic = req.query['topic'] as string | undefined;
      const id = req.query['id'] as string | undefined;

      if (signature && requestId) {
        const parts = signature.split(',');
        const tsEntry = parts.find((p) => p.startsWith('ts='));
        const v1Entry = parts.find((p) => p.startsWith('v1='));
        const ts = tsEntry?.split('=')[1] ?? '';
        const v1 = v1Entry?.split('=')[1] ?? '';
        const manifest = `id:${id ?? ''};request-id:${requestId};ts:${ts};`;
        const expected = crypto
          .createHmac('sha256', secret)
          .update(manifest)
          .digest('hex');
        if (expected !== v1) {
          res.status(401).json({ error: 'Invalid signature' });
          return;
        }
      }
    }

    const body = req.body as { type?: string; data?: { id?: string }; action?: string };
    const eventType = body.type ?? body.action;

    if (eventType !== 'payment') {
      res.json({ ok: true });
      return;
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      res.json({ ok: true });
      return;
    }

    // Fetch payment from MP API
    const mpToken = process.env.MP_ACCESS_TOKEN ?? '';
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
    });

    if (!paymentRes.ok) {
      console.error('[webhook] Failed to fetch payment', paymentId);
      res.json({ ok: true });
      return;
    }

    const payment = await paymentRes.json() as {
      id: number;
      status: string;
      external_reference?: string;
      metadata?: { order_id?: string };
    };

    const orderId = payment.external_reference ?? payment.metadata?.order_id;
    if (!orderId) {
      res.json({ ok: true });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      res.json({ ok: true });
      return;
    }

    if (payment.status === 'approved' && order.status === 'PENDING') {
      const downloadToken = generateDownloadToken();
      const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'APPROVED',
          mpPaymentId: String(payment.id),
          downloadToken,
          tokenExpiresAt,
          emailSentAt: new Date(),
        },
      });

      const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
      const downloadUrl = `${siteUrl}/download?token=${downloadToken}`;
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
    } else if (['rejected', 'cancelled'].includes(payment.status)) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: payment.status === 'rejected' ? 'REJECTED' : 'CANCELLED',
          mpPaymentId: String(payment.id),
        },
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('[webhook]', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
