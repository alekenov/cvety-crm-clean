import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из локального .env файла
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: "Нежное облако",
    category: "bouquet",
    price: 15000,
    base_price: 10000,
    markup_amount: 3000,
    packaging_cost: 2000,
    description: "Воздушный букет из белых и розовых пионов с эвкалиптом",
    status: "active",
    image_url: "https://example.com/images/tender_cloud.jpg",
    sku: "BC-001"
  },
  {
    name: "Весенний бриз",
    category: "bouquet",
    price: 12000,
    base_price: 8000,
    markup_amount: 2500,
    packaging_cost: 1500,
    description: "Яркий букет из тюльпанов разных цветов",
    status: "active",
    image_url: "https://example.com/images/spring_breeze.jpg",
    sku: "BC-002"
  },
  {
    name: "Солнечное настроение",
    category: "bouquet",
    price: 18000,
    base_price: 12000,
    markup_amount: 4000,
    packaging_cost: 2000,
    description: "Букет из желтых роз и подсолнухов",
    status: "active",
    image_url: "https://example.com/images/sunny_mood.jpg",
    sku: "BC-003"
  },
  {
    name: "Розовая мечта",
    category: "bouquet",
    price: 20000,
    base_price: 14000,
    markup_amount: 4000,
    packaging_cost: 2000,
    description: "Роскошный букет из розовых роз и орхидей",
    status: "active",
    image_url: "https://example.com/images/pink_dream.jpg",
    sku: "BC-004"
  },
  {
    name: "Лесная сказка",
    category: "composition",
    price: 25000,
    base_price: 18000,
    markup_amount: 5000,
    packaging_cost: 2000,
    description: "Композиция из суккулентов и диких цветов в деревянном кашпо",
    status: "active",
    image_url: "https://example.com/images/forest_tale.jpg",
    sku: "CP-001"
  },
  {
    name: "Тропический рай",
    category: "composition",
    price: 30000,
    base_price: 22000,
    markup_amount: 6000,
    packaging_cost: 2000,
    description: "Экзотическая композиция из стрелиций и протей",
    status: "active",
    image_url: "https://example.com/images/tropical_paradise.jpg",
    sku: "CP-002"
  }
];

const inventory = [
  {
    name: "Роза красная",
    type: "flower",
    unit: "stem",
    price: 500,
    stock: 100,
    min_stock: 50,
    status: "active",
    shop_id: null
  },
  {
    name: "Роза розовая",
    type: "flower",
    unit: "stem",
    price: 500,
    stock: 100,
    min_stock: 50,
    status: "active",
    shop_id: null
  },
  {
    name: "Пион белый",
    type: "flower",
    unit: "stem",
    price: 800,
    stock: 60,
    min_stock: 30,
    status: "active",
    shop_id: null
  },
  {
    name: "Тюльпан микс",
    type: "flower",
    unit: "stem",
    price: 300,
    stock: 200,
    min_stock: 100,
    status: "active",
    shop_id: null
  },
  {
    name: "Орхидея",
    type: "flower",
    unit: "stem",
    price: 1500,
    stock: 40,
    min_stock: 20,
    status: "active",
    shop_id: null
  },
  {
    name: "Эвкалипт",
    type: "material",
    unit: "stem",
    price: 200,
    stock: 100,
    min_stock: 50,
    status: "active",
    shop_id: null
  },
  {
    name: "Суккулент",
    type: "flower",
    unit: "piece",
    price: 600,
    stock: 60,
    min_stock: 30,
    status: "active",
    shop_id: null
  },
  {
    name: "Стрелиция",
    type: "flower",
    unit: "stem",
    price: 2000,
    stock: 20,
    min_stock: 10,
    status: "active",
    shop_id: null
  }
];

const productCompositions = [
  {
    product_sku: "BC-001",
    compositions: [
      { inventory_name: "Пион белый", quantity: 7 },
      { inventory_name: "Эвкалипт", quantity: 5 }
    ]
  },
  {
    product_sku: "BC-002",
    compositions: [
      { inventory_name: "Тюльпан микс", quantity: 15 }
    ]
  },
  {
    product_sku: "BC-003",
    compositions: [
      { inventory_name: "Роза красная", quantity: 10 }
    ]
  },
  {
    product_sku: "BC-004",
    compositions: [
      { inventory_name: "Роза розовая", quantity: 12 },
      { inventory_name: "Орхидея", quantity: 3 }
    ]
  },
  {
    product_sku: "CP-001",
    compositions: [
      { inventory_name: "Суккулент", quantity: 5 }
    ]
  },
  {
    product_sku: "CP-002",
    compositions: [
      { inventory_name: "Стрелиция", quantity: 3 }
    ]
  }
];

async function seedProducts() {
  try {
    // Добавляем инвентарь
    console.log('Adding inventory items...');
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .insert(inventory)
      .select();

    if (inventoryError) {
      console.error('Error adding inventory:', inventoryError);
      throw inventoryError;
    }
    console.log('Inventory items added successfully');

    // Создаем мапинг имен инвентаря на их ID
    const inventoryMap = {};
    inventoryData.forEach(item => {
      inventoryMap[item.name] = item.id;
    });

    // Добавляем продукты
    console.log('Adding products...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (productsError) {
      console.error('Error adding products:', productsError);
      throw productsError;
    }
    console.log('Products added successfully');

    // Создаем мапинг SKU продуктов на их ID
    const productMap = {};
    productsData.forEach(product => {
      productMap[product.sku] = product.id;
    });

    // Добавляем составы продуктов
    console.log('Adding product compositions...');
    const compositions = [];
    productCompositions.forEach(pc => {
      pc.compositions.forEach(comp => {
        compositions.push({
          product_id: productMap[pc.product_sku],
          inventory_item_id: inventoryMap[comp.inventory_name],
          quantity: comp.quantity,
          cost: inventory.find(i => i.name === comp.inventory_name).price * comp.quantity
        });
      });
    });

    const { error: compositionsError } = await supabase
      .from('product_compositions')
      .insert(compositions);

    if (compositionsError) {
      console.error('Error adding compositions:', compositionsError);
      throw compositionsError;
    }
    console.log('Product compositions added successfully');

    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Запускаем функцию
seedProducts();
