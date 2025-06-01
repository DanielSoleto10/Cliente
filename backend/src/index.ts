// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes';
import { errorHandler } from './middlewares/errorHandler';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(helmet()); // Adds security headers

// CORS configuration - PERMISIVO PARA DEBUG
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware - LOGS PARA VER QUÉ LLEGA
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`📱 User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'No user-agent'}...`);
  console.log(`⏰ ${new Date().toLocaleTimeString()}`);
  console.log('---');
  next();
});

app.use(express.json({ limit: '10mb' })); // Parse JSON requests with a larger limit for images
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded requests
app.use(morgan('dev')); // HTTP request logger

// Routes
app.use('/api', orderRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Backend funcionando correctamente'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📱 Red: http://192.168.0.5:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
  console.log('🔍 Debug logs activados');
  console.log('🌐 CORS configurado como permisivo (*)');
  console.log('-'.repeat(50));
});

export default app;