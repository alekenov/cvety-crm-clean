-- Drop existing objects if they exist
DROP VIEW IF EXISTS inventory_history_view;
DROP TABLE IF EXISTS inventory_history_items;
DROP TABLE IF EXISTS inventory_history;
DROP TYPE IF EXISTS inventory_operation_type;

-- Create enum for operation types
CREATE TYPE inventory_operation_type AS ENUM (
    'RECEIPT',      -- Приход товара
    'WRITEOFF',     -- Списание
    'ORDER_USE',    -- Использование в заказе
    'RETURN',       -- Возврат
    'ADJUSTMENT'    -- Корректировка
);

-- Create table for inventory history
CREATE TABLE inventory_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    operation_type inventory_operation_type NOT NULL,
    operation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    order_id UUID NULL,  -- NULL if not related to order
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for inventory history items (details of each operation)
CREATE TABLE inventory_history_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    history_id UUID REFERENCES inventory_history(id) ON DELETE CASCADE,
    flower_name TEXT NOT NULL,
    stem_length INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_history_operation_date ON inventory_history(operation_date);
CREATE INDEX IF NOT EXISTS idx_inventory_history_operation_type ON inventory_history(operation_type);
CREATE INDEX IF NOT EXISTS idx_inventory_history_user_id ON inventory_history(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_order_id ON inventory_history(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_items_history_id ON inventory_history_items(history_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_items_flower_name ON inventory_history_items(flower_name);

-- Add RLS policies
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated to view inventory history" ON inventory_history;
DROP POLICY IF EXISTS "Allow authenticated to view inventory history items" ON inventory_history_items;
DROP POLICY IF EXISTS "Allow authenticated to insert inventory history" ON inventory_history;
DROP POLICY IF EXISTS "Allow authenticated to insert inventory history items" ON inventory_history_items;

-- Allow authenticated users to view history
CREATE POLICY "Allow authenticated to view inventory history"
ON inventory_history FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated to view inventory history items"
ON inventory_history_items FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert history
CREATE POLICY "Allow authenticated to insert inventory history"
ON inventory_history FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to insert inventory history items"
ON inventory_history_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_inventory_history_updated_at ON inventory_history;
DROP TRIGGER IF EXISTS update_inventory_history_items_updated_at ON inventory_history_items;

-- Create triggers for updated_at
CREATE TRIGGER update_inventory_history_updated_at
    BEFORE UPDATE ON inventory_history
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_inventory_history_items_updated_at
    BEFORE UPDATE ON inventory_history_items
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create view for easier querying
CREATE OR REPLACE VIEW inventory_history_view AS
SELECT 
    h.id,
    h.operation_type,
    h.operation_date,
    h.user_id,
    h.order_id,
    h.comment,
    COALESCE(json_agg(
        CASE WHEN i.id IS NOT NULL THEN
            json_build_object(
                'flower_name', i.flower_name,
                'stem_length', i.stem_length,
                'quantity', i.quantity,
                'price', i.price
            )
        ELSE NULL END
    ) FILTER (WHERE i.id IS NOT NULL), '[]'::json) as items
FROM inventory_history h
LEFT JOIN inventory_history_items i ON h.id = i.history_id
GROUP BY h.id, h.operation_type, h.operation_date, h.user_id, h.order_id, h.comment;

-- Add example data for testing
INSERT INTO inventory_history (operation_type, comment)
VALUES 
    ('RECEIPT', 'Первичное поступление цветов'),
    ('ORDER_USE', 'Использовано в заказе №1235'),
    ('WRITEOFF', 'Списание испорченных цветов');

INSERT INTO inventory_history_items (history_id, flower_name, stem_length, quantity, price)
SELECT 
    h.id,
    'Роза Red Naomi',
    60,
    100,
    2000
FROM inventory_history h
WHERE h.comment = 'Первичное поступление цветов'
UNION ALL
SELECT 
    h.id,
    'Гвоздика розовая',
    50,
    50,
    1000
FROM inventory_history h
WHERE h.comment = 'Первичное поступление цветов';
