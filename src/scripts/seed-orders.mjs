import { createClient } from '@supabase/supabase-js';
import { subDays, addHours } from 'date-fns';
import { promises as fs } from 'fs';
import * as dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// Загружаем переменные окружения из файла .env
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const orderStatuses = [
  'new',           // Новый заказ
  'confirmed',     // Подтвержден
  'in_progress',   // В работе
  'ready',         // Готов
  'delivering',    // Доставляется
  'completed',     // Выполнен
  'cancelled'      // Отменен
];

const products = [
  { id: 1, name: 'Букет "Весенний"', price: 15000 },
  { id: 2, name: 'Букет "Летний"', price: 12000 },
  { id: 3, name: 'Букет "Осенний"', price: 13000 },
  { id: 4, name: 'Букет "Зимний"', price: 14000 }
];

const clients = [
  { name: 'Анна', phone: '+7777123456', address: 'ул. Абая 1' },
  { name: 'Мария', phone: '+7777234567', address: 'ул. Жандосова 15' },
  { name: 'Елена', phone: '+7777345678', address: 'ул. Саина 24' },
  { name: 'Дмитрий', phone: '+7777456789', address: 'пр. Достык 128' },
  { name: 'Александр', phone: '+7777567890', address: 'ул. Тимирязева 42' }
];

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const generateOrder = (index, shopId) => {
  const orderDate = subDays(new Date(), Math.floor(Math.random() * 30));
  const client = getRandomItem(clients);
  const product = getRandomItem(products);
  const status = orderStatuses[Math.min(Math.floor(index / 3), orderStatuses.length - 1)];
  const deliveryType = Math.random() > 0.5 ? 'delivery' : 'pickup';
  
  return {
    shop_id: shopId, 
    client_name: client.name,
    client_phone: client.phone,
    delivery_type: deliveryType,
    delivery_address: deliveryType === 'delivery' ? client.address : null,
    status: status,
    total_amount: product.price,
    delivery_date: addHours(orderDate, Math.floor(Math.random() * 72)).toISOString(),
    products: [
      {
        product_id: product.id,
        name: product.name,
        quantity: 1,
        price: product.price
      }
    ],
    notes: `Тестовый заказ #${index + 1}`,
    created_at: orderDate.toISOString(),
    updated_at: addHours(orderDate, Math.floor(Math.random() * 48)).toISOString()
  };
};

const seedOrders = async () => {
  // Читаем ID магазина из файла
  let shopId;
  try {
    shopId = await fs.readFile('shop_id.txt', 'utf-8');
  } catch (error) {
    console.error('Error reading shop ID:', error);
    return;
  }

  // Создаем 20 заказов
  const orders = Array.from({ length: 20 }, (_, i) => generateOrder(i, shopId));
  
  for (const order of orders) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order]);
      
    if (error) {
      console.error('Error inserting order:', error);
    } else {
      console.log('Order created:', order.client_name, order.status);
    }
  }
};

seedOrders()
  .then(() => console.log('Seed completed'))
  .catch(console.error);
