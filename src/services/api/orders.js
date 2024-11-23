import { supabase } from '../../lib/supabase';

export const ordersApi = {
  // Получение всех заказов
  async fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        store:store_id(*)
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
        store:store_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создание заказа
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        number: orderData.number,
        status: orderData.status || 'Оплачен',
        client_phone: orderData.client_phone,
        address: orderData.address,
        delivery_time: orderData.delivery_time,
        total_price: orderData.total_price,
        items: orderData.items,
        client_comment: orderData.client_comment,
        shop: orderData.shop,
        florist: orderData.florist,
        delivery_address: orderData.delivery_address,
        delivery_date: orderData.delivery_date,
        store_id: orderData.store_id,
        florist_name: orderData.florist_name
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление заказа
  async updateOrder(id, orderData) {
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
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

  // Удаление заказа
  async deleteOrder(id) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Группировка заказов по дням
  groupOrdersByDate(orders) {
    return orders.reduce((groups, order) => {
      const date = new Date(order.delivery_date || order.created_at).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(order);
      return groups;
    }, {});
  }
};