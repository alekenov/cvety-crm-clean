import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger';

// Конфигурация Supabase
const supabaseConfig = {
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL, 
  supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.REACT_APP_SUPABASE_SERVICE_KEY
};

// Расширенная диагностика конфигурации
const validateSupabaseConfig = () => {
  const requiredEnvVars = [
    'REACT_APP_SUPABASE_URL', 
    'REACT_APP_SUPABASE_ANON_KEY', 
    'REACT_APP_SUPABASE_SERVICE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const errorMessage = `Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}`;
    logger.error('Supabase Config', errorMessage);
    throw new Error(errorMessage);
  }

  // Диагностическая информация
  console.log('Supabase Configuration:', {
    url: supabaseConfig.supabaseUrl,
    anonKey: supabaseConfig.supabaseAnonKey ? '✓ PRESENT' : '✗ MISSING',
    serviceKey: supabaseConfig.supabaseServiceKey ? '✓ PRESENT' : '✗ MISSING'
  });
};

// Расширенные настройки клиента
const supabaseOptions = {
  auth: {
    persistSession: true
  },
  global: {
    headers: { 
      'x-client-info': 'cvety-crm-clean/1.0.0' 
    }
  }
};

// Валидация конфигурации
validateSupabaseConfig();

// Клиенты для разных типов операций
const supabase = createClient(
  supabaseConfig.supabaseUrl, 
  supabaseConfig.supabaseAnonKey,
  supabaseOptions
);

const supabaseAdmin = createClient(
  supabaseConfig.supabaseUrl, 
  supabaseConfig.supabaseServiceKey,
  supabaseOptions
);

// Диагностический метод для проверки подключения
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (error) {
      logger.error('Supabase Connection Test', 'Ошибка при тестовом подключении', null, error);
      console.error('Detailed Connection Error:', error);
      return false;
    }

    logger.info('Supabase Connection Test', 'Успешное подключение', { 
      testRowId: data?.[0]?.id 
    });

    return true;
  } catch (err) {
    logger.error('Supabase Connection Test', 'Критическая ошибка подключения', null, err);
    console.error('Critical Connection Error:', err);
    return false;
  }
};

// Немедленный тест подключения
testSupabaseConnection();

// Расширенные методы для работы с заказами
export const ordersService = {
  async fetchOrders(filters = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Supabase Orders Fetch', 'Ошибка при получении заказов', null, error);
        throw new Error(`Ошибка при загрузке заказов: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      logger.error('Supabase Orders Fetch', 'Критическая ошибка при получении заказов', null, err);
      throw err;
    }
  },

  async fetchOrderById(orderId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        logger.error('Supabase Order Fetch', `Ошибка при получении заказа ${orderId}`, null, error);
        throw new Error(`Ошибка при загрузке заказа: ${error.message}`);
      }

      return data;
    } catch (err) {
      logger.error('Supabase Order Fetch', `Критическая ошибка при получении заказа ${orderId}`, null, err);
      throw err;
    }
  },

  async createOrder(orderData) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select();

    if (error) {
      console.error('Ошибка при создании заказа:', error);
      throw error;
    }

    return data[0];
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({ 
          status: newStatus
          // updated_at будет автоматически обновлено триггером
        })
        .eq('id', orderId)
        .select();

      if (error) {
        logger.error('Supabase Order Status Update', `Ошибка при обновлении статуса заказа ${orderId}`, { 
          orderId, 
          newStatus 
        }, error);
        throw new Error(`Ошибка при обновлении статуса заказа: ${error.message}`);
      }

      logger.info('Supabase Order Status Update', `Статус заказа ${orderId} обновлен`, { 
        orderId, 
        newStatus 
      });

      return data[0];
    } catch (err) {
      logger.error('Supabase Order Status Update', `Критическая ошибка при обновлении статуса заказа ${orderId}`, { 
        orderId, 
        newStatus 
      }, err);
      throw err;
    }
  },

  async uploadOrderPhoto(orderId, photoUrl) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        photos: supabaseAdmin.sql`array_append(photos, ${photoUrl})` 
      })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Ошибка при загрузке фото:', error);
      throw error;
    }

    return data[0];
  },

  // Новый метод для архивации доставленных заказов
  async archiveDeliveredOrders() {
    try {
      // Временно убираем обновление is_archived
      logger.log('OrdersService', 'Попытка архивации доставленных заказов');
      
      // Просто логируем доставленные заказы
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['Доставлен', 'delivered']);

      if (error) throw error;
      
      logger.log('OrdersService', `Найдено доставленных заказов: ${data?.length || 0}`);
      
      return data;
    } catch (error) {
      logger.error('OrdersService', 'Ошибка при архивации доставленных заказов', null, error);
      throw error;
    }
  },
};

export { supabase, supabaseAdmin, supabaseConfig };
