import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

async function createTagsTables(client) {
  const createTagsTableQuery = `
    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
  `;

  const createClientTagsTableQuery = `
    CREATE TABLE IF NOT EXISTS client_tags (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(client_id, tag_id),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_client_tags_client ON client_tags(client_id);
    CREATE INDEX IF NOT EXISTS idx_client_tags_tag ON client_tags(tag_id);
  `;

  try {
    // Создаем таблицу tags
    await client.query(createTagsTableQuery);
    console.log('Tags table created successfully');

    // Создаем таблицу client_tags
    await client.query(createClientTagsTableQuery);
    console.log('Client tags table created successfully');
  } catch (error) {
    console.error('Error creating tags tables:', error);
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

    await createTagsTables(client);
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
