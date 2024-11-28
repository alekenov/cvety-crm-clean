import { ordersService as dbOrdersService } from '../config/database/db';
import { supabaseConfig } from '../config/database/supabase.config';

export const ordersService = {
  async fetchOrders() {
    try {
      return await dbOrdersService.getAll();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      return await dbOrdersService.getAll();
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      return await dbOrdersService.getById(id);
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw error;
    }
  },

  async create(order) {
    try {
      return await dbOrdersService.create(order);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      return await dbOrdersService.update(id, data);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      return await dbOrdersService.updateStatus(id, status);
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