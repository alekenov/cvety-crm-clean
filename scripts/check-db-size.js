const { executeSQL } = require('./db-utils');

async function checkDatabaseSize() {
  const queries = [
    // Общий размер базы данных
    `SELECT pg_size_pretty(pg_database_size(current_database())) as db_size;`,
    
    // Размер каждой таблицы
    `SELECT 
      table_name,
      pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as total_size,
      pg_size_pretty(pg_relation_size(quote_ident(table_name))) as table_size,
      pg_size_pretty(pg_indexes_size(quote_ident(table_name))) as index_size,
      (SELECT COUNT(*) FROM quote_ident(table_name)) as row_count
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;`,
    
    // Размер каждой схемы
    `SELECT 
      schema_name,
      pg_size_pretty(sum(pg_total_relation_size(quote_ident(table_name)))) as schema_size
    FROM information_schema.tables 
    GROUP BY schema_name
    ORDER BY sum(pg_total_relation_size(quote_ident(table_name))) DESC;`
  ];

  try {
    console.log('=== Database Size Analysis ===\n');
    
    // Общий размер БД
    const dbSizeResult = await executeSQL(queries[0]);
    console.log('Total Database Size:', dbSizeResult.rows[0].db_size);
    console.log('\n=== Table Sizes ===\n');
    
    // Размеры таблиц
    const tableSizesResult = await executeSQL(queries[1]);
    tableSizesResult.rows.forEach(row => {
      console.log(`Table: ${row.table_name}`);
      console.log(`- Total Size: ${row.total_size}`);
      console.log(`- Table Size: ${row.table_size}`);
      console.log(`- Index Size: ${row.index_size}`);
      console.log(`- Row Count: ${row.row_count}`);
      console.log('---');
    });
    
    // Размеры схем
    console.log('\n=== Schema Sizes ===\n');
    const schemaSizesResult = await executeSQL(queries[2]);
    schemaSizesResult.rows.forEach(row => {
      console.log(`Schema: ${row.schema_name}`);
      console.log(`Size: ${row.schema_size}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error analyzing database size:', error);
  }
}

checkDatabaseSize();
