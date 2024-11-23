CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE order_status AS ENUM ('new', 'processing', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer');
CREATE TYPE employee_role AS ENUM ('admin', 'manager', 'florist', 'courier');
CREATE TYPE inventory_type AS ENUM ('flower', 'material', 'packaging');
CREATE TYPE inventory_unit AS ENUM ('piece', 'stem', 'meter', 'gram');
CREATE TYPE item_status AS ENUM ('active', 'inactive');

-- Create tables
CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    working_hours JSONB,
    settings JSONB,
    status item_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    role employee_role NOT NULL,
    shop_id UUID REFERENCES shops(id),
    settings JSONB,
    status item_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type inventory_type NOT NULL,
    unit inventory_unit NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    stock NUMERIC NOT NULL DEFAULT 0,
    min_stock NUMERIC NOT NULL DEFAULT 0,
    shop_id UUID REFERENCES shops(id),
    status item_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    base_price NUMERIC NOT NULL DEFAULT 0,
    markup_amount NUMERIC NOT NULL DEFAULT 0,
    packaging_cost NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    status item_status DEFAULT 'active',
    image_url TEXT,
    sku TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status order_status DEFAULT 'new',
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    delivery_address TEXT,
    delivery_time TIMESTAMP WITH TIME ZONE,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_status payment_status DEFAULT 'pending',
    payment_method payment_method,
    employee_id UUID REFERENCES employees(id),
    shop_id UUID REFERENCES shops(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_compositions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    cost NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_client_phone ON orders(client_phone);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory(type);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_compositions_updated_at
    BEFORE UPDATE ON product_compositions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
