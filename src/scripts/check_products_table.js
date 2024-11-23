import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkProductsTable() {
  try {
    // Получаем структуру таблицы
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'products' });

    if (tableError) {
      console.error('Error getting table info:', tableError);
      return;
    }

    console.log('Table structure:', tableInfo);

    // Получаем один продукт для примера
    const { data: sampleProduct, error: productError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
      .single();

    if (productError) {
      console.error('Error getting sample product:', productError);
      return;
    }

    console.log('Sample product:', sampleProduct);
    console.log('Product columns:', Object.keys(sampleProduct));

  } catch (error) {
    console.error('Error:', error);
  }
}

checkProductsTable();
