import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/reviews/:productId — get approved reviews for a product
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: req.params['productId'] as string,
        approved: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(reviews);
  } catch (err) {
    console.error('[reviews:list]', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews — submit a new review
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, stars, comment, authorName } = req.body as {
      productId: string;
      stars: number;
      comment?: string;
      authorName: string;
    };

    if (!productId || !stars || !authorName) {
      res.status(400).json({ error: 'productId, stars, and authorName are required' });
      return;
    }

    if (stars < 1 || stars > 5) {
      res.status(400).json({ error: 'stars must be between 1 and 5' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        productId,
        stars,
        comment: comment ?? null,
        authorName,
        approved: false, // pending moderation
      },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('[reviews:create]', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export default router;
