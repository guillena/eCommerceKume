import { Router, Request, Response } from 'express';
import { getUSDRate } from '../lib/exchange-rate';

const router = Router();

// GET /api/exchange-rate
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rate = await getUSDRate();
    res.json({ usdToArs: rate.ars_per_usd, updatedAt: rate.updatedAt });
  } catch (err) {
    console.error('[exchange-rate]', err);
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

export default router;
