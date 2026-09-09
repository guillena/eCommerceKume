import axios from 'axios';
import prisma from './prisma';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface ExchangeRateResult {
  ars_per_usd: number;
  updatedAt: Date;
}

export async function getUSDRate(): Promise<ExchangeRateResult> {
  const cached = await prisma.exchangeRateCache.findUnique({
    where: { id: 'singleton' },
  });

  if (cached) {
    const ageMs = Date.now() - cached.updatedAt.getTime();
    if (ageMs < CACHE_TTL_MS) {
      return { ars_per_usd: cached.usdToArs, updatedAt: cached.updatedAt };
    }
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    if (cached) return { ars_per_usd: cached.usdToArs, updatedAt: cached.updatedAt };
    return { ars_per_usd: 1000, updatedAt: new Date() };
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  const response = await axios.get<{ conversion_rates: Record<string, number> }>(url, {
    timeout: 10000,
  });

  const arsRate = response.data.conversion_rates['ARS'];
  if (!arsRate) throw new Error('ARS rate not found in exchange rate API response');

  const updated = await prisma.exchangeRateCache.upsert({
    where: { id: 'singleton' },
    update: { usdToArs: arsRate },
    create: { id: 'singleton', usdToArs: arsRate },
  });

  return { ars_per_usd: updated.usdToArs, updatedAt: updated.updatedAt };
}
