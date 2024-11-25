import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbjozecglteemnrbtjsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam96ZWNnbHRlZW1ucmJ0anNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc0NzI5MCwiZXhwIjoyMDQ2MzIzMjkwfQ.nkvV6RgdgS4ODqTGQJLajOmAAq8sWFiqgF1ZtGU9OLM';

const supabase = createClient(supabaseUrl, supabaseKey);

const updateOrdersPolicies = async () => {
  // Обновляем политики через SQL API
  const { error } = await supabase
    .from('_sql')
    .insert({
      query: `
        -- Drop existing policies
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
        DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.orders;
        DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.orders;
        DROP POLICY IF EXISTS "Enable insert for service role" ON public.orders;
        DROP POLICY IF EXISTS "Enable update for service role" ON public.orders;
        DROP POLICY IF EXISTS "Enable delete for service role" ON public.orders;

        -- Create updated policies
        CREATE POLICY "Enable read access for all users" ON public.orders
          FOR SELECT USING (true);

        CREATE POLICY "Enable insert for service role" ON public.orders
          FOR INSERT WITH CHECK (true);

        CREATE POLICY "Enable update for service role" ON public.orders
          FOR UPDATE USING (true);

        CREATE POLICY "Enable delete for service role" ON public.orders
          FOR DELETE USING (true);
      `
    });

  if (error) {
    console.error('Error updating orders policies:', error);
  } else {
    console.log('Orders policies updated successfully');
  }
};

updateOrdersPolicies()
  .then(() => console.log('Setup completed'))
  .catch(console.error);
