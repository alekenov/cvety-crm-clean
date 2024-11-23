import { supabase } from '../../lib/supabase';

export const employeesApi = {
  // Получение всех сотрудников
  async fetchEmployees() {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        shop:shop_id (*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получение сотрудника по ID
  async fetchEmployeeById(id) {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        shop:shop_id (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создание сотрудника
  async createEmployee(employeeData) {
    const { data, error } = await supabase
      .from('employees')
      .insert([{
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        phone: employeeData.phone,
        email: employeeData.email,
        role: employeeData.role,
        shop_id: employeeData.shop_id,
        settings: employeeData.settings || {},
        status: employeeData.status || 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление сотрудника
  async updateEmployee(id, updates) {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удаление сотрудника
  async deleteEmployee(id) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Получение заказов сотрудника
  async getEmployeeOrders(employeeId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:product_id (*)
        )
      `)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Обновление настроек сотрудника
  async updateEmployeeSettings(id, settings) {
    const { data, error } = await supabase
      .from('employees')
      .update({ settings })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Получение статистики сотрудника
  async getEmployeeStats(employeeId, startDate, endDate) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:product_id (*)
        )
      `)
      .eq('employee_id', employeeId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Подсчет статистики
    const stats = {
      total_orders: data.length,
      total_revenue: data.reduce((sum, order) => sum + order.total_amount, 0),
      average_order_value: data.length > 0 
        ? data.reduce((sum, order) => sum + order.total_amount, 0) / data.length 
        : 0,
      orders_by_status: data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {})
    };

    return {
      orders: data,
      stats
    };
  }
};
