import { supabase } from '../../lib/supabase';

export const ordersApi = {
  // Получение всех заказов
  async fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:product_id (*)
        ),
        shop:shop_id (*),
        employee:employee_id (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получение заказа по ID
  async fetchOrderById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:product_id (*)
        ),
        shop:shop_id (*),
        employee:employee_id (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создание заказа
  async createOrder(orderData) {
    // Sanitize and validate order data
    const sanitizedOrderData = {
      number: orderData.number || `ORDER-${Date.now()}`,
      status: orderData.status || 'new',
      client_phone: orderData.client_phone || '',
      address: orderData.address || null,
      delivery_time: orderData.delivery_time || null,
      total_price: orderData.total_price || 0,
      items: JSON.stringify(orderData.items || []), // Convert to JSON string
      client_comment: orderData.client_comment || null,
      shop: orderData.shop || null,
      florist: orderData.florist || null,
      delivery_address: orderData.delivery_address || null,
      delivery_date: orderData.delivery_date || null,
      store_id: orderData.store_id || null,
      florist_name: orderData.florist_name || null
    };

    // Log the sanitized data for debugging
    console.log('Sanitized Order Data:', sanitizedOrderData);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([sanitizedOrderData])
      .select()
      .single();

    if (orderError) {
      console.error('Supabase Order Creation Error:', orderError);
      throw orderError;
    }

    return order;
  },

  // Обновление заказа
  async updateOrder(id, updates) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление статуса заказа
  async updateOrderStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление статуса оплаты
  async updatePaymentStatus(id, payment_status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удаление заказа
  async deleteOrder(id) {
    // Сначала удаляем все позиции заказа
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (itemsError) throw itemsError;

    // Затем удаляем сам заказ
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (orderError) throw orderError;
  },

  // Добавление позиции в заказ
  async addOrderItem(orderId, itemData) {
    const { data, error } = await supabase
      .from('order_items')
      .insert([{
        order_id: orderId,
        product_id: itemData.product_id,
        quantity: itemData.quantity,
        price: itemData.price,
        total: itemData.total,
        notes: itemData.notes
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удаление позиции из заказа
  async removeOrderItem(itemId) {
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  },

  // Получение заказов по статусу
  async getOrdersByStatus(status) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:product_id (*)
        ),
        shop:shop_id (*),
        employee:employee_id (*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получение заказов магазина
  async getShopOrders(shopId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:product_id (*)
        ),
        shop:shop_id (*),
        employee:employee_id (*)
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Поиск заказов по номеру телефона клиента
  async searchOrdersByPhone(phone) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:product_id (*)
        ),
        shop:shop_id (*),
        employee:employee_id (*)
      `)
      .ilike('client_phone', `%${phone}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
