import { BaseApi } from './baseApi';
import { supabase, TABLES, handleSupabaseError } from '../../lib/supabase';

class ProductsApi extends BaseApi {
  constructor() {
    super(TABLES.PRODUCTS);
  }

  // Получение активных продуктов
  async getActiveProducts() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true });

    handleSupabaseError(error);
    return data;
  }

  // Поиск продуктов
  async searchProducts(query) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .textSearch('name', query.toLowerCase())
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    handleSupabaseError(error);
    return data;
  }

  // Получение продуктов по категории
  async getProductsByCategory(categoryId) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('category_id', categoryId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    handleSupabaseError(error);
    return data;
  }

  // Обновление статуса продукта
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', id)
      .select();

    handleSupabaseError(error);
    return data[0];
  }

  // Обновление цены продукта
  async updatePrice(id, price) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ price })
      .eq('id', id)
      .select();

    handleSupabaseError(error);
    return data[0];
  }
}

export const productsApi = new ProductsApi();
