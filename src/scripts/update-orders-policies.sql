-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.orders;

-- Create updated policies
CREATE POLICY "Enable read access for all users" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON public.orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Enable update for service role" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Enable delete for service role" ON public.orders
  FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
