import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbjozecglteemnrbtjsb.supabase.co';
const supabaseKey = 'becgyc-cimVi9-jurrem';

export const supabase = createClient(supabaseUrl, supabaseKey);
