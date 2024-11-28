import { BaseService } from './base.service';
import { withErrorHandling } from '../utils/error-handler';
import { supabase } from '../db';

class ClientsService extends BaseService {
  constructor() {
    super('clients');
  }

  // Поиск клиента по телефону
  getByPhone = withErrorHandling(async (phone) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) throw error;
    return data;
  });

  // Получение истории заказов клиента
  getOrderHistory = withErrorHandling(async (clientId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  });

  // Обновление статистики клиента
  updateStats = withErrorHandling(async (clientId, { totalOrders, totalSpent, lastOrderDate }) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        total_orders: totalOrders,
        total_spent: totalSpent,
        last_order_date: lastOrderDate,
        average_order_value: totalSpent / totalOrders
      })
      .eq('id', clientId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Обновление предпочтений клиента
  updatePreferences = withErrorHandling(async (clientId, preferences) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ preferences })
      .eq('id', clientId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Управление подпиской на рассылку
  toggleSubscription = withErrorHandling(async (clientId, isSubscribed) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ is_subscribed: isSubscribed })
      .eq('id', clientId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });
}

export const clientsService = new ClientsService();
