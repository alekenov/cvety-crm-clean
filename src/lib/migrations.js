import { supabaseAdmin } from './supabase.js';

// Function to check if tables exist
export async function checkTagsTables() {
  try {
    const { data: tagsData, error: tagsError } = await supabaseAdmin
      .from('tags')
      .select('count(*)', { count: 'exact' });

    const { data: clientTagsData, error: clientTagsError } = await supabaseAdmin
      .from('client_tags')
      .select('count(*)', { count: 'exact' });

    return {
      tagsExist: !tagsError,
      clientTagsExist: !clientTagsError,
      tagsCount: tagsData?.[0]?.count || 0,
      clientTagsCount: clientTagsData?.[0]?.count || 0
    };
  } catch (error) {
    console.error('Error checking tables:', error);
    throw error;
  }
}

// Function to create tags tables
export async function createTagsTables() {
  try {
    const { tagsExist, clientTagsExist } = await checkTagsTables();

    if (!tagsExist) {
      const { error: createTagsError } = await supabaseAdmin.query(`
        CREATE TABLE IF NOT EXISTS tags (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
      `);

      if (createTagsError) throw createTagsError;
      console.log('Tags table created successfully');
    }

    if (!clientTagsExist) {
      const { error: createClientTagsError } = await supabaseAdmin.query(`
        CREATE TABLE IF NOT EXISTS client_tags (
          id SERIAL PRIMARY KEY,
          client_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(client_id, tag_id),
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_client_tags_client ON client_tags(client_id);
        CREATE INDEX IF NOT EXISTS idx_client_tags_tag ON client_tags(tag_id);
      `);

      if (createClientTagsError) throw createClientTagsError;
      console.log('Client tags table created successfully');
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Function to create the clients table
export async function createClientsTable(client) {
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
