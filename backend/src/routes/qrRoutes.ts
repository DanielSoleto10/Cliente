// backend/src/routes/qrRoutes.ts
import { Router } from 'express';
import { getActiveQRCodes, getQRCodeById } from '../controller/qrController';

const router = Router();

// GET /api/qr/active - Obtener todos los QR codes activos
router.get('/active', getActiveQRCodes);

// GET /api/qr/:id - Obtener un QR específico por ID
router.get('/:id', getQRCodeById);

export default router;