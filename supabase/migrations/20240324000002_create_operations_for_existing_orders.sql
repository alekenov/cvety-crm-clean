-- Create operations for existing orders that don't have operations yet
INSERT INTO operations (type, category, amount, description, order_id, created_at)
SELECT 
    'income' as type,
    'orders' as category,
    total_price as amount,
    'Оплата заказа #' || number as description,
    id as order_id,
    created_at
FROM orders o
WHERE NOT EXISTS (
    SELECT 1 
    FROM operations op 
    WHERE op.order_id = o.id
)
AND status != 'Не оплачен';
