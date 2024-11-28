import { supabase } from './supabaseClient';
import { clientsService } from './clientsService';

export const ordersService = {
  async fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async fetchOrderById(id) {
    try {
      console.log(`Fetching order with ID: ${id}`);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }

      if (!data) {
        console.warn(`No order found with ID: ${id}`);
        throw new Error(`Заказ с ID ${id} не найден`);
      }

      console.log('Order fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Detailed error in fetchOrderById:', error);
      throw error;
    }
  },

  async fetchClientOrders(clientId) {
    try {
      // Получаем данные клиента через сервис
      const client = await clientsService.getClientProfile(Number(clientId));
      if (!client) {
        throw new Error('Client not found');
      }

      // Форматируем телефон в нужный формат
      const formattedPhone = '+' + client.phone.replace(/[^0-9]/g, '');
      
      console.log('Searching orders for client:', {
        clientId,
        originalPhone: client.phone,
        formattedPhone,
        name: client.name
      });

      // Создаем тестовый заказ, если заказов нет
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          delivery_time,
          status,
          total_price,
          delivery_address,
          items,
          client_comment,
          client_reaction,
          client_reaction_comment
        `)
        .eq('client_phone', formattedPhone)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Если заказов нет, создаем тестовый
      if (!orders || orders.length === 0) {
        console.log('No orders found, creating test order...');
        await this.createTestOrder(formattedPhone);
        return this.fetchClientOrders(clientId); // Рекурсивно получаем заказы снова
      }

      console.log('Found orders:', orders);
      return orders || [];
    } catch (error) {
      console.error('Error fetching client orders:', error);
      throw error;
    }
  },

  async createTestOrder(clientPhone) {
    try {
      // Получаем текущий timestamp для уникального номера заказа
      const timestamp = new Date().getTime();
      const orderNumber = `TEST-${timestamp}`;

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            client_phone: clientPhone,
            number: orderNumber,
            status: 'Не оплачен', // Используем начальный статус из системы
            address: 'Test Store Address',
            delivery_time: new Date().toISOString(),
            total_price: 15000,
            delivery_address: 'Test Delivery Address',
            items: [{ name: 'Test Bouquet', quantity: 1, price: 15000 }],
            created_at: new Date().toISOString(),
            shop: 'Test Shop',
            florist: 'Test Florist'
          }
        ])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating test order:', error);
      throw error;
    }
  },

  groupOrdersByDate(orders) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return orders.reduce((acc, order) => {
      const deliveryDate = new Date(order.delivery_time);
      
      if (deliveryDate.toDateString() === today.toDateString()) {
        acc.today.push(order);
      } else if (deliveryDate.toDateString() === tomorrow.toDateString()) {
        acc.tomorrow.push(order);
      } else if (deliveryDate > tomorrow) {
        acc.upcoming.push(order);
      } else {
        acc.past.push(order);
      }
      
      return acc;
    }, { today: [], tomorrow: [], upcoming: [], past: [] });
  },

  async archiveDeliveredOrders() {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'delivered')
      .eq('is_archived', false);

    if (error) throw error;
    
    if (orders.length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ is_archived: true })
        .in('id', orders.map(o => o.id));

      if (updateError) throw updateError;
    }
  }
};