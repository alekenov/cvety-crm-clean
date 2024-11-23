import { supabase } from '../lib/supabase.js';

const createProduct = async (product, composition) => {
  try {
    // Создаем продукт
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (productError) throw productError;

    // Создаем композицию для продукта
    const compositionWithProductId = composition.map(item => ({
      ...item,
      product_id: productData.id
    }));

    const { error: compositionError } = await supabase
      .from('product_compositions')
      .insert(compositionWithProductId);

    if (compositionError) throw compositionError;

    console.log(`Создан продукт: ${product.name}`);
    return productData;
  } catch (error) {
    console.error(`Ошибка при создании продукта ${product.name}:`, error);
    throw error;
  }
};

const createSampleProducts = async () => {
  try {
    // Получаем все доступные цветы из инвентаря
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .gt('quantity', 0);

    if (inventoryError) throw inventoryError;

    // 1. Классический букет из красных роз
    await createProduct(
      {
        name: 'Классические красные розы',
        description: 'Элегантный букет из 11 красных роз с зеленью',
        sku: 'RED-11R',
        base_price: 15000,
        markup_amount: 4500,
        total_price: 19500,
        status: 'active'
      },
      [
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('красная роза'))?.id, quantity: 11 },
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('рускус'))?.id, quantity: 3 }
      ]
    );

    // 2. Нежный микс
    await createProduct(
      {
        name: 'Нежный микс',
        description: 'Романтичный букет из роз и хризантем в нежных тонах',
        sku: 'MIX-RSC',
        base_price: 12000,
        markup_amount: 3600,
        total_price: 15600,
        status: 'active'
      },
      [
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('розовая роза'))?.id, quantity: 5 },
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('хризантема'))?.id, quantity: 3 },
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('эустома'))?.id, quantity: 2 }
      ]
    );

    // 3. Весенний букет
    await createProduct(
      {
        name: 'Весенний букет',
        description: 'Яркий весенний букет из тюльпанов и нарциссов',
        sku: 'SPR-TNR',
        base_price: 8000,
        markup_amount: 2400,
        total_price: 10400,
        status: 'active'
      },
      [
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('тюльпан'))?.id, quantity: 7 },
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('нарцисс'))?.id, quantity: 5 }
      ]
    );

    // 4. Монобукет из пионов
    await createProduct(
      {
        name: 'Пионовое облако',
        description: 'Роскошный монобукет из 9 пионов',
        sku: 'PEO-9P',
        base_price: 18000,
        markup_amount: 5400,
        total_price: 23400,
        status: 'active'
      },
      [
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('пион'))?.id, quantity: 9 }
      ]
    );

    // 5. Летний микс
    await createProduct(
      {
        name: 'Летний микс',
        description: 'Яркий летний букет из различных сезонных цветов',
        sku: 'SUM-MIX',
        base_price: 13500,
        markup_amount: 4050,
        total_price: 17550,
        status: 'active'
      },
      [
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('гербера'))?.id, quantity: 5 },
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('альстромерия'))?.id, quantity: 3 },
        { inventory_id: inventory.find(i => i.name.toLowerCase().includes('хризантема'))?.id, quantity: 4 }
      ]
    );

    console.log('Все тестовые продукты успешно созданы!');
  } catch (error) {
    console.error('Ошибка при создании тестовых продуктов:', error);
  }
};

createSampleProducts();
