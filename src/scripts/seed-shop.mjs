import { createClient } from '@supabase/supabase-js';
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

const shop = {
  name: 'Цветочный магазин',
  address: 'ул. Абая 17',
  phone: '+77771234567',
  whatsapp: '+77771234567',
  instagram: '@flower_shop',
  working_hours: {
    monday: { open: '09:00', close: '20:00' },
    tuesday: { open: '09:00', close: '20:00' },
    wednesday: { open: '09:00', close: '20:00' },
    thursday: { open: '09:00', close: '20:00' },
    friday: { open: '09:00', close: '20:00' },
    saturday: { open: '10:00', close: '18:00' },
    sunday: { open: '10:00', close: '18:00' }
  },
  settings: {
    pickup: true,
    delivery: true,
    marketplace: false
  }
};

const createShop = async () => {
  // Сначала проверяем, есть ли уже магазины
  const { data: existingShops, error: fetchError } = await supabase
    .from('shops')
    .select('id')
    .limit(1);
    
  if (fetchError) {
    console.error('Error fetching shops:', fetchError);
    return;
  }
  
  if (existingShops && existingShops.length > 0) {
    console.log('Found existing shop:', existingShops[0]);
    // Сохраняем ID существующего магазина
    const fs = await import('fs');
    await fs.promises.writeFile('shop_id.txt', existingShops[0].id);
    return;
  }

  // Если магазинов нет, создаем новый
  const { data, error } = await supabase
    .from('shops')
    .insert([shop])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating shop:', error);
  } else {
    console.log('Shop created:', data);
    
    // Сохраняем ID магазина в файл для использования в других скриптах
    const fs = await import('fs');
    await fs.promises.writeFile('shop_id.txt', data.id);
  }
};

createShop()
  .then(() => console.log('Shop creation completed'))
  .catch(console.error);
