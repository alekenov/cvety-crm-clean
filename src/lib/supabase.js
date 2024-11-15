import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Отсутствуют необходимые переменные окружения для Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Хук для проверки соединения
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('Supabase подключение успешно');
    return true;
  } catch (error) {
    console.error('Ошибка подключения к Supabase:', error.message);
    return false;
  }
}; 