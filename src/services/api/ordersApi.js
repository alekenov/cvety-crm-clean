import { BaseApi } from './baseApi';
import { supabase, TABLES, handleSupabaseError } from '../../lib/supabase';

class OrdersApi extends BaseApi {
  constructor() {
    super(TABLES.ORDERS);
  }

  // Специфичные методы для заказов
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', id)
      .select();

    handleSupabaseError(error);
    return data[0];
  }

  async getOrdersForDate(date) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('delivery_date', date)
      .order('delivery_time', { ascending: true });

    handleSupabaseError(error);
    return data;
  }

  async createOrderWithItems(orderData, items) {
    try {
      // Создаем заказ
      const { data: order, error: orderError } = await supabase
        .from(this.tableName)
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

      handleSupabaseError(orderError);

      // Если есть позиции заказа, создаем их
      if (items && items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from(TABLES.ORDER_ITEMS)
          .insert(orderItems);

        handleSupabaseError(itemsError);
      }

      // Возвращаем созданный заказ со всеми позициями
      return this.getById(order.id);
    } catch (error) {
      console.error('Error in createOrderWithItems:', error);
      throw error;
    }
  }

  async deleteOrderWithItems(id) {
    try {
      // Сначала удаляем все позиции заказа
      const { error: itemsError } = await supabase
        .from(TABLES.ORDER_ITEMS)
        .delete()
        .eq('order_id', id);

      handleSupabaseError(itemsError);

      // Затем удаляем сам заказ
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      handleSupabaseError(error);
      return true;
    } catch (error) {
      console.error('Error in deleteOrderWithItems:', error);
      throw error;
    }
  }

  // Утилита для группировки заказов по дате
  groupOrdersByDate(orders) {
    return orders.reduce((grouped, order) => {
      const date = new Date(order.delivery_time).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(order);
      return grouped;
    }, {});
  }
}

export const ordersApi = new OrdersApi();
