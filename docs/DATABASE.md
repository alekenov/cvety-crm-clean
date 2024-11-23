# База данных CRM системы для цветочного магазина

## Общее описание

CRM система использует Supabase в качестве базы данных. Supabase предоставляет PostgreSQL базу данных с автоматически генерируемым REST API и real-time подпиской на изменения данных.

## Структура базы данных

### Основные таблицы

#### 1. Orders (Заказы)
- **Назначение**: Хранение информации о заказах клиентов
- **Основные поля**:
  - `id`: UUID (PK)
  - `status`: enum ('new', 'processing', 'completed', 'cancelled')
  - `client_name`: text
  - `client_phone`: text
  - `delivery_address`: text
  - `delivery_time`: timestamp
  - `total_amount`: numeric
  - `payment_status`: enum ('pending', 'paid', 'refunded')
  - `payment_method`: enum ('cash', 'card', 'transfer')
  - `employee_id`: UUID (FK to employees)
  - `shop_id`: UUID (FK to shops)
  - `notes`: text
  - `created_at`: timestamp
  - `updated_at`: timestamp

#### 2. Products (Продукты)
- **Назначение**: Каталог продуктов (букеты, композиции)
- **Основные поля**:
  - `id`: UUID (PK)
  - `name`: text
  - `category`: text
  - `price`: numeric
  - `base_price`: numeric
  - `markup_amount`: numeric
  - `packaging_cost`: numeric
  - `description`: text
  - `status`: enum ('active', 'inactive')
  - `image_url`: text
  - `sku`: text
  - `created_at`: timestamp
  - `updated_at`: timestamp

#### 3. Shops (Магазины)
- **Назначение**: Информация о магазинах сети
- **Основные поля**:
  - `id`: UUID (PK)
  - `name`: text
  - `address`: text
  - `phone`: text
  - `email`: text
  - `working_hours`: jsonb
  - `settings`: jsonb
  - `status`: enum ('active', 'inactive')
  - `created_at`: timestamp
  - `updated_at`: timestamp

#### 4. Employees (Сотрудники)
- **Назначение**: Информация о сотрудниках
- **Основные поля**:
  - `id`: UUID (PK)
  - `first_name`: text
  - `last_name`: text
  - `phone`: text
  - `email`: text
  - `role`: enum ('admin', 'manager', 'florist', 'courier')
  - `shop_id`: UUID (FK to shops)
  - `settings`: jsonb
  - `status`: enum ('active', 'inactive')
  - `created_at`: timestamp
  - `updated_at`: timestamp

### Связующие таблицы

#### 1. Order Items (Позиции заказа)
- **Назначение**: Связь заказов с продуктами
- **Основные поля**:
  - `id`: UUID (PK)
  - `order_id`: UUID (FK to orders)
  - `product_id`: UUID (FK to products)
  - `quantity`: integer
  - `price`: numeric
  - `total`: numeric
  - `notes`: text

#### 2. Product Compositions (Состав продуктов)
- **Назначение**: Связь продуктов с инвентарем
- **Основные поля**:
  - `id`: UUID (PK)
  - `product_id`: UUID (FK to products)
  - `inventory_item_id`: UUID (FK to inventory)
  - `quantity`: integer
  - `cost`: numeric

#### 3. Inventory (Инвентарь)
- **Назначение**: Учет материалов и цветов
- **Основные поля**:
  - `id`: UUID (PK)
  - `name`: text
  - `type`: enum ('flower', 'material', 'packaging')
  - `unit`: enum ('piece', 'stem', 'meter', 'gram')
  - `price`: numeric
  - `stock`: numeric
  - `min_stock`: numeric
  - `shop_id`: UUID (FK to shops)
  - `status`: enum ('active', 'inactive')

## Оставшиеся задачи

### 1. Миграции и начальные данные
- [ ] Создать миграции для всех таблиц
- [ ] Подготовить seed-данные для тестирования
- [ ] Настроить автоматическое обновление updated_at

### 2. Безопасность
- [ ] Настроить Row Level Security (RLS) для всех таблиц
- [ ] Создать роли и политики доступа
- [ ] Настроить аутентификацию через Supabase Auth

### 3. API и интеграция
- [ ] Создать API для работы с инвентарем
- [ ] Добавить real-time подписки на изменения заказов
- [ ] Интегрировать систему уведомлений

### 4. Оптимизация
- [ ] Создать индексы для часто используемых полей
- [ ] Настроить кэширование запросов
- [ ] Оптимизировать запросы с большим количеством связей

### 5. Бэкапы и восстановление
- [ ] Настроить автоматическое резервное копирование
- [ ] Создать процедуру восстановления данных
- [ ] Настроить мониторинг состояния базы данных

## Полезные команды

### Подключение к базе данных
```bash
psql -h db.PROJECT_REF.supabase.co -p 5432 -d postgres -U postgres
```

### Создание бэкапа
```bash
pg_dump -h db.PROJECT_REF.supabase.co -p 5432 -U postgres -d postgres -F c -b -v -f backup.dump
```

### Восстановление из бэкапа
```bash
pg_restore -h db.PROJECT_REF.supabase.co -p 5432 -U postgres -d postgres -v backup.dump
```

## Рекомендации по работе с базой данных

### Для разработчиков
1. Всегда используйте транзакции при работе с несколькими таблицами
2. Не забывайте про индексы при создании новых запросов
3. Используйте подготовленные запросы для предотвращения SQL-инъекций
4. Следите за размером JSON полей в settings и working_hours

### Для менеджеров
1. Все изменения в структуре базы данных должны быть задокументированы
2. При планировании новых функций учитывайте текущую структуру данных
3. Изменения в enum полях требуют обновления кода на фронтенде
4. Регулярно проверяйте отчеты о производительности базы данных
