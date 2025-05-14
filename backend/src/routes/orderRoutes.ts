// backend/src/routes/orderRoutes.ts
import express from 'express';
import multer from 'multer';
import orderController from '../controllers/orderController';

const router = express.Router();

// Configure multer for memory storage (we'll upload directly to Supabase)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Route for getting all packages
router.get('/packages', orderController.getPackages);

// Route for getting all categories
router.get('/categories', orderController.getCategories);

// Route for getting all flavors
router.get('/flavors', orderController.getFlavors);

// Route for getting flavors by category
router.get('/flavors/category/:categoryId', orderController.getFlavors);

// Route for uploading payment proof
router.post(
  '/upload/payment-proof',
  upload.single('paymentProof'),
  orderController.uploadPaymentProof
);

// Route for creating an order
router.post('/orders', orderController.createOrder);

// Route for getting daily sales data (not needed for client view but useful for integration)
router.get('/reports/daily-sales', orderController.getDailySales);

export default router;