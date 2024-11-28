import { BaseService } from './base.service';
import { withErrorHandling } from '../utils/error-handler';
import { supabase } from '../db';

class OrdersService extends BaseService {
  constructor() {
    super('orders');
  }

  // Получение всех заказов
  fetchOrders = withErrorHandling(async () => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  });

  // Получение заказов по статусу
  getByStatus = withErrorHandling(async (status) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  });

  // Получение заказов клиента
  getByClientId = withErrorHandling(async (clientId) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  });

  // Обновление статуса заказа
  updateStatus = withErrorHandling(async (id, status) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Получение статистики по заказам
  getStats = withErrorHandling(async () => {
    const { data: totalOrders, error: totalError } = await supabase
      .from(this.tableName)
      .select('id', { count: 'exact' });
    
    if (totalError) throw totalError;

    const { data: statusStats, error: statusError } = await supabase
      .from(this.tableName)
      .select('status')
      .then(result => {
        const stats = {};
        result.data.forEach(order => {
          stats[order.status] = (stats[order.status] || 0) + 1;
        });
        return stats;
      });
    
    if (statusError) throw statusError;

    return {
      total: totalOrders.length,
      byStatus: statusStats
    };
  });
}

export const ordersService = new OrdersService();
