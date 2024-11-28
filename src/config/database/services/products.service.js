import { BaseService } from './base.service';
import { withErrorHandling } from '../utils/error-handler';
import { supabase } from '../db';

class ProductsService extends BaseService {
  constructor() {
    super('products');
  }

  // Получение доступных товаров
  getAvailable = withErrorHandling(async () => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('is_available', true)
      .order('name');
    
    if (error) throw error;
    return data;
  });

  // Получение товаров по категории
  getByCategory = withErrorHandling(async (category) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .order('name');
    
    if (error) throw error;
    return data;
  });

  // Обновление статуса наличия
  updateStockStatus = withErrorHandling(async (productId, stockStatus) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ 
        stock_status: stockStatus,
        is_available: stockStatus !== 'out_of_stock'
      })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Обновление атрибутов товара
  updateAttributes = withErrorHandling(async (productId, attributes) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ attributes })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Обновление изображений товара
  updateImages = withErrorHandling(async (productId, images) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ images })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  });

  // Поиск товаров
  search = withErrorHandling(async (query) => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .eq('is_available', true)
      .order('name');
    
    if (error) throw error;
    return data;
  });
}

export const productsService = new ProductsService();
