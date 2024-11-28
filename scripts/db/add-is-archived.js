import { addIsArchivedColumn } from './migrations.js';

async function main() {
  try {
    await addIsArchivedColumn();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
