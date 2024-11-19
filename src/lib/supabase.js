import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Отсутствуют необходимые переменные окружения для Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Функции для работы с товарами
export const productsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  create: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Функции для работы с заказами
export const ordersApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  create: async (order) => {
    // Начинаем транзакцию
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
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

    if (orderError) return { error: orderError };

    // Создаем элементы заказа
    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) return { error: itemsError };

    return { data: orderData, error: null };
  },

  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();
    return { data, error };
  },

  delete: async (id) => {
    // Сначала удаляем связанные элементы заказа
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    // Затем удаляем сам заказ
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    return { error };
  }
};
