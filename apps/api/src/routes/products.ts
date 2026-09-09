import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, featured, search, limit = '50', page = '1' } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const where: Record<string, unknown> = { isActive: true };
    if (featured === 'true') where['isFeatured'] = true;
    if (category) {
      where['category'] = { slug: category };
    }
    if (search) {
      where['OR'] = [
        { title: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        reviews: { select: { stars: true }, where: { approved: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limitNum,
      skip: (pageNum - 1) * limitNum,
    });

    const enriched = products.map((p) => {
      const reviewCount = p.reviews.length;
      const avgStars =
        reviewCount > 0
          ? p.reviews.reduce((sum, r) => sum + r.stars, 0) / reviewCount
          : null;
      const { reviews, ...rest } = p;
      void reviews;
      return { ...rest, avgStars, totalSales: p._count.orderItems };
    });

    res.json(enriched);
  } catch (err) {
    console.error('[products:list]', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params['slug'] as string, isActive: true },
      include: {
        category: true,
        reviews: {
          select: { stars: true },
          where: { approved: true },
        },
        _count: { select: { orderItems: true } },
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const reviewCount = product.reviews.length;
    const avgStars =
      reviewCount > 0
        ? product.reviews.reduce((sum, r) => sum + r.stars, 0) / reviewCount
        : null;

    const { reviews, ...rest } = product;
    void reviews;

    res.json({ ...rest, avgStars, totalSales: product._count.orderItems });
  } catch (err) {
    console.error('[products:detail]', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
