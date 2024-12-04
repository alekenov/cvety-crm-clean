# База данных CRM системы цветочного магазина

## Общее описание

CRM система использует Supabase в качестве базы данных. Supabase предоставляет PostgreSQL базу данных с автоматически генерируемым REST API и real-time подпиской на изменения данных.

## Структура базы данных

### Основные таблицы

#### 1. Organizations (Организации)
Таблица для управления сетями магазинов
- `id` (uuid, PK) - уникальный идентификатор
- `name` (text) - название организации
- `description` (text) - описание
- `contact_person` (text) - контактное лицо
- `phone` (text) - телефон
- `email` (text) - email
- `settings` (jsonb) - настройки организации
- `status` (text) - статус (active/inactive)

#### 2. Shops (Магазины)
Таблица для управления точками продаж
- `id` (uuid, PK) - уникальный идентификатор
- `organization_id` (uuid, FK) - связь с организацией
- `name` (text) - название магазина
- `address` (text) - адрес
- `phone` (text) - телефон
- `whatsapp` (text) - WhatsApp
- `instagram` (text) - Instagram
- `working_hours` (jsonb) - часы работы
- `settings` (jsonb) - настройки магазина (доставка, самовывоз)
- `status` (text) - статус активности

#### 3. Products (Товары)
Товары и услуги
- `id` (uuid, PK) - уникальный идентификатор
- `name` (text) - название
- `category` (text) - категория
- `price` (numeric) - цена продажи
- `base_price` (numeric) - базовая цена
- `packaging_cost` (numeric) - стоимость упаковки
- `description` (text) - описание
- `status` (text) - статус
- `image_url` (text) - фото товара
- `product_type` (text) - тип (ready_bouquet/custom_bouquet/service/single_flower)
- `assembly_time` (integer) - время сборки в минутах
- `is_service` (boolean) - признак услуги

#### 4. Inventory (Склад)
Складской учет
- `id` (bigint, PK) - уникальный идентификатор
- `shop_id` (uuid, FK) - связь с магазином
- `name` (text) - название
- `type` (inventory_type) - тип товара
- `unit` (inventory_unit) - единица измерения
- `price` (numeric) - цена
- `stock` (numeric) - количество в наличии
- `min_stock` (numeric) - минимальный остаток
- `category` (text) - категория
- `supplier` (text) - поставщик
- `expiry_date` (date) - срок годности
- `status` (text) - статус

#### 5. Product Compositions (Состав продуктов)
Связь между продуктами и компонентами
- `id` (bigint, PK) - уникальный идентификатор
- `product_id` (uuid, FK) - связь с продуктом
- `inventory_item_id` (bigint, FK) - связь с компонентом
- `quantity` (integer) - количество
- `cost` (numeric) - стоимость
- `position_in_bouquet` (integer) - позиция в букете
- `component_notes` (text) - заметки к компоненту
- `alternative_items` (jsonb) - альтернативные замены

#### 6. Orders (Заказы)
Заказы клиентов
- `id` (uuid, PK) - уникальный идентификатор
- `number` (text) - номер заказа
- `shop_id` (uuid, FK) - связь с магазином
- `client_id` (bigint, FK) - связь с клиентом
- `status` (text) - статус заказа
- `address` (text) - адрес доставки
- `delivery_time` (text) - время доставки
- `delivery_date` (date) - дата доставки
- `delivery_type` (text) - тип доставки (delivery/pickup)
- `delivery_interval` (text) - интервал доставки
- `delivery_cost` (integer) - стоимость доставки
- `subtotal_price` (integer) - сумма товаров
- `discount_amount` (integer) - сумма скидки
- `total_price` (integer) - итоговая сумма
- `payment_method` (text) - способ оплаты
- `payment_status` (text) - статус оплаты
- `payment_date` (timestamptz) - дата оплаты
- `client_comment` (text) - комментарий клиента
- `client_reaction` (text) - реакция клиента
- `client_reaction_comment` (text) - комментарий к реакции
- `delivery_problem` (text) - проблемы с доставкой
- `reassembly_requested` (boolean) - требуется пересборка

