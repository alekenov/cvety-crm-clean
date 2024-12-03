import { supabase } from './supabaseClient';

class OrdersService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            quantity,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { data: null, error: error.message };
    }
  }

  async getById(id) {
    try {
      console.log('Fetching order by ID:', id);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            quantity,
            price,
            product:products(*)
          )
        `)
        .eq('id', id)
        .single();

      console.log('Order data:', data);
      console.log('Order items:', data?.items);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error getting order by id ${id}:`, error);
      return { data: null, error: error.message };
    }
  }

  async updateOrder(id, updates) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      return { data: null, error: error.message };
    }
  }

  async addProductToOrder(orderId, productId, quantity) {
    try {
      console.log('Adding product to order:', { orderId, productId, quantity });
      
      // Сначала получаем информацию о продукте
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('price')
        .eq('id', productId)
        .single();

      console.log('Product data:', product);

      if (productError) throw productError;
      if (!product) throw new Error('Product not found');

      // Теперь добавляем товар в заказ с ценой
      const { data, error } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: productId,
          quantity: quantity,
          price: product.price
        })
        .select(`
          id,
          quantity,
          price,
          product:products(*)
        `)
        .single();

      console.log('Added order item:', data);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error adding product to order ${orderId}:`, error);
      return { data: null, error: error.message };
    }
  }

  async updateOrderItem(itemId, updates) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .update(updates)
        .eq('id', itemId)
        .select(`
          id,
          quantity,
          product:products(*)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error updating order item ${itemId}:`, error);
      return { data: null, error: error.message };
    }
  }

  async removeOrderItem(itemId) {
    try {
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error removing order item ${itemId}:`, error);
      return { error: error.message };
    }
  }

  async updateOrderStatus(orderId, status) {
    return this.updateOrder(orderId, { 
      status,
      status_updated_at: new Date().toISOString()
    });
  }

  async createOrder(orderData) {
    try {
      console.log('Creating order with data:', orderData);

      // Создаем заказ
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          status: 'new',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) throw orderError;
      console.log('Created order:', order);

      // Если есть товары в заказе, добавляем их
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Получаем полные данные заказа со всеми связями
      const { data: fullOrder, error: getError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            quantity,
            price,
            product:products(*)
          )
        `)
        .eq('id', order.id)
        .single();

      if (getError) throw getError;
      console.log('Full order data:', fullOrder);

      return { data: fullOrder, error: null };
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null, error: error.message };
    }
  }
}

export const ordersService = new OrdersService();