// backend/src/middlewares/fileUpload.ts
import multer from 'multer';
import { Request } from 'express';

// Configure storage - memory storage for Supabase
const storage = multer.memoryStorage();

// Filter for image files only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen.'));
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

export default upload;