// backend/src/controllers/qrController.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Obtener todos los códigos QR activos (para cliente)
export const getActiveQRCodes = async (req: Request, res: Response) => {
  try {
    console.log('📱 Obteniendo QR codes activos...');
    
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo QR codes:', error);
      return res.status(400).json({ 
        success: false,
        message: 'Error al obtener códigos QR', 
        error: error.message 
      });
    }

    console.log(`✅ QR codes encontrados: ${data?.length || 0}`);
    
    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('❌ Error en getActiveQRCodes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor', 
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener un QR por ID (para cliente)
export const getQRCodeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando QR por ID:', id);

    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('❌ QR no encontrado:', error);
      return res.status(404).json({ 
        success: false,
        message: 'Código QR no encontrado o no está activo'
      });
    }

    console.log('✅ QR encontrado:', data.name);
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('❌ Error en getQRCodeById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor', 
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};