import { supabase } from '../../lib/supabase';

export const shopsApi = {
  // Получение всех магазинов
  async fetchShops() {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        employees:employees (*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получение магазина по ID
  async fetchShopById(id) {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        employees:employees (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создание магазина
  async createShop(shopData) {
    const { data, error } = await supabase
      .from('shops')
      .insert([{
        name: shopData.name,
        address: shopData.address,
        phone: shopData.phone,
        email: shopData.email,
        working_hours: shopData.working_hours || {},
        settings: shopData.settings || {},
        status: shopData.status || 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление магазина
  async updateShop(id, updates) {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удаление магазина
  async deleteShop(id) {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Получение сотрудников магазина
  async getShopEmployees(shopId) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('shop_id', shopId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Обновление настроек магазина
  async updateShopSettings(id, settings) {
    const { data, error } = await supabase
      .from('shops')
      .update({ settings })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление рабочих часов магазина
  async updateWorkingHours(id, working_hours) {
    const { data, error } = await supabase
      .from('shops')
      .update({ working_hours })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
