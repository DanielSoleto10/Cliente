import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Crear cliente Supabase
let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Cliente Supabase inicializado correctamente');
} else {
  console.error('❌ Variables de Supabase no configuradas');
}

// MÉTODO: createOrder CON PRECIO CORRECTO
export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log('📝 ==============================');
    console.log('📝 INICIANDO CREACIÓN DE PEDIDO');
    console.log('📝 ==============================');

    console.log('📋 Datos recibidos del frontend:');
    console.log(JSON.stringify(req.body, null, 2));

    const {
      customerName,
      packageInfo,
      flavorIds,
      sweetness,
      crushedType,
      paymentProofUrl
    } = req.body;

    console.log('🔍 Validando campos requeridos...');
    console.log('  - customerName:', customerName ? '✅' : '❌', customerName);
    console.log('  - packageInfo:', packageInfo ? '✅' : '❌', packageInfo);
    console.log('  - flavorIds:', flavorIds ? '✅' : '❌', flavorIds);
    console.log('  - sweetness:', sweetness ? '✅' : '❌', sweetness);
    console.log('  - crushedType:', crushedType ? '✅' : '❌', crushedType);
    console.log('  - paymentProofUrl:', paymentProofUrl ? '✅' : '❌', paymentProofUrl);

    // Validar datos requeridos
    if (!customerName || !packageInfo || !flavorIds || !sweetness || !crushedType || !paymentProofUrl) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        missing: {
          customerName: !customerName,
          packageInfo: !packageInfo,
          flavorIds: !flavorIds,
          sweetness: !sweetness,
          crushedType: !crushedType,
          paymentProofUrl: !paymentProofUrl
        }
      });
    }

    // ✨ NUEVO: Extraer el precio del packageInfo
    let extractedPrice = 1; // valor por defecto

    try {
      console.log('💰 Extrayendo precio del packageInfo:', packageInfo);

      // Buscar el patrón "- XX Bs -" en el packageInfo
      // Ejemplo: "Paquete Black - 30 Bs - 150 g"
      const priceMatch = packageInfo.match(/- (\d+(?:\.\d+)?) Bs -/);

      if (priceMatch && priceMatch[1]) {
        extractedPrice = parseFloat(priceMatch[1]);
        console.log('💰 ✅ Precio extraído exitosamente:', extractedPrice, 'Bs');
      } else {
        console.log('⚠️ No se pudo extraer el precio con el patrón esperado');
        console.log('⚠️ Usando valor por defecto:', extractedPrice, 'Bs');

        // Intentar patrón alternativo sin guiones
        const altPriceMatch = packageInfo.match(/(\d+(?:\.\d+)?) Bs/);
        if (altPriceMatch && altPriceMatch[1]) {
          extractedPrice = parseFloat(altPriceMatch[1]);
          console.log('💰 ✅ Precio extraído con patrón alternativo:', extractedPrice, 'Bs');
        }
      }
    } catch (error) {
      console.log('⚠️ Error extrayendo precio:', error);
      console.log('⚠️ Usando valor por defecto:', extractedPrice, 'Bs');
    }

    // Preparar datos para la base de datos
    const orderData = {
      flavors: flavorIds,
      sweetness: sweetness,  // ← AGREGAR ESTA LÍNEA
      crushed_type: crushedType,
      package_type: packageInfo,
      amount: extractedPrice,
      notes: null,  // ← CAMBIAR: quitar la dulzura
      status: 'pending',
      full_name: customerName,
      payment_proof_url: paymentProofUrl,
      created_at: new Date().toISOString()
    };

    console.log('💾 Datos preparados para guardar:');
    console.log(JSON.stringify(orderData, null, 2));
    console.log('💰 Amount final que se guardará:', extractedPrice, 'Bs');

    // Verificar si Supabase está disponible
    if (!supabase) {
      console.warn('⚠️ Supabase no disponible, no se puede guardar el pedido');
      return res.status(500).json({
        success: false,
        error: 'Configuración de base de datos incompleta',
        message: 'Variables de entorno de Supabase no configuradas correctamente'
      });
    }

    console.log('🔗 Conectando a Supabase...');

    // Test de conexión y estructura de tabla
    try {
      console.log('🔍 Verificando tabla "orders"...');

      // Primero hacer un SELECT simple para verificar la conexión
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

      if (testError) {
        console.error('❌ Error de conexión/tabla:', testError);
        return res.status(500).json({
          success: false,
          error: 'Error de base de datos - tabla no accesible',
          message: testError.message,
          supabaseError: testError
        });
      }

      console.log('✅ Conexión a tabla "orders" exitosa');

    } catch (error) {
      console.error('❌ Error de conexión general:', error);
      return res.status(500).json({
        success: false,
        error: 'Error de conexión con base de datos',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    console.log('📝 Insertando pedido en Supabase...');

    // Insertar en la base de datos
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase INSERT:', error);
      console.error('❌ Código de error:', error.code);
      console.error('❌ Detalles:', error.details);
      console.error('❌ Hint:', error.hint);
      console.error('❌ Message:', error.message);

      return res.status(500).json({
        success: false,
        error: 'Error al insertar en base de datos',
        message: error.message,
        supabaseError: {
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      });
    }

    console.log('✅ Pedido insertado exitosamente:');
    console.log(JSON.stringify(data, null, 2));
    console.log('💰 Precio final guardado:', data.amount, 'Bs');

    console.log('✅ ==============================');
    console.log('✅ PEDIDO CREADO EXITOSAMENTE');
    console.log('✅ ==============================');

    res.json({
      success: true,
      data,
      message: 'Pedido creado exitosamente'
    });

  } catch (error) {
    console.error('❌ ERROR GENERAL EN CREATE ORDER:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack');

    res.status(500).json({
      success: false,
      error: 'Error al crear pedido',
      message: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    });
  }
};

// Otras funciones del controlador
export const getOrders = async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de base de datos incompleta'
      });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener órdenes:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener órdenes',
        message: error.message
      });
    }

    res.json({
      success: true,
      data,
      message: 'Órdenes obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Error en getOrders:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Función para obtener paquetes - DESDE SUPABASE
export const getPackages = async (req: Request, res: Response) => {
  try {
    console.log('📦 Solicitando paquetes desde Supabase...');

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de base de datos incompleta'
      });
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al obtener paquetes:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener paquetes',
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error en getPackages:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Función para obtener categorías - DESDE SUPABASE
export const getCategories = async (req: Request, res: Response) => {
  try {
    console.log('📂 Solicitando categorías desde Supabase...');

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de base de datos incompleta'
      });
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al obtener categorías:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener categorías',
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error en getCategories:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Función para obtener sabores - DESDE SUPABASE
export const getFlavors = async (req: Request, res: Response) => {
  try {
    console.log('🍬 Solicitando sabores desde Supabase...');
    const { categoryId } = req.params;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de base de datos incompleta'
      });
    }

    let query = supabase
      .from('flavors')
      .select('*')
      .order('created_at', { ascending: true });

    // Filtrar por categoría si se proporciona
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al obtener sabores:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener sabores',
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error en getFlavors:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Función para obtener tipos de machucado - DESDE SUPABASE
export const getCrushedTypes = async (req: Request, res: Response) => {
  try {
    console.log('🔨 Solicitando tipos de machucado desde Supabase...');

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de base de datos incompleta'
      });
    }

    const { data, error } = await supabase
      .from('crushed_types')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al obtener tipos de machucado:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de machucado',
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error en getCrushedTypes:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Función para subir comprobante de pago - SUPABASE STORAGE
export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    console.log('📤 Recibiendo comprobante de pago...');
    console.log('Archivo recibido:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se recibió ningún archivo'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de Supabase incompleta'
      });
    }

    // Generar nombre único para el archivo
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    console.log('📤 Subiendo archivo a Supabase Storage...');

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Error subiendo a Supabase Storage:', uploadError);
      return res.status(500).json({
        success: false,
        error: 'Error al subir archivo',
        message: uploadError.message
      });
    }

    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    console.log('✅ Archivo subido exitosamente a Supabase Storage');
    console.log('🔗 URL pública:', urlData.publicUrl);

    res.json({
      success: true,
      message: 'Comprobante subido exitosamente',
      url: urlData.publicUrl,
      filename: fileName
    });

  } catch (error) {
    console.error('Error en uploadPaymentProof:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Función para obtener ventas diarias
export const getDailySales = async (req: Request, res: Response) => {
  try {
    console.log('📊 Solicitando ventas diarias...');

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuración de base de datos incompleta'
      });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', new Date().toISOString().split('T')[0]);

    if (error) {
      console.error('Error al obtener ventas diarias:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener ventas diarias',
        message: error.message
      });
    }

    const totalSales = data.reduce((sum: number, order: any) => sum + (order.amount || 0), 0);

    res.json({
      success: true,
      data: {
        orders: data,
        totalOrders: data.length,
        totalSales: totalSales
      }
    });
  } catch (error) {
    console.error('Error en getDailySales:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};