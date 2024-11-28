import { BaseService } from './base.service';
import { withErrorHandling } from '../utils/error-handler';
import { supabase } from '../db';

class EmployeesService extends BaseService {
  constructor() {
    super('employees');
  }

  // Получение сотрудников по роли
  getByRole = withErrorHandling(async (role) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('role', role)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  });

  // Получение доступных флористов
  getAvailableFlorists = withErrorHandling(async (shopId) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('role', 'florist')
      .eq('shop_id', shopId)
      .eq('is_active', true)
      .eq('status', 'available');
    
    if (error) throw error;
    return data;
  });

  // Получение доступных курьеров
  getAvailableCouriers = withErrorHandling(async (shopId) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('role', 'courier')
      .eq('shop_id', shopId)
      .eq('is_active', true)
      .eq('status', 'available');
    
    if (error) throw error;
    return data;
  });

  // Обновление статуса сотрудника
  updateStatus = withErrorHandling(async (employeeId, status) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', employeeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Обновление расписания
  updateSchedule = withErrorHandling(async (employeeId, schedule) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ schedule })
      .eq('id', employeeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Получение текущих заказов сотрудника
  getCurrentOrders = withErrorHandling(async (employeeId, role) => {
    const field = role === 'florist' ? 'florist_id' : 'courier_id';
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq(field, employeeId)
      .in('status', ['processing', 'delivering'])
      .order('delivery_time');
    
    if (error) throw error;
    return data;
  });
}

export const employeesService = new EmployeesService();
