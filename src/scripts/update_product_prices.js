import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductPrices() {
  try {
    // Получаем все продукты с их составом
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        product_compositions (
          quantity,
          inventory_item:inventory_item_id (
            price
          )
        )
      `);

    if (productsError) {
      throw productsError;
    }

    console.log(`Found ${products.length} products to update`);

    // Обновляем цены для каждого продукта
    for (const product of products) {
      // Рассчитываем базовую цену на основе состава
      const basePrice = product.product_compositions.reduce((sum, item) => {
        const price = item.inventory_item?.price || 0;
        const quantity = item.quantity || 0;
        return sum + (price * quantity);
      }, 0);

      // Обновляем цены в базе данных
      const { error: updateError } = await supabase
        .from('products')
        .update({
          price: basePrice,
          base_price: basePrice,
          markup_amount: basePrice * 0.3,
          packaging_cost: 2000
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError);
        continue;
      }

      console.log(`Updated prices for product ${product.id} (${product.name}): Base price = ${basePrice}`);
    }

    console.log('Price update completed successfully');
  } catch (error) {
    console.error('Error updating prices:', error);
  } finally {
    process.exit();
  }
}

updateProductPrices();
