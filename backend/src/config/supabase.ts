// backend/src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase URL and Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined.'
  );
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;