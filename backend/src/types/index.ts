// backend/src/types/index.ts
// Package types
export interface Package {
  id: string;
  price: string;
  weight: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
}

// Flavor types
export interface Flavor {
  id: string;
  name: string;
  category_id: string;
}

// ✅ QR Code types (AGREGAR ESTO)
export interface QRCode {
  id: string;
  name: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Order types
export interface OrderInput {
  customerName: string;
  packageInfo: string;
  flavorIds: string[];
  sweetness: string;
  crushedType: string;
  paymentProofUrl: string;
}

export interface Order {
  id_pedido: string;
  nombre_cliente: string;
  paquete: string;
  sabores: string;
  grado_dulce: string;
  tipo_machucado: string;
  comprobante: string;
  fecha: string;
  created_at?: string;
}

// Sales report types
export interface DailySalesReport {
  orders: Order[];
  total: number;
  count: number;
  date: string;
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

// Supabase specific types
export interface SupabaseStorageResponse {
  path: string;
  id: string;
  fullPath: string;
}