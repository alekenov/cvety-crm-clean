/**
 * API для работы с заказами
 * Базовый URL: https://copywriter.kz/local/api
 * 
 * Структура заказа:
 * {
 *   number: string          // Номер заказа
 *   status: string         // Статус заказа
 *   client: string         // Телефон клиента
 *   address: string        // Адрес доставки
 *   time: string          // Время доставки
 *   totalPrice: string    // Общая сумма
 *   shop?: string         // Магазин (опционально)
 *   florist?: string      // Флорист (опционально)
 *   items: Array<{        // Состав заказа
 *     description: string // Описание товара
 *     price: string      // Цена
 *     image: string      // URL изображения
 *   }>
 * }
 * 
 * Доступные статусы заказов:
 * - Не оплачен
 * - Оплачен
 * - В работе
 * - Собран
 * - Ожидает курьера
 * - В пути
 * - Доставлен
 * - Проблема с доставкой
 */

import { supabase } from '../supabase';

const API_URL = process.env.VITE_API_URL || 'https://copywriter.kz/local/api';
const API_TOKEN = process.env.VITE_API_TOKEN || 'ABE7142D-D8AB-76AF-8D6C-2C4FAEA9B144';

/**
 * Получение списка заказов
 * GET /orders
 * @returns {Promise<Object>} Объект с заказами, сгруппированными по датам
 */
export const fetchOrdersFromApi = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Обновление статуса заказа
 * PUT /orders/{number}/status
 * @param {string} orderNumber - Номер заказа
 * @param {string} status - Новый статус
 */
export const updateOrderStatus = async (orderNumber, status) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('number', orderNumber.replace('№', ''));
    
  if (error) throw error;
};

/**
 * Обновление статуса пересборки заказа
 * PUT /orders/{number}/reassembly
 * @param {string} orderNumber - Номер заказа
 * @param {boolean} reassemblyRequested - Требуется ли пересборка
 */
export const updateOrderReassembly = async (orderNumber, reassemblyRequested) => {
  const { error } = await supabase
    .from('orders')
    .update({ 
      reassembly_requested: reassemblyRequested,
      status: reassemblyRequested ? 'reassembly_requested' : 'completed'
    })
    .eq('number', orderNumber.replace('№', ''));
    
  if (error) throw error;
};

/**
 * Загрузка фотографии к заказу
 * POST /orders/{number}/photos
 * @param {string} orderNumber - Номер заказа
 * @param {File} photo - Файл фотографии
 */
export const uploadOrderPhoto = async (orderNumber, photo) => {
  try {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await fetch(`${API_URL}/orders/${orderNumber}/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: formData
    });

    if (!response.ok) throw new Error('Ошибка загрузки фото');
    return await response.json();
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

/**
 * Получение деталей заказа
 * GET /orders/{number}
 * @param {string} orderNumber - Номер заказа
 */
export const getOrderDetails = async (orderNumber) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderNumber}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      }
    });

    if (!response.ok) throw new Error('Ошибка получения заказа');
    return await response.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Моковые данные для тестирования
const mockOrders = {
  today: [
    {
      number: '1001',
      status: 'Оплачен',
      client: '+7 777 123 45 67',
      address: 'ул. Абая 1',
      time: '14:00',
      totalPrice: '15000 ₸',
      shop: 'Магазин на Абая',
      florist: 'Айгуль',
      items: [
        {
          description: 'Букет роз',
          price: '10000 ₸',
          image: 'https://placeholder.com/150'
        },
        {
          description: 'Открытка',
          price: '5000 ₸',
          image: 'https://placeholder.com/150'
        }
      ]
    },
    {
      number: '1002',
      status: 'В работе',
      client: '+7 777 234 56 78',
      address: 'ул. Достык 2',
      time: '16:00',
      totalPrice: '20000 ₸',
      shop: 'Магазин на Достык',
      florist: 'Мадина',
      items: [
        {
          description: 'Букет тюльпанов',
          price: '20000 ₸',
          image: 'https://placeholder.com/150'
        }
      ]
    }
  ],
  tomorrow: [
    {
      number: '1003',
      status: 'Не оплачен',
      client: '+7 777 345 67 89',
      address: 'ул. Жандосова 3',
      time: '10:00',
      totalPrice: '25000 ₸',
      items: [
        {
          description: 'Букет пионов',
          price: '25000 ₸',
          image: 'https://placeholder.com/150'
        }
      ]
    }
  ],
  later: [
    {
      number: '1004',
      status: 'Оплачен',
      client: '+7 777 456 78 90',
      address: 'ул. Саина 4',
      time: '12:00',
      totalPrice: '30000 ₸',
      items: [
        {
          description: 'Букет хризантем',
          price: '30000 ₸',
          image: 'https://placeholder.com/150'
        }
      ]
    }
  ]
}; 