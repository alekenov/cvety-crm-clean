import { supabase } from './supabaseClient';

class ProductsService {
  async getProducts() {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_compositions (
          id,
          quantity,
          cost,
          inventory_item:inventory_item_id (
            id,
            name,
            price
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return products;
  }

  async getProductById(id) {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_compositions (
          id,
          quantity,
          cost,
          inventory_item:inventory_item_id (
            id,
            name,
            price
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return product;
  }
}

export const productsService = new ProductsService();
