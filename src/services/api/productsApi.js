import { supabase } from '../../lib/supabase';

export const productsApi = {
  // Получение всех продуктов
  async fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        compositions:product_compositions (
          *,
          inventory_item:inventory_item_id (*)
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получение продукта по ID
  async fetchProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        compositions:product_compositions (
          *,
          inventory_item:inventory_item_id (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создание продукта
  async createProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        category: productData.category,
        price: productData.price,
        base_price: productData.base_price || 0,
        markup_amount: productData.markup_amount || 0,
        packaging_cost: productData.packaging_cost || 2000,
        description: productData.description,
        status: productData.status || 'active',
        image_url: productData.image_url,
        sku: productData.sku
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Обновление продукта
  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Удаление продукта
  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Поиск продуктов
  async searchProducts(query) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        compositions:product_compositions (
          *,
          inventory_item:inventory_item_id (*)
        )
      `)
      .ilike('name', `%${query}%`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Получение продуктов по категории
  async getProductsByCategory(category) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        compositions:product_compositions (
          *,
          inventory_item:inventory_item_id (*)
        )
      `)
      .eq('category', category)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
