// backend/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Parse JSON requests with a larger limit for images
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded requests
app.use(morgan('dev')); // HTTP request logger

// Routes
app.use('/api', orderRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;