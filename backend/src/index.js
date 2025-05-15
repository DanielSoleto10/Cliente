// backend/index.js (archivo JavaScript en lugar de TypeScript)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const orderRoutes = require('./src/routes/orderRoutes');

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
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Default error values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  // Handle specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
    });
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;