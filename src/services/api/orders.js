import { supabase } from '../../config/supabase';

export const ordersApi = {
  // Получение всех заказов
  async fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('delivery_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Получение заказа по ID
  async fetchOrderById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создание заказа
  async createOrder(orderData) {
    // Создаем заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        number: orderData.number,
        status: orderData.status,
        client_phone: orderData.client_phone,
        client_name: orderData.client_name,
        address: orderData.address,
        delivery_time: orderData.delivery_time,
        total_price: orderData.total_price,
        shop: orderData.shop,
        client_comment: orderData.client_comment
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Создаем товары для заказа
    if (orderData.items && orderData.items.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          orderData.items.map(item => ({
            order_id: order.id,
            image: item.image,
            description: item.description,
            price: item.price,
            quantity: item.quantity || 1
          }))
        );

      if (itemsError) throw itemsError;
    }

    return order;
  },

  // Обновление заказа
  async updateOrder(id, orderData) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: orderData.status,
        client_phone: orderData.client_phone,
        client_name: orderData.client_name,
        address: orderData.address,
        delivery_time: orderData.delivery_time,
        total_price: orderData.total_price,
        shop: orderData.shop,
        florist: orderData.florist,
        client_comment: orderData.client_comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  // Обновление статуса заказа
  async updateOrderStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

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
    return true;
  },

  // Группировка заказов по дням
  groupOrdersByDate(orders) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return orders.reduce((acc, order) => {
      const deliveryDate = new Date(order.delivery_time);
      
      if (deliveryDate.toDateString() === today.toDateString()) {
        acc.today.push(order);
      } else if (deliveryDate.toDateString() === tomorrow.toDateString()) {
        acc.tomorrow.push(order);
      } else {
        acc.later.push(order);
      }
      
      return acc;
    }, { today: [], tomorrow: [], later: [] });
  }
}; 