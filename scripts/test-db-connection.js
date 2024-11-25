const { executeSQL } = require('./db-utils');

async function testConnection() {
  try {
    const result = await executeSQL('SELECT current_timestamp;');
    console.log('Database time:', result.rows[0].current_timestamp);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();
