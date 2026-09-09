import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import path from 'path';
import { ensureStorageDirs, STORAGE_PATH } from './lib/storage';

// Routes
import exchangeRateRouter from './routes/exchange-rate';
import productsRouter from './routes/products';
import previewRouter from './routes/preview';
import checkoutRouter from './routes/checkout';
import webhookRouter from './routes/webhook';
import downloadRouter from './routes/download';
import reviewsRouter from './routes/reviews';

// Admin routes
import adminAuthRouter from './routes/admin/auth';
import adminProductsRouter from './routes/admin/products';
import adminOrdersRouter from './routes/admin/orders';
import adminReviewsRouter from './routes/admin/reviews';
import adminStatsRouter from './routes/admin/stats';

import { requireAdmin } from './middleware/auth';

// Initialize storage directories
ensureStorageDirs();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT ?? 3001;
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null;

const allowedOrigins = [
  'https://libreria.kumespacio.com.ar',
  'https://www.libreria.kumespacio.com.ar',
  'http://localhost:3000',
  'http://localhost:3001',
  ...(frontendUrl ? [frontendUrl] : []),
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'frame-ancestors': ["'self'", ...allowedOrigins],
      },
    },
  })
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Strict limiter for checkout
const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many checkout attempts.' },
});

app.use(generalLimiter);

// Webhook needs raw body for signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// Normal body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/exchange-rate', exchangeRateRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', async (_req, res) => {
  // Categories are also served from products router but expose top-level too
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
    res.json(categories);
  } finally {
    await prisma.$disconnect();
  }
});
app.use('/api/covers', express.static(path.join(STORAGE_PATH, 'covers')));
app.use('/api/preview', previewRouter);
app.use('/api/checkout', checkoutLimiter, checkoutRouter);
app.use('/api/download', downloadRouter);
app.use('/api/reviews', reviewsRouter);

// Admin routes (all protected except login)
app.use('/api/admin', adminAuthRouter);
app.use('/api/admin/products', requireAdmin, adminProductsRouter);
app.use('/api/admin/orders', requireAdmin, adminOrdersRouter);
app.use('/api/admin/reviews', requireAdmin, adminReviewsRouter);
app.use('/api/admin/stats', requireAdmin, adminStatsRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[global error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✨ eCommerceKume API running on port ${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV ?? 'development'}`);
});

export default app;
