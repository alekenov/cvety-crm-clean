import { supabase } from './supabaseClient';

export const ordersService = {
  async fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async fetchOrderById(id) {
    try {
      console.log(`Fetching order with ID: ${id}`);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }

      if (!data) {
        console.warn(`No order found with ID: ${id}`);
        throw new Error(`Заказ с ID ${id} не найден`);
      }

      console.log('Order fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Detailed error in fetchOrderById:', error);
      throw error;
    }
  },

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
  },

  async archiveDeliveredOrders() {
    const { data, error } = await supabase
      .from('orders')
      .update({ is_archived: true })
      .in('status', ['delivered', 'Доставлен']);

    if (error) throw error;
    return data;
  },
}; 