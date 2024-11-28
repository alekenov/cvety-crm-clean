// Конфигурация подключения к Supabase
export const supabaseConfig = {
  url: 'https://tbjozecglteemnrbtjsb.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam96ZWNnbHRlZW1ucmJ0anNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NDcyOTAsImV4cCI6MjA0NjMyMzI5MH0.LLeuhNyCuNYZj2Jl14b_9-yCywKvXArmGWZk1u4qFdY',
  
  // Схема таблиц
  schema: {
    // Таблица заказов
    orders: {
      name: 'orders',
      columns: {
        id: 'id',
        number: 'number',
        created_at: 'created_at',
        delivery_time: 'delivery_time',
        status: 'status',
        client_phone: 'client_phone',
        client_name: 'client_name',
        delivery_address: 'delivery_address',
        total_price: 'total_price',
        items: 'items',
        shop: 'shop',
        florist: 'florist',
        is_urgent: 'is_urgent',
        is_vip: 'is_vip',
        client_comment: 'client_comment',
        client_reaction: 'client_reaction',
        client_reaction_comment: 'client_reaction_comment'
      }
    },
    
    // Таблица клиентов
    clients: {
      name: 'clients',
      columns: {
        id: 'id',
        phone: 'phone',
        name: 'name',
        address: 'address',
        created_at: 'created_at',
        last_order_date: 'last_order_date',
        total_orders: 'total_orders',
        total_spent: 'total_spent'
      }
    },

    // Таблица магазинов
    shops: {
      name: 'shops',
      columns: {
        id: 'id',
        name: 'name',
        address: 'address',
        phone: 'phone',
        working_hours: 'working_hours',
        is_active: 'is_active'
      }
    }
  }
};