#### 7. Order Items (Позиции заказа)
Позиции в заказе
- `id` (bigint, PK) - уникальный идентификатор
- `order_id` (uuid, FK) - связь с заказом
- `product_id` (uuid, FK) - связь с продуктом
- `florist_id` (uuid, FK) - флорист
- `quantity` (integer) - количество
- `price` (numeric) - цена
- `original_price` (numeric) - цена до скидки
- `discount_amount` (numeric) - сумма скидки
- `status` (text) - статус готовности
- `notes` (text) - заметки

#### 8. Employees (Сотрудники)
Сотрудники магазинов
- `id` (uuid, PK) - уникальный идентификатор
- `shop_id` (uuid, FK) - связь с магазином
- `name` (text) - имя
- `role` (text) - роль (admin/manager/florist)
- `phone` (text) - телефон
- `email` (text) - email
- `is_active` (boolean) - активен ли сотрудник

#### 9. Clients (Клиенты)
Клиенты
- `id` (bigint, PK) - уникальный идентификатор
- `organization_id` (uuid, FK) - связь с организацией
- `name` (text) - имя
- `phone` (text) - телефон
- `email` (text) - email
- `default_address` (text) - адрес по умолчанию
- `preferences` (jsonb) - предпочтения (любимые цветы, аллергии)
- `important_dates` (jsonb) - важные даты
- `notes` (text) - заметки
- `status` (text) - статус

#### 10. Notifications (Уведомления)
Система уведомлений
- `id` (uuid, PK) - уникальный идентификатор
- `order_id` (uuid, FK) - связь с заказом
- `shop_id` (uuid, FK) - связь с магазином
- `type` (text) - тип уведомления
- `title` (text) - заголовок
- `message` (text) - сообщение
- `status` (text) - статус
- `sent_at` (timestamptz) - время отправки
- `error_message` (text) - сообщение об ошибке

#### 11. Order Status History (История статусов заказа)
История изменений статуса заказа
- `id` (uuid, PK) - уникальный идентификатор
- `order_id` (uuid, FK) - связь с заказом
- `old_status` (text) - предыдущий статус
- `new_status` (text) - новый статус
- `comment` (text) - комментарий
- `changed_by` (text) - кто изменил

### Связующие таблицы

#### 1. Order Items (Позиции заказа)
Позиции в заказе
- `id` (bigint, PK) - уникальный идентификатор
- `order_id` (uuid, FK) - связь с заказом
- `product_id` (uuid, FK) - связь с продуктом
- `florist_id` (uuid, FK) - флорист
- `quantity` (integer) - количество
- `price` (numeric) - цена
- `original_price` (numeric) - цена до скидки
- `discount_amount` (numeric) - сумма скидки
- `status` (text) - статус готовности
- `notes` (text) - заметки

#### 2. Product Compositions (Состав продуктов)
Связь между продуктами и компонентами
- `id` (bigint, PK) - уникальный идентификатор
- `product_id` (uuid, FK) - связь с продуктом
- `inventory_item_id` (bigint, FK) - связь с компонентом
- `quantity` (integer) - количество
- `cost` (numeric) - стоимость
- `position_in_bouquet` (integer) - позиция в букете
- `component_notes` (text) - заметки к компоненту
- `alternative_items` (jsonb) - альтернативные замены

## Основные связи

1. Organization -> Shops (1:M)
2. Shop -> Employees (1:M)
3. Shop -> Inventory (1:M)
4. Shop -> Orders (1:M)
5. Product -> Product Compositions (1:M)
6. Order -> Order Items (1:M)
7. Client -> Orders (1:M)

## Триггеры

1. **calculate_total_price** - расчет итоговой суммы заказа
2. **calculate_item_price** - расчет цены позиции с учетом скидки
3. **create_order_notification** - создание уведомлений при изменении статуса
4. **log_order_status_change** - логирование изменений статуса заказа

## Индексы

Основные индексы созданы для:
- Поиска по статусам
- Поиска по внешним ключам
- Поиска по номерам телефонов
- Поиска по датам создания
- Поиска по типам продуктов

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

