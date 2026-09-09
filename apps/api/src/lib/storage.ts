import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

export const STORAGE_PATH =
  process.env.STORAGE_PATH ?? (process.env.NODE_ENV === 'production' ? '/data/files' : './uploads');
export const PREVIEW_PATH =
  process.env.PREVIEW_PATH ?? (process.env.NODE_ENV === 'production' ? '/data/previews' : './previews');

export function ensureStorageDirs(): void {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
  fs.mkdirSync(path.join(STORAGE_PATH, 'covers'), { recursive: true });
  fs.mkdirSync(PREVIEW_PATH, { recursive: true });
  console.log(`Storage: ${STORAGE_PATH}`);
  console.log(`Previews: ${PREVIEW_PATH}`);
}

export function getFilePath(productId: string, filename: string): string {
  return path.join(STORAGE_PATH, productId, filename);
}

export function getPreviewPath(productId: string): string {
  return path.join(PREVIEW_PATH, `${productId}-preview.pdf`);
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export async function generatePreviewPDF(
  inputPath: string,
  outputPath: string,
  previewPages: number = 3,
): Promise<void> {
  const inputBytes = await fsp.readFile(inputPath);
  const srcDoc = await PDFDocument.load(inputBytes);
  const previewDoc = await PDFDocument.create();

  const totalPages = srcDoc.getPageCount();
  const pagesToCopy = Math.min(previewPages, totalPages);
  const pageIndices = Array.from({ length: pagesToCopy }, (_, i) => i);

  const copiedPages = await previewDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((page) => previewDoc.addPage(page));

  const previewBytes = await previewDoc.save();
  await fsp.mkdir(path.dirname(outputPath), { recursive: true });
  await fsp.writeFile(outputPath, previewBytes);
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fsp.unlink(filePath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
  }
}
