-- Insert test operations
INSERT INTO operations (type, category, amount, description, created_at) VALUES
  ('income', 'sales', 150000, 'Продажа букетов на 8 марта', NOW() - INTERVAL '1 day'),
  ('expense', 'inventory', 75000, 'Закуп цветов', NOW() - INTERVAL '1 day'),
  ('income', 'sales', 45000, 'Свадебный букет', NOW() - INTERVAL '2 days'),
  ('expense', 'salary', 120000, 'Зарплата флористам', NOW() - INTERVAL '3 days'),
  ('expense', 'rent', 200000, 'Аренда помещения за месяц', NOW() - INTERVAL '4 days'),
  ('income', 'sales', 85000, 'Корпоративный заказ', NOW() - INTERVAL '5 days'),
  ('expense', 'utilities', 25000, 'Коммунальные услуги', NOW() - INTERVAL '6 days'),
  ('income', 'sales', 35000, 'Букет на день рождения', NOW() - INTERVAL '7 days'),
  ('expense', 'inventory', 95000, 'Закуп упаковочных материалов', NOW() - INTERVAL '8 days'),
  ('income', 'other_income', 15000, 'Продажа горшечных растений', NOW() - INTERVAL '9 days');
