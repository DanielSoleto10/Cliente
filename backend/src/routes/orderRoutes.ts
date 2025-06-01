import express from 'express';
import multer from 'multer';
import { 
  createOrder, 
  getPackages, 
  getCategories, 
  getFlavors, 
  getCrushedTypes, 
  uploadPaymentProof, 
  getDailySales 
} from '../controllers/orderController';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Routes
router.get('/packages', getPackages);
router.get('/categories', getCategories);
router.get('/flavors', getFlavors);
router.get('/crushed-types', getCrushedTypes);
router.get('/flavors/category/:categoryId', getFlavors);
router.post('/upload/payment-proof', upload.single('paymentProof'), uploadPaymentProof);
router.post('/orders', createOrder);
router.get('/reports/daily-sales', getDailySales);

export default router;