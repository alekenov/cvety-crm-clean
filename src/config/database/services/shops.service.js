import { BaseService } from './base.service';
import { withErrorHandling } from '../utils/error-handler';
import { supabase } from '../db';

class ShopsService extends BaseService {
  constructor() {
    super('shops');
  }

  // Получение активных магазинов
  getActive = withErrorHandling(async () => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  });

  // Получение сотрудников магазина
  getEmployees = withErrorHandling(async (shopId) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  });

  // Получение текущих заказов магазина
  getCurrentOrders = withErrorHandling(async (shopId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId)
      .in('status', ['new', 'processing', 'delivering'])
      .order('delivery_time');
    
    if (error) throw error;
    return data;
  });

  // Обновление режима работы
  updateWorkingHours = withErrorHandling(async (shopId, workingHours) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ working_hours: workingHours })
      .eq('id', shopId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Обновление статуса активности
  toggleActive = withErrorHandling(async (shopId, isActive) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ is_active: isActive })
      .eq('id', shopId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Обновление характеристик магазина
  updateFeatures = withErrorHandling(async (shopId, features) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ features })
      .eq('id', shopId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });
}

export const shopsService = new ShopsService();
