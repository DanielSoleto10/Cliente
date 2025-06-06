// frontend/src/services/qr.ts

// Usar el servicio API existente
import { orderService as apiService } from './api';

// Interfaces de tipos
export interface QRCode {
  id: string;
  name: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Wrapper class para mantener la misma interfaz que tu orderService
class QRService {
  async getActiveQRs(): Promise<QRCode[]> {
    console.log('📱 Obteniendo QRs activos...');
    try {
      const response = await apiService.getActiveQRs();
      return response.data || response;
    } catch (error) {
      console.error('❌ Error obteniendo QRs activos:', error);
      throw new Error('No se pudieron cargar los códigos QR');
    }
  }

  async getQRById(id: string): Promise<QRCode> {
    console.log('🔍 Obteniendo QR por ID:', id);
    try {
      const response = await apiService.getQRById(id);
      return response.data || response;
    } catch (error) {
      console.error('❌ Error obteniendo QR por ID:', error);
      throw new Error('No se pudo cargar el código QR');
    }
  }
}

// Exportar la instancia (igual que tu orderService)
export const qrService = new QRService();