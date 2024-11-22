import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Supabase client configuration
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'cvety-crm-auth-storage-v1'
  },
  global: {
    headers: {
      'x-application-name': 'cvety-crm'
    }
  }
};

// Create a singleton instance
let supabaseInstance = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig);
  }
  return supabaseInstance;
};

// Export a singleton instance
export const supabase = getSupabase();

// Database table names
export const TABLES = {
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  PRODUCTS: 'products',
  INVENTORY: 'inventory',
  SHOPS: 'shops',
  EMPLOYEES: 'employees'
};

// Error handling utility
export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase error:', error.message, error.details);
    throw new Error(`Database error: ${error.message}`);
  }
};

// Функции для работы с товарами
export const productsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .order('created_at', { ascending: false });
    handleSupabaseError(error);
    return { data, error };
  },

  create: async (product) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert([product])
      .select();
    handleSupabaseError(error);
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update(updates)
      .eq('id', id)
      .select();
    handleSupabaseError(error);
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .delete()
      .eq('id', id);
    handleSupabaseError(error);
    return { error };
  }
};

// Функции для работы с заказами
export const ordersApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false });
    handleSupabaseError(error);
    return { data, error };
  },

  create: async (order) => {
    // Начинаем транзакцию
    const { data: orderData, error: orderError } = await supabase
      .from(TABLES.ORDERS)
      .insert([{
        customer_name: order.customerName,
        phone: order.phone,
        delivery_address: order.deliveryAddress,
        delivery_date: order.deliveryDate,
        total_amount: order.totalAmount,
        status: 'new'
      }])
      .select()
      .single();

    handleSupabaseError(orderError);

    // Создаем элементы заказа
    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from(TABLES.ORDER_ITEMS)
      .insert(orderItems);

    handleSupabaseError(itemsError);

    return { data: orderData, error: null };
  },

  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update({ status })
      .eq('id', id)
      .select();
    handleSupabaseError(error);
    return { data, error };
  },

  delete: async (id) => {
    // Сначала удаляем связанные элементы заказа
    await supabase
      .from(TABLES.ORDER_ITEMS)
      .delete()
      .eq('order_id', id);

    // Затем удаляем сам заказ
    const { error } = await supabase
      .from(TABLES.ORDERS)
      .delete()
      .eq('id', id);
    handleSupabaseError(error);
    return { error };
  }
};

// Функции для работы с магазинами
export const shopsApi = {
  // Получить все магазины
  async getAll() {
    try {
      const { data, error } = await supabase
        .from(TABLES.SHOPS)
        .select('*')
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { data: null, error };
    }
  },

  // Создать новый магазин
  async create(shop) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SHOPS)
        .insert([{
          name: shop.name,
          address: shop.address,
          phone: shop.phone,
          whatsapp: shop.whatsapp,
          instagram: shop.instagram,
          working_hours: shop.workingHours,
          settings: shop.settings,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { data: null, error };
    }
  },

  // Обновить существующий магазин
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SHOPS)
        .update({
          name: updates.name,
          address: updates.address,
          phone: updates.phone,
          whatsapp: updates.whatsapp,
          instagram: updates.instagram,
          working_hours: updates.workingHours,
          settings: updates.settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { data: null, error };
    }
  },

  // Удалить магазин
  async delete(id) {
    try {
      const { error } = await supabase
        .from(TABLES.SHOPS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { error };
    }
  },

  // Получить сотрудников магазина
  async getEmployees(shopId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EMPLOYEES)
        .select('*')
        .eq('shop_id', shopId)
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { data: null, error };
    }
  },

  // Добавить сотрудника в магазин
  async addEmployee(employee) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EMPLOYEES)
        .insert([{
          shop_id: employee.shopId,
          name: employee.name,
          role: employee.role,
          phone: employee.phone,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { data: null, error };
    }
  },

  // Обновить данные сотрудника
  async updateEmployee(id, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EMPLOYEES)
        .update({
          name: updates.name,
          role: updates.role,
          phone: updates.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { data: null, error };
    }
  },

  // Удалить сотрудника
  async deleteEmployee(id) {
    try {
      const { error } = await supabase
        .from(TABLES.EMPLOYEES)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      handleSupabaseError(error);
      return { error };
    }
  }
};
