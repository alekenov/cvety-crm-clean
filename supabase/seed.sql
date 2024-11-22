-- Insert test shops
INSERT INTO public.shops (name, address, phone, whatsapp, instagram, working_hours, settings)
VALUES
    (
        'Абая',
        'ул. Абая, 10',
        '+7 (777) 111-11-11',
        '+7 (777) 111-11-12',
        '@abay_flowers',
        '{"weekdays": {"open": "09:00", "close": "20:00"}, "weekend": {"open": "10:00", "close": "18:00"}}'::jsonb,
        '{"pickup": true, "delivery": true, "marketplace": true}'::jsonb
    ),
    (
        'Достык',
        'пр. Достык, 89',
        '+7 (777) 222-22-22',
        '+7 (777) 222-22-23',
        '@dostyk_flowers',
        '{"weekdays": {"open": "09:00", "close": "21:00"}, "weekend": {"open": "10:00", "close": "19:00"}}'::jsonb,
        '{"pickup": true, "delivery": false, "marketplace": true}'::jsonb
    );

-- Insert test employees
INSERT INTO public.employees (shop_id, name, role, phone)
SELECT 
    shops.id,
    'Анна Иванова',
    'Флорист',
    '+7 (777) 123-45-67'
FROM public.shops
WHERE name = 'Абая'
UNION ALL
SELECT 
    shops.id,
    'Мария Петрова',
    'Флорист',
    '+7 (777) 234-56-78'
FROM public.shops
WHERE name = 'Достык';
