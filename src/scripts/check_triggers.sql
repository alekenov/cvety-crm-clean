-- Проверяем существующие триггеры для таблицы products
SELECT 
    tgname as trigger_name,
    pg_get_triggerdef(oid) as trigger_definition
FROM pg_trigger
WHERE tgrelid = 'products'::regclass;
