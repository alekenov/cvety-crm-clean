import React, { useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

const sampleProducts = [
  {
    name: 'Классические красные розы',
    description: 'Элегантный букет из 11 красных роз с зеленью',
    category: 'bouquets',
    composition: [
      { name: 'Красная роза', quantity: 11 },
      { name: 'Рускус', quantity: 3 }
    ]
  },
  {
    name: 'Нежный микс',
    description: 'Романтичный букет из роз и хризантем в нежных тонах',
    category: 'bouquets',
    composition: [
      { name: 'Розовая роза', quantity: 5 },
      { name: 'Хризантема', quantity: 3 },
      { name: 'Эустома', quantity: 2 }
    ]
  },
  {
    name: 'Весенний букет',
    description: 'Яркий весенний букет из тюльпанов и нарциссов',
    category: 'bouquets',
    composition: [
      { name: 'Тюльпан', quantity: 7 },
      { name: 'Нарцисс', quantity: 5 },
      { name: 'Гипсофила', quantity: 3 }
    ]
  },
  {
    name: 'Пионовое облако',
    description: 'Роскошный монобукет из пионов',
    category: 'bouquets',
    composition: [
      { name: 'Пион', quantity: 7 },
      { name: 'Эвкалипт', quantity: 3 }
    ]
  },
  {
    name: 'Летний микс',
    description: 'Яркий летний букет из различных сезонных цветов',
    category: 'bouquets',
    composition: [
      { name: 'Гербера', quantity: 5 },
      { name: 'Альстромерия', quantity: 3 },
      { name: 'Хризантема', quantity: 4 },
      { name: 'Эвкалипт', quantity: 2 }
    ]
  }
];

const CreateSampleProducts = () => {
  useEffect(() => {
    const createProducts = async () => {
      try {
        // Получаем все доступные цветы из инвентаря
        const { data: inventory, error: inventoryError } = await supabase
          .from('inventory')
          .select('*')
          .gt('stock', 0);

        if (inventoryError) throw inventoryError;

        // Создаем каждый продукт
        for (const product of sampleProducts) {
          // Создаем продукт
          const { data: productData, error: productError } = await supabase
            .from('products')
            .insert([{
              name: product.name,
              description: product.description,
              category: product.category,
              sku: product.name.slice(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-4),
              status: 'active'
            }])
            .select()
            .single();

          if (productError) throw productError;

          // Создаем композицию для продукта
          const composition = product.composition.map(item => {
            // Ищем цветок в инвентаре, учитывая возможные вариации названий
            const flower = inventory.find(i => {
              const inventoryName = i.name.toLowerCase().trim();
              const searchName = item.name.toLowerCase().trim();
              
              // Сопоставляем названия цветов
              switch (searchName) {
                case 'красная роза':
                  return inventoryName.includes('freedom');
                case 'розовая роза':
                  return inventoryName.includes('pink mondial');
                default:
                  return inventoryName.includes(searchName);
              }
            });

            if (!flower) {
              console.warn(`Цветок ${item.name} не найден в инвентаре`);
              return null;
            }

            return {
              product_id: productData.id,
              inventory_item_id: flower.id,
              quantity: item.quantity
            };
          }).filter(Boolean);

          if (composition.length > 0) {
            const { error: compositionError } = await supabase
              .from('product_compositions')
              .insert(composition);

            if (compositionError) throw compositionError;
          }

          toast.success(`Создан продукт: ${product.name}`);
        }

        toast.success('Все тестовые продукты успешно созданы!');
      } catch (error) {
        console.error('Ошибка при создании тестовых продуктов:', error);
        toast.error('Ошибка при создании продуктов');
      }
    };

    createProducts();
  }, []);

  return null;
};

export default CreateSampleProducts;
