import { createTagsTables, checkTagsTables } from '../src/lib/migrations.js';

async function runMigrations() {
  try {
    // Проверяем существование таблиц
    const { tagsTableExists, clientTagsTableExists, error } = await checkTagsTables();
    
    if (!tagsTableExists || !clientTagsTableExists) {
      console.log('Creating tags tables...');
      await createTagsTables();
      console.log('Tags tables created successfully');
    } else {
      console.log('Tags tables already exist');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
