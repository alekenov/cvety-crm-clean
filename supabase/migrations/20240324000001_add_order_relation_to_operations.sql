-- Add order_id column to operations table
ALTER TABLE public.operations
ADD COLUMN order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX operations_order_id_idx ON public.operations(order_id);
