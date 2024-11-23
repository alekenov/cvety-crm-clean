import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tbjozecglteemnrbtjsb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam96ZWNnbHRlZW1ucmJ0anNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NDcyOTAsImV4cCI6MjA0NjMyMzI5MH0.LLeuhNyCuNYZj2Jl14b_9-yCywKvXArmGWZk1u4qFdY'
);

async function testProducts() {
  try {
    // Пробуем создать тестовый продукт
    const testProduct = {
      name: 'Test Product',
      category: 'test',
      status: 'active',
      sku: 'TEST-001',
      price: 0,
      base_price: 0,
      markup_amount: 0,
      packaging_cost: 2000
    };

    console.log('Trying to create product:', testProduct);

    const { data, error } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return;
    }

    console.log('Created product:', data);

    // Пробуем обновить продукт
    const update = {
      name: 'Updated Test Product'
    };

    console.log('Trying to update product:', update);

    const { data: updatedData, error: updateError } = await supabase
      .from('products')
      .update(update)
      .eq('id', data.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return;
    }

    console.log('Updated product:', updatedData);

    // Удаляем тестовый продукт
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return;
    }

    console.log('Successfully deleted test product');

  } catch (err) {
    console.error('Test error:', err);
  }
}

testProducts();
