-- Добавляем колонку updated_at, если её нет
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now());

-- Создаем или заменяем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::TEXT, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Удаляем существующий триггер, если он есть
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Создаем новый триггер
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
