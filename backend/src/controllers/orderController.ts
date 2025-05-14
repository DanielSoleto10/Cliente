// backend/src/controllers/orderController.ts
import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get all available packages
 */
export const getPackages = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) {
      console.error('Error fetching packages:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los paquetes',
        error: error.message
      });
    }
    
    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    console.error('Unexpected error fetching packages:', error);
    return res.status(500).json({
      success: false,
      message: 'Error inesperado al obtener los paquetes',
      error: error.message
    });
  }
};

/**
 * Get all flavor categories
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las categorías',
        error: error.message
      });
    }
    
    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    console.error('Unexpected error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Error inesperado al obtener las categorías',
      error: error.message
    });
  }
};

/**
 * Get all flavors or flavors by category
 */
export const getFlavors = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    
    let query = supabase.from('flavors').select('*');
    
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching flavors:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los sabores',
        error: error.message
      });
    }
    
    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    console.error('Unexpected error fetching flavors:', error);
    return res.status(500).json({
      success: false,
      message: 'Error inesperado al obtener los sabores',
      error: error.message
    });
  }
};

/**
 * Upload payment proof image to Supabase Storage
 */
export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha subido ningún archivo'
      });
    }
    
    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `payment_proofs/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('orders')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error('Error uploading file to Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al subir el comprobante de pago',
        error: error.message
      });
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('orders')
      .getPublicUrl(filePath);
    
    return res.status(200).json({
      success: true,
      url: publicUrlData.publicUrl
    });
  } catch (error: any) {
    console.error('Unexpected error uploading payment proof:', error);
    return res.status(500).json({
      success: false,
      message: 'Error inesperado al subir el comprobante de pago',
      error: error.message
    });
  }
};

/**
 * Create a new order
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { 
      customerName, 
      packageInfo, 
      flavorIds, 
      sweetness, 
      crushedType, 
      paymentProofUrl 
    } = req.body;
    
    // Validate required fields
    if (!customerName || !packageInfo || !flavorIds || !sweetness || !crushedType || !paymentProofUrl) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }
    
    // Extract package price for total (e.g. from "10 Bs - 45 g" get "10")
    let totalPrice = 0;
    const priceMatch = packageInfo.match(/(\d+)/);
    if (priceMatch && priceMatch[1]) {
      totalPrice = parseInt(priceMatch[1], 10);
    }
    
    // Generate order ID (format: CC-YYYYMMDD-XXXX)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    const orderID = `CC-${dateStr}-${randomPart}`;
    
    // 1. Create order in orders table
    const { data: orderData, error: orderError } = await supabase
      .from('clientes') // Using 'clientes' table as per your existing schema
      .insert({
        id_pedido: orderID,
        nombre_cliente: customerName,
        paquete: packageInfo,
        sabores: Array.isArray(flavorIds) ? flavorIds.join(',') : flavorIds,
        grado_dulce: sweetness,
        tipo_machucado: crushedType,
        comprobante: paymentProofUrl,
        fecha: now.toISOString().split('T')[0], // YYYY-MM-DD format
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      return res.status(500).json({
        success: false,
        message: 'Error al crear el pedido',
        error: orderError.message
      });
    }
    
    return res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        orderID,
        ...orderData
      }
    });
    
  } catch (error: any) {
    console.error('Unexpected error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Error inesperado al crear el pedido',
      error: error.message
    });
  }
};

/**
 * Get daily sales data for reports (not needed for client view but useful for integration)
 */
export const getDailySales = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere una fecha (formato YYYY-MM-DD)'
      });
    }
    
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('fecha', date);
    
    if (error) {
      console.error('Error fetching daily sales:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las ventas diarias',
        error: error.message
      });
    }
    
    // Calculate total sales
    const totalSales = data?.reduce((sum, item) => {
      const price = parseInt(item.paquete.match(/(\d+)/)?.[1] || '0', 10);
      return sum + price;
    }, 0);
    
    return res.status(200).json({
      success: true,
      data: {
        orders: data || [],
        total: totalSales,
        count: data?.length || 0,
        date
      }
    });
    
  } catch (error: any) {
    console.error('Unexpected error fetching daily sales:', error);
    return res.status(500).json({
      success: false,
      message: 'Error inesperado al obtener las ventas diarias',
      error: error.message
    });
  }
};

export default {
  getPackages,
  getCategories,
  getFlavors,
  uploadPaymentProof,
  createOrder,
  getDailySales
};