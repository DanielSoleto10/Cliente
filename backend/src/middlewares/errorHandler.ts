// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Error de Multer (archivo demasiado grande, etc.)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande. Máximo 5MB.'
    });
  }

  // Error de tipo de archivo
  if (err.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Error genérico
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};