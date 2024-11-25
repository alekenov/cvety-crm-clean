const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbUrl = process.env.REACT_APP_SUPABASE_DB_URL;

if (!dbUrl) {
  console.error('Missing database URL');
  process.exit(1);
}

async function setupDatabase() {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Starting database setup...');
    await client.connect();
    console.log('Connected to database');

    // Read the SQL file
    const sqlContent = fs.readFileSync(
      path.resolve(__dirname, './inventory-history-setup.sql'),
      'utf8'
    );

    // Execute the SQL
    await client.query(sqlContent);
    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
