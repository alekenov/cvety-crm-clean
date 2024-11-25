-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    delivery_type TEXT NOT NULL DEFAULT 'pickup',
    delivery_address TEXT,
    delivery_date TIMESTAMP WITH TIME ZONE,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    products JSONB NOT NULL DEFAULT '[]'::JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS orders_shop_id_idx ON public.orders(shop_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_delivery_date_idx ON public.orders(delivery_date);

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Enable read access for all users" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.orders
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.orders
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.orders
    FOR DELETE USING (auth.role() = 'authenticated');
