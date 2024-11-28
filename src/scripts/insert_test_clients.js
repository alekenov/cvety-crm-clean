const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.REACT_APP_SUPABASE_DIRECT_URL,
});

const testClients = [
  { name: 'Анна Петрова', phone: '+7 701 234 5601' },
  { name: 'Елена Смирнова', phone: '+7 702 345 6702' },
  { name: 'Мария Иванова', phone: '+7 705 456 7803' },
  { name: 'Ольга Козлова', phone: '+7 707 567 8904' },
  { name: 'Наталья Морозова', phone: '+7 708 678 9005' },
  { name: 'Татьяна Волкова', phone: '+7 747 789 0106' },
  { name: 'София Павлова', phone: '+7 776 890 1207' },
  { name: 'Дарья Соколова', phone: '+7 777 901 2308' },
  { name: 'Алиса Новикова', phone: '+7 778 012 3409' },
  { name: 'Екатерина Попова', phone: '+7 700 123 4510' }
];

async function insertTestClients() {
  const client = await pool.connect();
  try {
    console.log('Starting to insert test clients...');
    
    for (const testClient of testClients) {
      try {
        const result = await client.query(
          'INSERT INTO clients (name, phone, created_at) VALUES ($1, $2, NOW()) RETURNING *',
          [testClient.name, testClient.phone]
        );
        console.log(`Inserted client: ${result.rows[0].name}`);
      } catch (err) {
        if (err.code === '23505') { // unique violation
          console.log(`Skipping duplicate client: ${testClient.name} (${testClient.phone})`);
        } else {
          console.error(`Error inserting ${testClient.name}:`, err.message);
        }
      }
    }
    
    console.log('Finished inserting test clients');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

insertTestClients();
