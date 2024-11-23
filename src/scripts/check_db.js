import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres.tbjozecglteemnrbtjsb:qanpep-nukwY2-wazkex@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Проверяем структуру таблицы products
    const tableQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM 
        information_schema.columns
      WHERE 
        table_name = 'products'
      ORDER BY 
        ordinal_position;
    `;

    const { rows } = await client.query(tableQuery);
    console.log('Table structure:', rows);

    // Проверяем данные в таблице
    const dataQuery = `
      SELECT * FROM products LIMIT 1;
    `;

    const { rows: productData } = await client.query(dataQuery);
    console.log('Sample product:', productData);

  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
}

checkDatabase();
