// backend/src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase URL and Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://oexofjnctlgogrwqrswg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leG9mam5jdGxnb2dyd3Fyc3dnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYzNzcyMCwiZXhwIjoyMDYxMjEzNzIwfQ.xWyOD2R9biiBYweUICx8AEQyhDJSiKHgTh3fRxmzBqU'; // CAMBIADO AQUÍ

// Log para depuración - quita esto en producción
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;