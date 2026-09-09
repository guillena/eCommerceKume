import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';

const router = Router();

// GET /api/admin/reviews
router.get('/', async (req: Request, res: Response) => {
  try {
    const { approved } = req.query as { approved?: string };
    const where: Record<string, unknown> = {};
    if (approved !== undefined) where['approved'] = approved === 'true';

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: { select: { title: true, slug: true, coverImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (err) {
    console.error('[admin:reviews:list]', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// PUT /api/admin/reviews/:id  -- toggles the approved flag
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    const updated = await prisma.review.update({
      where: { id: review.id },
      data: { approved: !review.approved },
    });

    res.json(updated);
  } catch (err) {
    console.error('[admin:reviews:update]', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/admin/reviews/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.review.delete({ where: { id } });
    res.json({ deleted: true });
  } catch (err) {
    console.error('[admin:reviews:delete]', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
