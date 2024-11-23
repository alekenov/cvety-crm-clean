const { supabase } = require('./supabase-config');

const inventory = [
  {
    name: 'Freedom (красная роза)',
    type: 'flower',
    unit: 'stem',
    price: 400,
    stock: 1000,
    min_stock: 100,
    status: 'active'
  },
  {
    name: 'Pink Mondial (розовая роза)',
    type: 'flower',
    unit: 'stem',
    price: 590,
    stock: 1000,
    min_stock: 100,
    status: 'active'
  },
  {
    name: 'Рускус',
    type: 'flower',
    unit: 'stem',
    price: 350,
    stock: 500,
    min_stock: 50,
    status: 'active'
  },
  {
    name: 'Эвкалипт',
    type: 'flower',
    unit: 'stem',
    price: 350,
    stock: 500,
    min_stock: 50,
    status: 'active'
  },
  {
    name: 'Тюльпан',
    type: 'flower',
    unit: 'stem',
    price: 450,
    stock: 800,
    min_stock: 100,
    status: 'active'
  },
  {
    name: 'Нарцисс',
    type: 'flower',
    unit: 'stem',
    price: 380,
    stock: 500,
    min_stock: 50,
    status: 'active'
  },
  {
    name: 'Пион',
    type: 'flower',
    unit: 'stem',
    price: 2000,
    stock: 300,
    min_stock: 30,
    status: 'active'
  },
  {
    name: 'Хризантема',
    type: 'flower',
    unit: 'stem',
    price: 450,
    stock: 600,
    min_stock: 60,
    status: 'active'
  },
  {
    name: 'Гербера',
    type: 'flower',
    unit: 'stem',
    price: 500,
    stock: 400,
    min_stock: 40,
    status: 'active'
  },
  {
    name: 'Альстромерия',
    type: 'flower',
    unit: 'stem',
    price: 450,
    stock: 400,
    min_stock: 40,
    status: 'active'
  },
  {
    name: 'Эустома',
    type: 'flower',
    unit: 'stem',
    price: 600,
    stock: 300,
    min_stock: 30,
    status: 'active'
  },
  {
    name: 'Гипсофила',
    type: 'flower',
    unit: 'stem',
    price: 450,
    stock: 300,
    min_stock: 30,
    status: 'active'
  }
];

async function seedInventory() {
  try {
    console.log('Adding inventory items...');
    const { data, error } = await supabase
      .from('inventory')
      .insert(inventory)
      .select();

    if (error) {
      console.error('Error adding inventory:', error);
      throw error;
    }

    console.log('Inventory items added successfully:', data);
  } catch (error) {
    console.error('Error seeding inventory:', error);
  }
}

seedInventory();
