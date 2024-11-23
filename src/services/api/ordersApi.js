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
    // Начинаем транзакцию для создания заказа и его позиций
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        client_name: orderData.client_name,
        client_phone: orderData.client_phone,
        delivery_address: orderData.delivery_address,
        delivery_time: orderData.delivery_time,
        total_amount: orderData.total_amount,
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method,
        employee_id: orderData.employee_id,
        shop_id: orderData.shop_id,
        notes: orderData.notes,
        status: orderData.status || 'new'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Создаем позиции заказа
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      notes: item.notes
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

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
