import { ordersDb } from '../config/database/db';
import { supabaseConfig } from '../config/database/supabase.config';

export const ordersService = {
  async fetchOrders() {
    try {
      console.log('Fetching orders...');
      const orders = await ordersDb.getAll();
      console.log('Fetched orders:', orders);
      return orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async createOrder(orderData) {
    try {
      console.log('Creating order:', orderData);
      const order = await ordersDb.create(orderData);
      console.log('Created order:', order);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async updateOrder(id, orderData) {
    try {
      console.log('Updating order:', { id, orderData });
      const order = await ordersDb.update(id, orderData);
      console.log('Updated order:', order);
      return order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async updateOrderStatus(id, status) {
    try {
      console.log('Updating order status:', { id, status });
      const order = await ordersDb.updateStatus(id, status);
      console.log('Updated order status:', order);
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Получить названия колонок для таблицы заказов
  getOrderColumns() {
    return supabaseConfig.schema.orders.columns;
  },

  // Фильтрация заказов по дате
  filterOrdersByDate(orders, dateFilter) {
    if (!orders || !dateFilter || dateFilter === 'all') return orders;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const monthEnd = new Date(today);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    return orders.filter(order => {
      const deliveryDate = new Date(order.delivery_time);
      deliveryDate.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'today':
          return deliveryDate.getTime() === today.getTime();
        case 'tomorrow':
          return deliveryDate.getTime() === tomorrow.getTime();
        case 'week':
          return deliveryDate >= today && deliveryDate < weekEnd;
        case 'month':
          return deliveryDate >= today && deliveryDate < monthEnd;
        default:
          return true;
      }
    });
  }
};