-- Drop existing table if exists
DROP TABLE IF EXISTS public.operations;

-- Create operations table in public schema
CREATE TABLE public.operations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    order_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    CONSTRAINT fk_order
        FOREIGN KEY (order_id)
        REFERENCES public.orders(id)
        ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX operations_type_idx ON public.operations(type);
CREATE INDEX operations_category_idx ON public.operations(category);
CREATE INDEX operations_order_id_idx ON public.operations(order_id);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::TEXT, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_operations_updated_at ON public.operations;
CREATE TRIGGER update_operations_updated_at
    BEFORE UPDATE ON public.operations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.operations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.operations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.operations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.operations
    FOR DELETE USING (auth.role() = 'authenticated');
