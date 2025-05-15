// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

// Error interface
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', err);
  
  const appError = err as AppError;
  // Default error values
  const statusCode = appError.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  // Handle specific errors
  if (appError.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
    });
  }
  
  if (err.message.includes('Solo se permiten archivos de imagen')) {
    return res.status(400).json({
      success: false,
      message: 'Solo se permiten archivos de imagen (JPG, PNG, GIF)',
    });
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
};

// Custom error creator
export const createError = (message: string, statusCode: number = 400): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};