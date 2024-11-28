/**
 * API для работы с заказами
 * Базовый URL: https://copywriter.kz/local/api
 * 
 * Структура заказа:
 * {
 *   number: string          // Номер заказа
 *   status: string         // Статус заказа
 *   client: string         // Телефон клиента
 *   address: string        // Адрес доставки
 *   time: string          // Время доставки
 *   totalPrice: string    // Общая сумма
 *   shop?: string         // Магазин (опционально)
 *   florist?: string      // Флорист (опционально)
 *   items: Array<{        // Состав заказа
 *     description: string // Описание товара
 *     price: string      // Цена
 *     image: string      // URL изображения
 *   }>
 * }
 * 
 * Доступные статусы заказов:
 * - Не оплачен
 * - Оплачен
 * - В работе
 * - Собран
 * - Ожидает курьера
 * - В пути
 * - Доставлен
 * - Проблема с доставкой
 */

import { supabase } from '../supabase';

const API_URL = process.env.VITE_API_URL || 'https://copywriter.kz/local/api';
const API_TOKEN = process.env.VITE_API_TOKEN || 'ABE7142D-D8AB-76AF-8D6C-2C4FAEA9B144';

export const ordersApi = {
  /**
   * Получение списка заказов
   * @returns {Promise<Array>} Массив заказов
   */
  async fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product:products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Обновление статуса заказа
   * @param {string} orderId - ID заказа
   * @param {string} status - Новый статус
   */
  async updateOrderStatus(orderId, status) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Создание нового заказа
   * @param {Object} orderData - Данные заказа
   */
  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Получение деталей заказа
   * @param {string} orderId - ID заказа
   */
  async getOrderDetails(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product:products (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }
};

export default ordersApi;