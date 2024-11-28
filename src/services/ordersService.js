import { ordersService as dbOrdersService } from '../config/database/db';
import { supabaseConfig } from '../config/database/supabase.config';
import logger from '../utils/logger';

class OrdersService {
  constructor() {
    this.mockPhotos = new Map(); // Для хранения фотографий в режиме разработки
  }

  async fetchOrders() {
    try {
      const orders = await dbOrdersService.fetchOrders();
      return { data: orders, error: null };
    } catch (error) {
      logger.error('Error fetching orders:', error);
      return { data: null, error: error.message };
    }
  }

  async fetchArchivedOrders() {
    try {
      const orders = await dbOrdersService.fetchOrders();
      const archivedOrders = orders.filter(order => order.status === 'Доставлен');
      return { data: archivedOrders, error: null };
    } catch (error) {
      logger.error('Error fetching archived orders:', error);
      return { data: null, error: error.message };
    }
  }

  async getAll() {
    return this.fetchOrders();
  }

  async getById(id) {
    try {
      const { data: orders } = await this.fetchOrders();
      const order = orders ? orders.find(order => order.id === id) : null;
      return { data: order, error: null };
    } catch (error) {
      logger.error(`Error getting order by id ${id}:`, error);
      return { data: null, error: error.message };
    }
  }

  async fetchOrderById(id) {
    try {
      const { data: orders } = await this.fetchOrders();
      const order = orders.find(order => order.id === id);
      return { data: order || null, error: null };
    } catch (error) {
      logger.error(`Error fetching order by ID ${id}:`, error);
      return { data: null, error: error.message };
    }
  }

  async fetchOrderByNumber(number) {
    try {
      const { data: orders } = await this.fetchOrders();
      const order = orders.find(order => order.number === number);
      return { data: order || null, error: null };
    } catch (error) {
      logger.error(`Error fetching order by number ${number}:`, error);
      return { data: null, error: error.message };
    }
  }

  async create(order) {
    try {
      const result = await dbOrdersService.create(order);
      return { data: result, error: null };
    } catch (error) {
      logger.error('Error creating order:', error);
      return { data: null, error: error.message };
    }
  }

  async update(id, data) {
    try {
      const result = await dbOrdersService.update(id, data);
      return { data: result, error: null };
    } catch (error) {
      logger.error(`Error updating order ${id}:`, error);
      return { data: null, error: error.message };
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      const result = await dbOrdersService.updateStatus(orderId, newStatus);
      return { data: result, error: null };
    } catch (error) {
      logger.error(`Error updating order status ${orderId}:`, error);
      return { data: null, error: error.message };
    }
  }

  async uploadPhoto(orderId, file) {
    try {
      if (process.env.NODE_ENV === 'development') {
        // В режиме разработки сохраняем фото локально
        const photos = this.mockPhotos.get(orderId) || [];
        const photoUrl = URL.createObjectURL(file);
        photos.push(photoUrl);
        this.mockPhotos.set(orderId, photos);
        return { data: { url: photoUrl }, error: null };
      } else {
        // В продакшене загружаем в Supabase Storage
        const { data, error } = await supabaseConfig.storage
          .from('orders')
          .upload(`${orderId}/${file.name}`, file);

        if (error) throw error;
        return { data: { url: data.path }, error: null };
      }
    } catch (error) {
      logger.error(`Error uploading photo for order ${orderId}:`, error);
      return { data: null, error: error.message };
    }
  }

  async getOrderPhotos(orderId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        // В режиме разработки возвращаем локально сохраненные фото
        const photos = this.mockPhotos.get(orderId) || [];
        return { data: photos, error: null };
      } else {
        // В продакшене получаем из Supabase Storage
        const { data, error } = await supabaseConfig.storage
          .from('orders')
          .list(orderId);

        if (error) throw error;
        const photoUrls = data.map(file => ({
          url: supabaseConfig.storage
            .from('orders')
            .getPublicUrl(`${orderId}/${file.name}`).data.publicUrl
        }));
        return { data: photoUrls, error: null };
      }
    } catch (error) {
      logger.error(`Error getting photos for order ${orderId}:`, error);
      return { data: null, error: error.message };
    }
  }

  getOrderColumns() {
    return [
      { field: 'number', headerName: '№ заказа', width: 100 },
      { field: 'status', headerName: 'Статус', width: 120 },
      { field: 'delivery_type', headerName: 'Тип доставки', width: 120 },
      { field: 'delivery_address', headerName: 'Адрес доставки', width: 200 },
      { field: 'delivery_date', headerName: 'Дата доставки', width: 150 },
      { 
        field: 'customer',
        headerName: 'Клиент',
        width: 200,
        valueGetter: (params) => {
          const customer = params.row.customer;
          return customer ? `${customer.name} (${customer.phone})` : '';
        }
      },
      { field: 'total', headerName: 'Сумма', width: 100 },
    ];
  }

  filterOrdersByDate(orders, dateFilter) {
    if (!dateFilter) return orders;

    const startOfDay = new Date(dateFilter);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(dateFilter);
    endOfDay.setHours(23, 59, 59, 999);

    return orders.filter(order => {
      const orderDate = new Date(order.delivery_date);
      return orderDate >= startOfDay && orderDate <= endOfDay;
    });
  }
}

export const ordersService = new OrdersService();