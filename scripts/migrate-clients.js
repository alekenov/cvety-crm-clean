import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

async function createClientsTable(client) {
  const createExtensionQuery = `
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
  `;

  const createClientsTableQuery = `
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      contacts JSONB,
      total_orders INTEGER DEFAULT 0,
      total_spent DECIMAL(10,2) DEFAULT 0.00,
      last_order DATE,
      join_date DATE DEFAULT CURRENT_DATE,
      preferences JSONB,
      notes JSONB,
      important_dates JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_clients_name ON clients USING gin (name gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients USING gin (phone gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients (created_at DESC);
  `;

  try {
    // Создаем расширение pg_trgm
    await client.query(createExtensionQuery);
    console.log('pg_trgm extension created successfully');

    // Создаем таблицу clients
    await client.query(createClientsTableQuery);
    console.log('Clients table created successfully');
  } catch (error) {
    console.error('Error creating clients table:', error);
    throw error;
  }
}

async function main() {
  if (!process.env.REACT_APP_SUPABASE_DIRECT_URL) {
    console.error('Missing REACT_APP_SUPABASE_DIRECT_URL environment variable');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.REACT_APP_SUPABASE_DIRECT_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    console.log('Connected to database');

    await createClientsTable(client);
    console.log('Migration completed successfully');

    await client.release();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
