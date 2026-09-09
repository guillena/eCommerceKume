import { Router, Request, Response } from 'express';
import path from 'path';
import fsp from 'fs/promises';
import { getPreviewPath } from '../lib/storage';

const router = Router();

// GET /api/preview/:productId — serve the preview PDF
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params as { productId: string };
    const previewPath = getPreviewPath(productId);

    try {
      await fsp.access(previewPath);
    } catch {
      res.status(404).json({ error: 'Preview not available' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(path.resolve(previewPath));
  } catch (err) {
    console.error('[preview]', err);
    res.status(500).json({ error: 'Failed to serve preview' });
  }
});

export default router;
