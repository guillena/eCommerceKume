import { Router, Request, Response } from 'express';
import path from 'path';
import fsp from 'fs/promises';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/download/verify?token=xxx — verify token and return download info
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token?: string };

    if (!token) {
      res.json({ valid: false });
      return;
    }

    const order = await prisma.order.findFirst({
      where: {
        downloadToken: token,
        status: { in: ['APPROVED', 'DELIVERED'] },
        tokenExpiresAt: { gt: new Date() },
      },
      include: {
        items: { include: { product: { select: { id: true, title: true, slug: true } } } },
      },
    });

    if (!order) {
      res.json({ valid: false });
      return;
    }

    const items = order.items.map((item) => ({
      title: item.product.title,
      downloadUrl: `/download/${order.downloadToken}/${item.product.id}`,
    }));

    res.json({ valid: true, orderId: order.id, items });
  } catch (err) {
    console.error('[download:verify]', err);
    res.status(500).json({ error: 'Failed to verify download token' });
  }
});

// GET /api/download/:token/:productId — download the actual file
router.get('/:token/:productId', async (req: Request, res: Response) => {
  try {
    const { token, productId } = req.params as { token: string; productId: string };

    const order = await prisma.order.findFirst({
      where: {
        downloadToken: token,
        status: { in: ['APPROVED', 'DELIVERED'] },
        tokenExpiresAt: { gt: new Date() },
        items: { some: { productId } },
      },
      include: {
        items: {
          where: { productId },
          include: { product: true },
        },
      },
    });

    if (!order || order.items.length === 0) {
      res.status(403).json({ error: 'Invalid or expired download token' });
      return;
    }

    const product = order.items[0]!.product;
    const filePath = product.fileUrl;

    try {
      await fsp.access(filePath);
    } catch {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Mark order as delivered
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'DELIVERED' },
    });

    const ext = path.extname(filePath) || `.${product.fileType}`;
    const filename = `${product.slug}${ext}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(path.resolve(filePath));
  } catch (err) {
    console.error('[download:file]', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

export default router;
