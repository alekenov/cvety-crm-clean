import { BaseService } from './base.service';
import { withErrorHandling } from '../utils/error-handler';

class OrdersService extends BaseService {
  constructor() {
    super('orders');
  }

  // Специфичные методы для заказов
  getByStatus = withErrorHandling(async (status) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', status);
    
    if (error) throw error;
    return data;
  });

  updateStatus = withErrorHandling(async (id, status) => {
    return this.update(id, { status });
  });

  getByClientPhone = withErrorHandling(async (phone) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('client_phone', phone);
    
    if (error) throw error;
    return data;
  });

  // Получение заказов за определенный период
  getByDateRange = withErrorHandling(async (startDate, endDate) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    
    if (error) throw error;
    return data;
  });
}

export const ordersService = new OrdersService();