## Содержание
1. [Общая информация](#общая-информация)
2. [Структура базы данных](#структура-базы-данных)
3. [Сервисы](#сервисы)
4. [Утилиты](#утилиты)
5. [Примеры использования](#примеры-использования)

## Общая информация

База данных построена на Supabase с использованием PostgreSQL. Вся работа с базой данных централизована через сервисы и утилиты в директории `src/config/database`.

### Основные компоненты:
- Сервисный слой для работы с данными
- Система кэширования
- Обработка ошибок
- Валидация данных
- Миграции
- Логирование

## Структура базы данных

### Таблицы

#### Orders (Заказы)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| number | Integer | Номер заказа |
| created_at | Timestamp | Дата создания |
| delivery_time | Timestamp | Время доставки |
| status | Enum | Статус заказа |
| client_id | UUID | ID клиента |
| total_price | Decimal | Общая стоимость |
| items | JSONB | Товары в заказе |

#### Clients (Клиенты)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| phone | String | Телефон |
| name | String | Имя клиента |
| email | String | Email |
| addresses | JSONB | Адреса доставки |
| created_at | Timestamp | Дата регистрации |

#### Shops (Магазины)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| name | String | Название |
| address | String | Адрес |
| phone | String | Телефон |
| working_hours | JSONB | Часы работы |

#### Employees (Сотрудники)
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| name | String | Имя |
| role | Enum | Роль |
| shop_id | UUID | ID магазина |
| status | Enum | Статус |

## Сервисы

### BaseService
Базовый класс для всех сервисов с основными CRUD операциями:
```javascript
import { ordersService } from '@/config/database/services';

// Получение всех записей
const items = await ordersService.getAll();

// Получение по ID
const item = await ordersService.getById(id);

// Создание
const newItem = await ordersService.create(data);

// Обновление
const updatedItem = await ordersService.update(id, data);

// Удаление
await ordersService.delete(id);
```

### Специализированные сервисы

#### OrdersService
```javascript
// Получение заказов по статусу
const orders = await ordersService.getByStatus('processing');

// Обновление статуса
await ordersService.updateStatus(orderId, 'completed');
```

#### ClientsService
```javascript
// Поиск клиента по телефону
const client = await clientsService.getByPhone('+1234567890');

// Обновление статистики
await clientsService.updateStats(clientId, stats);
```

## Утилиты

### Кэширование
```javascript
import { withCache } from '@/config/database/utils';

// Кэширование результата на 5 минут
const cachedFn = withCache(fn, 'cache-key', 5 * 60 * 1000);
```

### Валидация
```javascript
import { validateData } from '@/config/database/utils';

// Валидация данных перед сохранением
validateData('orders', orderData);
```

### Обработка ошибок
```javascript
import { withErrorHandling } from '@/config/database/utils';

// Автоматическая обработка ошибок
const safeFn = withErrorHandling(dangerousFn);
```

## Примеры использования

### Создание заказа
```javascript
import { ordersService, clientsService } from '@/config/database/services';
import { ORDER_STATUS } from '@/config/database/constants';

// Создание заказа с транзакцией
await ordersService.transaction(async () => {
  // Создаем заказ
  const order = await ordersService.create({
    client_id: clientId,
    status: ORDER_STATUS.NEW,
    items: orderItems,
    total_price: calculateTotal(orderItems)
  });

  // Обновляем статистику клиента
  await clientsService.updateStats(clientId, {
    lastOrderDate: new Date(),
    totalOrders: totalOrders + 1
  });

  return order;
});
```

### Поиск с пагинацией
```javascript
// Получение заказов с пагинацией
const { data: orders, pagination } = await ordersService.paginate({
  page: 1,
  limit: 20,
  columns: 'id, number, status, total_price'
});
```

### Работа с кэшем
```javascript
// Кэширование часто используемых данных
const getActiveShops = withCache(
  shopsService.getActive,
  'active-shops',
  30 * 60 * 1000 // 30 минут
);

const shops = await getActiveShops();
