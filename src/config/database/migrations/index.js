import { supabase } from '../db';

// Функция для создания таблиц
export const createTables = async () => {
  // Создание таблицы заказов
  const { error: ordersError } = await supabase.rpc('create_orders_table');
  if (ordersError) throw ordersError;

  // Создание таблицы клиентов
  const { error: clientsError } = await supabase.rpc('create_clients_table');
  if (clientsError) throw clientsError;

  // Создание таблицы магазинов
  const { error: shopsError } = await supabase.rpc('create_shops_table');
  if (shopsError) throw shopsError;

  // Создание таблицы сотрудников
  const { error: employeesError } = await supabase.rpc('create_employees_table');
  if (employeesError) throw employeesError;

  // Создание таблицы товаров
  const { error: productsError } = await supabase.rpc('create_products_table');
  if (productsError) throw productsError;
};

// Функция для обновления структуры таблиц
export const updateTables = async () => {
  // Здесь будут миграции для обновления структуры таблиц
};

// Функция для создания индексов
export const createIndexes = async () => {
  // Создание индексов для оптимизации запросов
  const queries = [
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
    'CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id)',
    'CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id)',
    'CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone)',
    'CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role)',
    'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)'
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('run_sql', { query });
    if (error) throw error;
  }
};

// Функция для создания триггеров
export const createTriggers = async () => {
  // Триггер для обновления updated_at
  const updateTimestampTrigger = `
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  // Применяем триггер ко всем таблицам
  const tables = ['orders', 'clients', 'shops', 'employees', 'products'];
  
  for (const table of tables) {
    const createTrigger = `
      CREATE TRIGGER update_timestamp_trigger
      BEFORE UPDATE ON ${table}
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `;
    
    const { error } = await supabase.rpc('run_sql', { 
      query: createTrigger 
    });
    if (error) throw error;
  }
};

// Основная функция для инициализации БД
export const initializeDatabase = async () => {
  try {
    await createTables();
    await createIndexes();
    await createTriggers();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
