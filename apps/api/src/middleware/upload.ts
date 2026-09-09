import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_PATH } from '../lib/storage';

// Unified disk storage routing files by field name
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'cover') {
      cb(null, path.join(STORAGE_PATH, 'covers'));
    } else {
      cb(null, STORAGE_PATH);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const allowedFileTypes = /pdf|epub|zip|xlsx|docx/;
const allowedImageTypes = /jpeg|jpg|png|gif|webp/;

export const uploadProductFiles = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (file.fieldname === 'cover') {
      if (allowedImageTypes.test(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Formato de imagen .${ext} no permitido`));
      }
    } else if (file.fieldname === 'file') {
      if (allowedFileTypes.test(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Formato de archivo .${ext} no permitido`));
      }
    } else {
      cb(null, true);
    }
  },
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);
