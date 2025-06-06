// frontend/src/services/orderService.ts

// Usar el servicio API existente
import { orderService as apiService } from './api';

// Interfaces de tipos
export interface Package {
  id: string;
  name: string;
  price: number;
  weight: number;
  weight_unit: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Flavor {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

export interface CrushedType {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface CreateOrderData {
  customerName: string;
  packageInfo: string;
  flavorIds: string[];
  sweetness: string;
  crushedType: string;
  paymentProofUrl: string;
}

export interface OrderResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

// Wrapper class para mantener la misma interfaz
class OrderService {
  async getPackages(): Promise<Package[]> {
    console.log('📦 Obteniendo paquetes...');
    try {
      const response = await apiService.getPackages();
      return response.data || response;
    } catch (error) {
      console.error('❌ Error obteniendo paquetes:', error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    console.log('📋 Obteniendo categorías...');
    try {
      const response = await apiService.getCategories();
      return response.data || response;
    } catch (error) {
      console.error('❌ Error obteniendo categorías:', error);
      throw error;
    }
  }

  async getFlavors(): Promise<Flavor[]> {
    console.log('🍃 Obteniendo sabores...');
    try {
      const response = await apiService.getAllFlavors();
      return response.data || response;
    } catch (error) {
      console.error('❌ Error obteniendo sabores:', error);
      throw error;
    }
  }

  async getCrushedTypes(): Promise<CrushedType[]> {
    console.log('🔨 Obteniendo tipos de machucado...');
    try {
      const response = await apiService.getCrushedTypes();
      return response.data || response;
    } catch (error) {
      console.error('❌ Error obteniendo tipos de machucado:', error);
      throw error;
    }
  }

  async uploadPaymentProof(file: File): Promise<string> {
    console.log('📤 Subiendo comprobante...');
    try {
      const response = await apiService.uploadPaymentProof(file);
      return response.url || response.data?.url || response;
    } catch (error) {
      console.error('❌ Error al subir comprobante:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al subir comprobante';
      throw new Error(errorMessage);
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
    console.log('📝 Creando pedido...');
    console.log('📝 Datos del pedido:', orderData);

    try {
      const response = await apiService.createOrder(orderData);

      // 🔍 DEBUG: Ver qué devuelve exactamente el API
      console.log('🔍 RESPUESTA COMPLETA DEL API:', response);
      console.log('🔍 RESPUESTA.DATA:', response.data);
      console.log('🔍 TODAS LAS PROPIEDADES:', Object.keys(response));

      return {
        success: true,
        data: response.data || response,
        message: 'Pedido creado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear pedido';
      return {
        success: false,
        error: errorMessage,
        message: 'Error al crear el pedido'
      };
    }
  }
}

// Exportar la instancia
export const orderService = new OrderService();