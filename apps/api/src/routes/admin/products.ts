import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fsp from 'fs/promises';
import prisma from '../../lib/prisma';
import { uploadProductFiles } from '../../middleware/upload';
import {
  getPreviewPath,
  generatePreviewPDF,
  deleteFile,
  STORAGE_PATH,
} from '../../lib/storage';

const router = Router();

// GET /api/admin/products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        _count: { select: { orderItems: true, reviews: true } },
        reviews: { select: { stars: true }, where: { approved: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = products.map((p) => {
      const reviewCount = p._count.reviews;
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
    console.error('[admin:products:list]', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Multer middleware wrapper
function handleMultiUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  uploadProductFiles(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    next();
  });
}

// POST /api/admin/products
router.post('/', handleMultiUpload, async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const file = files?.['file']?.[0];
    const cover = files?.['cover']?.[0];
    const body = req.body as Record<string, string>;

    if (!file) {
      res.status(400).json({ error: 'Product file is required' });
      return;
    }

    const {
      slug,
      title,
      tagline,
      description,
      price,
      currency,
      categoryId,
      fileType,
      previewPages: previewPagesStr,
    } = body;

    if (!slug || !title || !tagline || !description || !price || !categoryId || !fileType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const benefits = JSON.parse(body['benefits'] ?? '[]') as string[];
    const objectives = JSON.parse(body['objectives'] ?? '[]') as string[];
    const coverImage = cover ? `/api/covers/${cover.filename}` : '';

    // Move the uploaded file to a product-specific directory
    const tmpPath = path.join(STORAGE_PATH, file.filename);
    const productId = `prod_${Date.now()}`; // temp id for directory
    const productDir = path.join(STORAGE_PATH, productId);
    await fsp.mkdir(productDir, { recursive: true });
    const finalPath = path.join(productDir, file.filename);
    await fsp.rename(tmpPath, finalPath);

    const previewPages = parseInt(previewPagesStr ?? '3', 10);
    let previewUrl: string | null = null;
    let pageCount: number | null = null;

    // Generate PDF preview
    if (fileType === 'pdf') {
      try {
        const previewOut = getPreviewPath(productId);
        await generatePreviewPDF(finalPath, previewOut, previewPages);
        previewUrl = `/api/preview/${productId}`;
        const { PDFDocument } = await import('pdf-lib');
        const { readFileSync } = await import('fs');
        const doc = await PDFDocument.load(readFileSync(finalPath));
        pageCount = doc.getPageCount();
      } catch (previewErr) {
        console.error('[admin:products:create] preview generation failed', previewErr);
      }
    }

    const stat = await fsp.stat(finalPath);

    const product = await prisma.product.create({
      data: {
        slug,
        title,
        tagline,
        description,
        benefits,
        objectives,
        price: parseFloat(price),
        currency: currency ?? 'ARS',
        fileUrl: finalPath,
        previewUrl,
        coverImage,
        images: [],
        fileType,
        fileSizeBytes: stat.size,
        pageCount,
        previewPages,
        duration: body['duration'] || null,
        targetAudience: body['targetAudience'] || null,
        attendeeCount: body['attendeeCount'] || null,
        categoryId,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('[admin:products:create]', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/admin/products/:id
router.put('/:id', handleMultiUpload, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const body = req.body as Record<string, string>;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const file = files?.['file']?.[0];
    const cover = files?.['cover']?.[0];

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updateData: Record<string, unknown> = {};

    if (cover) {
      updateData['coverImage'] = `/api/covers/${cover.filename}`;
    }

    if (body['slug']) updateData['slug'] = body['slug'];
    if (body['title']) updateData['title'] = body['title'];
    if (body['tagline']) updateData['tagline'] = body['tagline'];
    if (body['description']) updateData['description'] = body['description'];
    if (body['price']) updateData['price'] = parseFloat(body['price']);
    if (body['currency']) updateData['currency'] = body['currency'];
    if (body['categoryId']) updateData['categoryId'] = body['categoryId'];
    if (body['fileType']) updateData['fileType'] = body['fileType'];
    if (body['isActive'] !== undefined) updateData['isActive'] = body['isActive'] === 'true';
    if (body['isFeatured'] !== undefined) updateData['isFeatured'] = body['isFeatured'] === 'true';
    if (body['benefits']) updateData['benefits'] = JSON.parse(body['benefits']) as string[];
    if (body['objectives']) updateData['objectives'] = JSON.parse(body['objectives']) as string[];
    
    // Optional Event fields (check if they exist in body because they can be empty strings)
    if ('duration' in body) updateData['duration'] = body['duration'] || null;
    if ('targetAudience' in body) updateData['targetAudience'] = body['targetAudience'] || null;
    if ('attendeeCount' in body) updateData['attendeeCount'] = body['attendeeCount'] || null;

    if (file) {
      const productDir = path.join(STORAGE_PATH, id);
      await fsp.mkdir(productDir, { recursive: true });
      const finalPath = path.join(productDir, file.filename);
      const tmpPath = path.join(STORAGE_PATH, file.filename);
      await fsp.rename(tmpPath, finalPath);

      const stat = await fsp.stat(finalPath);
      updateData['fileUrl'] = finalPath;
      updateData['fileSizeBytes'] = stat.size;

      const fileType = (body['fileType'] ?? existing.fileType);
      const previewPages = parseInt(body['previewPages'] ?? String(existing.previewPages), 10);

      if (fileType === 'pdf') {
        try {
          const previewOut = getPreviewPath(id);
          // Delete old preview
          await deleteFile(previewOut);
          await generatePreviewPDF(finalPath, previewOut, previewPages);
          updateData['previewUrl'] = `/api/preview/${id}`;
          const { PDFDocument } = await import('pdf-lib');
          const { readFileSync } = await import('fs');
          const doc = await PDFDocument.load(readFileSync(finalPath));
          updateData['pageCount'] = doc.getPageCount();
        } catch (previewErr) {
          console.error('[admin:products:update] preview generation failed', previewErr);
        }
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(product);
  } catch (err) {
    console.error('[admin:products:update]', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { hard } = req.query as { hard?: string };

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (hard === 'true') {
      // Hard delete: remove files and DB record
      try {
        await deleteFile(existing.fileUrl);
        if (existing.previewUrl) {
          await deleteFile(getPreviewPath(id));
        }
      } catch (fileErr) {
        console.error('[admin:products:delete] file deletion error', fileErr);
      }
      await prisma.product.delete({ where: { id } });
      res.json({ deleted: true });
    } else {
      // Soft delete
      await prisma.product.update({ where: { id }, data: { isActive: false } });
      res.json({ deactivated: true });
    }
  } catch (err) {
    console.error('[admin:products:delete]', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;