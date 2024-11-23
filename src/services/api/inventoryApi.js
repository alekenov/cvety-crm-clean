import { supabase } from '../../lib/supabase';

export const inventoryApi = {
  // Получение всего инвентаря
  async fetchInventory() {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        shop:shop_id (*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получение инвентаря по ID
  async fetchInventoryById(id) {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        shop:shop_id (*),
        products:product_compositions (
          product:product_id (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Получение инвентаря магазина
  async fetchShopInventory(shopId) {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products:product_compositions (
          product:product_id (*)
        )
      `)
      .eq('shop_id', shopId)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Создание инвентаря
  async createInventoryItem(itemData) {
    const { data, error } = await supabase
      .from('inventory')
      .insert([{
        name: itemData.name,
        type: itemData.type,
        unit: itemData.unit,
        price: itemData.price,
        stock: itemData.stock || 0,
        min_stock: itemData.min_stock || 0,
        shop_id: itemData.shop_id,
        status: itemData.status || 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление инвентаря
  async updateInventoryItem(id, updates) {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удаление инвентаря
  async deleteInventoryItem(id) {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Обновление количества
  async updateStock(id, quantity) {
    const { data, error } = await supabase
      .from('inventory')
      .update({ stock: quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Получение инвентаря с низким запасом
  async getLowStockItems(shopId = null) {
    const query = supabase
      .from('inventory')
      .select(`
        *,
        shop:shop_id (*)
      `)
      .eq('status', 'active')
      .filter('stock', 'lte', supabase.raw('min_stock'))
      .order('stock', { ascending: true });

    if (shopId) {
      query.eq('shop_id', shopId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Получение истории использования инвентаря
  async getInventoryUsageHistory(id, startDate, endDate) {
    const { data, error } = await supabase
      .from('product_compositions')
      .select(`
        *,
        product:product_id (*),
        orders:product:product_id (
          order_items (
            order:order_id (*)
          )
        )
      `)
      .eq('inventory_item_id', id)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Подсчет статистики использования
    const stats = {
      total_usage: data.reduce((sum, item) => sum + item.quantity, 0),
      total_cost: data.reduce((sum, item) => sum + item.cost, 0),
      usage_by_product: data.reduce((acc, item) => {
        const productId = item.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            name: item.product.name,
            quantity: 0,
            cost: 0
          };
        }
        acc[productId].quantity += item.quantity;
        acc[productId].cost += item.cost;
        return acc;
      }, {})
    };

    return {
      history: data,
      stats
    };
  }
};
