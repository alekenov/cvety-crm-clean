import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Начало проверки подключения к Supabase...');
  console.log('URL:', supabaseUrl);

  try {
    // Попытка получить первую запись из таблицы orders
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Ошибка при запросе:', error);
      return false;
    }

    console.log('✅ Успешное подключение!');
    console.log('Первая запись:', data);
    return true;
  } catch (err) {
    console.error('❌ Критическая ошибка:', err);
    return false;
  }
}

// Немедленный запуск теста
testSupabaseConnection().then(result => {
  console.log(result ? 'Подключение установлено' : 'Ошибка подключения');
});

export default testSupabaseConnection;
