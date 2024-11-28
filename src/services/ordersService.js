import { ordersService as dbOrdersService } from '../config/database/db';
import { supabaseConfig } from '../config/database/supabase.config';
import logger from '../utils/logger';

// Тестовые данные для заказов
const mockOrders = [
  {
    id: '1',
    number: 'ORD-001',
    status: 'Не оплачен',
    delivery_type: 'delivery',
    delivery_address: 'ул. Пушкина, д. 10, кв. 15',
    delivery_date: '2024-03-10T14:00:00',
    customer: {
      name: 'Анна Иванова',
      phone: '+7 (999) 123-45-67'
    },
    total: 5500,
    items: [
      { name: 'Букет роз', quantity: 1, price: 5500 }
    ]
  },
  {
    id: '2',
    number: 'ORD-002',
    status: 'Оплачен',
    delivery_type: 'pickup',
    pickup_shop: 'ТЦ Мега',
    delivery_date: '2024-03-10T16:00:00',
    customer: {
      name: 'Петр Сидоров',
      phone: '+7 (999) 234-56-78'
    },
    total: 3200,
    items: [
      { name: 'Букет тюльпанов', quantity: 1, price: 3200 }
    ]
  },
  {
    id: '3',
    number: 'ORD-003',
    status: 'В работе',
    delivery_type: 'delivery',
    delivery_address: 'ул. Ленина, д. 25, кв. 42',
    delivery_date: '2024-03-10T12:00:00',
    customer: {
      name: 'Мария Петрова',
      phone: '+7 (999) 345-67-89'
    },
    total: 7800,
    items: [
      { name: 'Букет пионов', quantity: 1, price: 7800 }
    ]
  },
  {
    id: '4',
    number: 'ORD-004',
    status: 'Собран',
    delivery_type: 'pickup',
    pickup_shop: 'ТЦ Атриум',
    delivery_date: '2024-03-10T15:30:00',
    customer: {
      name: 'Дмитрий Козлов',
      phone: '+7 (999) 456-78-90'
    },
    total: 4500,
    items: [
      { name: 'Букет хризантем', quantity: 1, price: 4500 }
    ]
  },
  {
    id: '5',
    number: 'ORD-005',
    status: 'В пути',
    delivery_type: 'delivery',
    delivery_address: 'пр. Мира, д. 15, кв. 78',
    delivery_date: '2024-03-10T13:00:00',
    customer: {
      name: 'Елена Смирнова',
      phone: '+7 (999) 567-89-01'
    },
    total: 6200,
    items: [
      { name: 'Букет лилий', quantity: 1, price: 6200 }
    ]
  },
  {
    id: '6',
    number: 'ORD-006',
    status: 'Доставлен',
    delivery_type: 'delivery',
    delivery_address: 'ул. Гагарина, д. 8, кв. 33',
    delivery_date: '2024-03-09T18:00:00',
    customer: {
      name: 'Ольга Николаева',
      phone: '+7 (999) 678-90-12'
    },
    total: 8900,
    items: [
      { name: 'Букет орхидей', quantity: 1, price: 8900 }
    ]
  },
  {
    id: '7',
    number: 'ORD-007',
    status: 'Готов к самовывозу',
    delivery_type: 'pickup',
    pickup_shop: 'ТЦ Европейский',
    delivery_date: '2024-03-10T17:00:00',
    customer: {
      name: 'Игорь Васильев',
      phone: '+7 (999) 789-01-23'
    },
    total: 4100,
    items: [
      { name: 'Букет гербер', quantity: 1, price: 4100 }
    ]
  }
];

class OrdersService {
  constructor() {
    this.mockPhotos = new Map(); // Для хранения фотографий в режиме разработки
  }

  async fetchOrders() {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: mockOrders, error: null };
      }
      return await dbOrdersService.getAll();
    } catch (error) {
      logger.error('[OrdersService] Error fetching orders:', error);
      return { data: null, error: error.message || 'Failed to fetch orders' };
    }
  }

  async getAll() {
    try {
      return await dbOrdersService.getAll();
    } catch (error) {
      logger.error('[OrdersService] Error getting orders:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      return await dbOrdersService.getById(id);
    } catch (error) {
      logger.error('[OrdersService] Error getting order by id:', error);
      throw error;
    }
  }

  async create(order) {
    try {
      return await dbOrdersService.create(order);
    } catch (error) {
      logger.error('[OrdersService] Error creating order:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      return await dbOrdersService.update(id, data);
    } catch (error) {
      logger.error('[OrdersService] Error updating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedOrders = mockOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        return { data: { status: newStatus }, error: null };
      }
      return await dbOrdersService.updateStatus(orderId, newStatus);
    } catch (error) {
      logger.error('[OrdersService] Error updating order status:', error);
      return { data: null, error: error.message || 'Failed to update order status' };
    }
  }

  async uploadPhoto(orderId, file) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Создаем URL для локального просмотра фото
        const photoUrl = URL.createObjectURL(file);
        
        // Сохраняем фото в Map
        if (!this.mockPhotos.has(orderId)) {
          this.mockPhotos.set(orderId, []);
        }
        this.mockPhotos.get(orderId).push(photoUrl);

        return { 
          data: { 
            url: photoUrl,
            orderId: orderId,
            filename: file.name
          }, 
          error: null 
        };
      }

      // В продакшене используем реальное хранилище
      return await dbOrdersService.uploadPhoto(orderId, file);
    } catch (error) {
      logger.error('[OrdersService] Error uploading photo:', error);
      return { data: null, error: error.message || 'Failed to upload photo' };
    }
  }

  async getOrderPhotos(orderId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { 
          data: this.mockPhotos.get(orderId) || [], 
          error: null 
        };
      }
      return await dbOrdersService.getPhotos(orderId);
    } catch (error) {
      logger.error('[OrdersService] Error getting order photos:', error);
      return { data: null, error: error.message || 'Failed to get order photos' };
    }
  }

  // Получить названия колонок для таблицы заказов
  getOrderColumns() {
    return supabaseConfig.schema.orders.columns;
  }

  // Фильтрация заказов по дате
  filterOrdersByDate(orders, dateFilter) {
    if (!orders || !dateFilter || dateFilter === 'all') return orders;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const monthEnd = new Date(today);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    return orders.filter(order => {
      const deliveryDate = new Date(order.delivery_time);
      deliveryDate.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'today':
          return deliveryDate.getTime() === today.getTime();
        case 'tomorrow':
          return deliveryDate.getTime() === tomorrow.getTime();
        case 'week':
          return deliveryDate >= today && deliveryDate < weekEnd;
        case 'month':
          return deliveryDate >= today && deliveryDate < monthEnd;
        default:
          return true;
      }
    });
  }
}

export const ordersService = new OrdersService();