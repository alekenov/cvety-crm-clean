// Схема базы данных
export const schema = {
  // Таблица заказов
  orders: {
    name: 'orders',
    columns: {
      id: 'id',                    // UUID, primary key
      number: 'number',            // Номер заказа (автоинкремент)
      created_at: 'created_at',    // Timestamp создания
      updated_at: 'updated_at',    // Timestamp обновления
      delivery_time: 'delivery_time', // Timestamp доставки
      status: 'status',            // Enum: new, processing, delivering, completed, cancelled
      
      // Информация о клиенте
      client_id: 'client_id',      // UUID -> clients.id
      client_phone: 'client_phone', // Телефон клиента
      client_name: 'client_name',   // Имя клиента
      delivery_address: 'delivery_address',
      
      // Информация о заказе
      total_price: 'total_price',   // Decimal
      items: 'items',               // JSONB - массив товаров
      
      // Привязки
      shop_id: 'shop_id',          // UUID -> shops.id
      florist_id: 'florist_id',    // UUID -> employees.id
      courier_id: 'courier_id',     // UUID -> employees.id
      
      // Флаги
      is_urgent: 'is_urgent',       // Boolean
      is_vip: 'is_vip',            // Boolean
      
      // Комментарии
      internal_comment: 'internal_comment',  // Комментарий для сотрудников
      client_comment: 'client_comment',      // Комментарий от клиента
      
      // Обратная связь
      client_reaction: 'client_reaction',    // Enum: positive, neutral, negative
      client_reaction_comment: 'client_reaction_comment',
      
      // Оплата
      payment_status: 'payment_status',      // Enum: pending, paid, refunded
      payment_method: 'payment_method',      // Enum: cash, card, online
    }
  },

  // Таблица клиентов
  clients: {
    name: 'clients',
    columns: {
      id: 'id',                    // UUID, primary key
      phone: 'phone',              // Уникальный номер телефона
      name: 'name',                // Имя клиента
      email: 'email',              // Email (опционально)
      addresses: 'addresses',       // JSONB - массив адресов
      created_at: 'created_at',    // Timestamp создания
      updated_at: 'updated_at',    // Timestamp обновления
      
      // Статистика
      last_order_date: 'last_order_date',
      total_orders: 'total_orders',
      total_spent: 'total_spent',
      average_order_value: 'average_order_value',
      
      // Предпочтения
      preferences: 'preferences',   // JSONB - предпочтения клиента
      favorite_items: 'favorite_items', // JSONB - любимые товары
      
      // Маркетинг
      source: 'source',            // Откуда пришел клиент
      tags: 'tags',                // JSONB - теги для сегментации
      is_subscribed: 'is_subscribed', // Подписка на рассылку
    }
  },

  // Таблица магазинов
  shops: {
    name: 'shops',
    columns: {
      id: 'id',                    // UUID, primary key
      name: 'name',                // Название магазина
      address: 'address',          // Адрес
      coordinates: 'coordinates',   // JSONB - геокоординаты
      phone: 'phone',              // Телефон
      email: 'email',              // Email
      
      // Режим работы
      working_hours: 'working_hours', // JSONB - часы работы по дням
      is_active: 'is_active',      // Активен ли магазин
      
      // Характеристики
      capacity: 'capacity',        // Максимальное количество заказов в день
      features: 'features',        // JSONB - особенности магазина
      
      created_at: 'created_at',
      updated_at: 'updated_at'
    }
  },

  // Таблица сотрудников
  employees: {
    name: 'employees',
    columns: {
      id: 'id',                    // UUID, primary key
      name: 'name',                // Имя сотрудника
      phone: 'phone',              // Телефон
      email: 'email',              // Email
      role: 'role',                // Enum: admin, manager, florist, courier
      shop_id: 'shop_id',          // UUID -> shops.id
      
      // Статус
      is_active: 'is_active',      // Активен ли сотрудник
      status: 'status',            // Enum: available, busy, offline
      
      // Расписание
      schedule: 'schedule',        // JSONB - график работы
      
      created_at: 'created_at',
      updated_at: 'updated_at'
    }
  },

  // Таблица товаров/букетов
  products: {
    name: 'products',
    columns: {
      id: 'id',                    // UUID, primary key
      name: 'name',                // Название товара
      description: 'description',  // Описание
      category: 'category',        // Категория
      price: 'price',              // Базовая цена
      
      // Характеристики
      attributes: 'attributes',    // JSONB - характеристики товара
      images: 'images',            // JSONB - массив ссылок на изображения
      
      // Наличие
      is_available: 'is_available', // Доступен ли товар
      stock_status: 'stock_status', // Enum: in_stock, low_stock, out_of_stock
      
      created_at: 'created_at',
      updated_at: 'updated_at'
    }
  }
};
