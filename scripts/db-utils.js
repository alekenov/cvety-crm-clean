const { Client } = require('pg');
require('dotenv').config();

const dbUrl = process.env.REACT_APP_SUPABASE_DB_URL;

async function executeSQL(sqlQuery) {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    const result = await client.query(sqlQuery);
    console.log('Query executed successfully');
    
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = {
  executeSQL
};
