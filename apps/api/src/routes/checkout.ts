import { Router, Request, Response } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import prisma from '../lib/prisma';
import { generateDownloadToken } from '../lib/jwt';

const router = Router();

// POST /api/checkout
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, buyerName, buyerEmail } = req.body as {
      items: { productId: string; quantity: number }[];
      buyerName: string;
      buyerEmail: string;
    };

    if (!items?.length || !buyerName || !buyerEmail) {
      res.status(400).json({ error: 'items, buyerName, and buyerEmail are required' });
      return;
    }

    // Fetch products
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      res.status(400).json({ error: 'One or more products are unavailable' });
      return;
    }

    const total = products.reduce((sum, p) => sum + p.price, 0);

    // Create the order in DB
    const downloadToken = generateDownloadToken();
    const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        buyerEmail,
        buyerName,
        total,
        currency: products[0]?.currency ?? 'ARS',
        downloadToken,
        tokenExpiresAt,
        items: {
          create: products.map((p) => ({
            productId: p.id,
            price: p.price,
          })),
        },
      },
    });

    // Create MercadoPago preference
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN ?? '',
    });

    const preference = new Preference(client);

    const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';

    const result = await preference.create({
      body: {
        items: products.map((p) => ({
          id: p.id,
          title: p.title,
          quantity: 1,
          unit_price: p.price,
          currency_id: p.currency,
        })),
        payer: {
          name: buyerName,
          email: buyerEmail,
        },
        back_urls: {
          success: `${siteUrl}/success`,
          failure: `${siteUrl}/success?status=rejected`,
          pending: `${siteUrl}/success?status=pending`,
        },
        ...(siteUrl.includes('localhost') ? {} : { auto_return: 'approved' as const }),
        notification_url: `${apiUrl}/api/webhook`,
        external_reference: order.id,
        metadata: { orderId: order.id },
      },
    });

    res.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (err) {
    console.error('[checkout]', err);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

export default router;
