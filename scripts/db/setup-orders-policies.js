import { supabaseAdmin } from '../../src/lib/supabase.js';

async function setupOrdersPolicies() {
  try {
    // Включаем RLS для таблицы orders
    const { error: rlsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
      throw rlsError;
    }

    // Создаем политику для чтения всех заказов
    const { error: policyError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Enable read access for all users" ON orders
          FOR SELECT
          USING (true);
      `
    });

    if (policyError && !policyError.message.includes('already exists')) {
      console.error('Error creating policy:', policyError);
      throw policyError;
    }

    console.log('Successfully set up orders policies');
    return true;
  } catch (error) {
    console.error('Error in setupOrdersPolicies:', error);
    throw error;
  }
}

setupOrdersPolicies();
