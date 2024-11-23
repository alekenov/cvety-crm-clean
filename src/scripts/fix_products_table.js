import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres.tbjozecglteemnrbtjsb:qanpep-nukwY2-wazkex@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'
});

async function fixProductsTable() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Проверяем текущую структуру таблицы
    const checkColumns = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position;
    `);
    
    console.log('Current table structure:', checkColumns.rows);

    // Добавляем колонку updated_at если её нет
    const addColumnResult = await client.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE products 
          ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now());
        EXCEPTION 
          WHEN duplicate_column THEN 
            NULL;
        END;
      END $$;
    `);
    
    console.log('Added updated_at column');

    // Создаем функцию для триггера
    const createFunctionResult = await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = timezone('utc'::TEXT, now());
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    console.log('Created trigger function');

    // Создаем триггер
    const createTriggerResult = await client.query(`
      DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at
          BEFORE UPDATE ON products
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);
    
    console.log('Created trigger');

    // Проверяем созданные объекты
    const checkTriggers = await client.query(`
      SELECT 
          tgname as trigger_name,
          pg_get_triggerdef(oid) as trigger_definition
      FROM pg_trigger
      WHERE tgrelid = 'products'::regclass;
    `);
    
    console.log('Current triggers:', checkTriggers.rows);

  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
}

fixProductsTable();
