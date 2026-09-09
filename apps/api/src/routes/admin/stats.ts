import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayOrders, monthOrders, approvedCount, topProducts, recentOrders] = await Promise.all([
      // Sales today
      prisma.order.findMany({
        where: {
          status: { in: ['APPROVED', 'DELIVERED'] },
          createdAt: { gte: startOfToday },
        },
        select: { total: true },
      }),
      // Sales this month
      prisma.order.findMany({
        where: {
          status: { in: ['APPROVED', 'DELIVERED'] },
          createdAt: { gte: startOfMonth },
        },
        select: { total: true },
      }),
      // Total approved orders
      prisma.order.count({
        where: { status: { in: ['APPROVED', 'DELIVERED'] } },
      }),
      // Top 5 products by sales
      prisma.orderItem.groupBy({
        by: ['productId'],
        _count: { productId: true },
        _sum: { price: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 5,
      }),
      // Last 10 orders
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          items: { include: { product: { select: { title: true } } } },
        },
      }),
    ]);

    // Enrich top products with names
    const topProductIds = topProducts.map((p) => p.productId);
    const productNames = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, title: true, coverImage: true },
    });
    const productMap = new Map(productNames.map((p) => [p.id, p]));

    const enrichedTop = topProducts.map((p) => ({
      productId: p.productId,
      productTitle: productMap.get(p.productId)?.title ?? 'Unknown',
      coverImage: productMap.get(p.productId)?.coverImage ?? '',
      totalSales: p._count.productId,
      totalRevenue: p._sum.price ?? 0,
    }));

    res.json({
      todaySales: todayOrders.reduce((sum, o) => sum + o.total, 0),
      monthSales: monthOrders.reduce((sum, o) => sum + o.total, 0),
      approvedOrdersCount: approvedCount,
      topProducts: enrichedTop,
      recentOrders,
    });
  } catch (err) {
    console.error('[admin:stats]', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
