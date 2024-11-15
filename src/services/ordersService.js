import { supabase } from '../lib/supabaseClient';

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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
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
  }
}; 