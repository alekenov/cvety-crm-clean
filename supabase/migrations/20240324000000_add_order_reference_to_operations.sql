-- Add order_id column to operations table
ALTER TABLE IF EXISTS public.operations
ADD COLUMN order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS operations_order_id_idx ON public.operations(order_id);

-- Add RLS policies for operations
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;

-- Create policies for operations
CREATE POLICY "Enable read access for all users" ON public.operations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.operations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.operations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.operations
    FOR DELETE USING (auth.role() = 'authenticated');
