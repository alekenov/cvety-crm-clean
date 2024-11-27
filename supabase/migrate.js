const { Client } = require('pg');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    connectionString: process.env.REACT_APP_SUPABASE_DIRECT_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Подключение установлено');

    const migrationQuery = `
      -- Добавление поля updated_at в таблицу orders
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

      -- Обновление существующих записей
      UPDATE orders 
      SET updated_at = created_at 
      WHERE updated_at IS NULL;

      -- Создание функции для автоматического обновления updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = CURRENT_TIMESTAMP;
         RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Удаление существующего триггера, если он есть
      DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

      -- Создание триггера
      CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `;

    const result = await client.query(migrationQuery);
    console.log('✅ Миграция выполнена успешно');
    console.log('Результат:', result);
  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    await client.end();
  }
}

runMigration();
