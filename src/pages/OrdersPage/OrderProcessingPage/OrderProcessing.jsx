import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, Camera, MapPin, 
  ThumbsUp, ThumbsDown, Gift, AlertTriangle, X, Map, 
  Minus, Plus, Clock, DollarSign, Send
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from "../../../components/ui/Input/Input";
import { Textarea } from "../../../components/ui/Textarea/Textarea";
import { toast } from 'react-hot-toast';

import FlowerWriteOff from '../components/FlowerWriteOff';
import DeliveryAddressInput from '../components/DeliveryAddressInput';
import { ORDER_STATUS, getStatusLabel, getNextStatuses } from '../../../constants/orderStatuses';
import { Modal } from '@/components/ui/overlays/Modal';
import { logger } from '../../../services/logging/loggingService';
import { ordersService } from '../../../services/ordersService';
import { supabase } from '../../../services/supabaseClient';

import OrderTab from './OrderTab/OrderTab';
import BouquetTab from './BouquetTab/BouquetTab';
import DeliveryTab from './DeliveryTab/DeliveryTab';

const mockOrders = [
  {
    id: '1234',
    number: '№1234',
    totalPrice: '15,000 ₸',
    date: '2024-03-24',
    time: '14:30',
    status: ORDER_STATUS.NEW,
    deliveryType: 'delivery',
    address: 'ул. Абая 150, кв. 25',
    comment: 'Добрый день! Большая просьба собрать композицию цветов из нежно розового оттенка',
    card: 'С любовью, Айдос',
    details: {
      total: 15000,
      recipient: {
        name: 'Айгерим Сатпаева',
        phone: '+7 (777) 123-45-67',
      },
    },
    items: [
      { id: 1, name: 'Розы красные', quantity: 11, price: '1,000 ₸' },
      { id: 2, name: 'Упаковка премиум', quantity: 1, price: '4,000 ₸' }
    ],
    hasPhoto: false,
    hasClientReaction: false
  },
  {
    id: '1235',
    number: '№1235',
    totalPrice: '55,000 ₸',
    date: '2024-03-24',
    time: '15:00',
    status: ORDER_STATUS.PAID,
    deliveryType: 'delivery',
    address: 'ул. Достык 123, кв. 45',
    comment: 'Хочу букет в бело-розовых тонах',
    card: 'С днем рождения!',
    details: {
      total: 55000,
      recipient: {
        name: 'Динара Касымова',
        phone: '+7 (777) 987-65-43',
      },
    },
    items: [
      { id: 1, name: 'Роза Red Naomi 60 см', quantity: 15, price: '2,000 ₸', length: '60 см' },
      { id: 2, name: 'Гвоздика розовая 50 см', quantity: 7, price: '1,000 ₸', length: '50 см' },
      { id: 3, name: 'Хризантема кустовая 50 см', quantity: 3, price: '1,500 ₸', length: '50 см' },
      { id: 4, name: 'Эустома белая 50 см', quantity: 5, price: '1,800 ₸', length: '50 см' },
      { id: 5, name: 'Статица сиреневая 45 см', quantity: 2, price: '1,200 ₸', length: '45 см' }
    ],
    hasPhoto: false,
    hasClientReaction: false
  },
  {
    id: '1236',
    number: '№1236',
    totalPrice: '18,000 ₸',
    date: '2024-03-24',
    time: '16:30',
    status: ORDER_STATUS.NEW,
    deliveryType: 'delivery',
    address: 'ул. Сатпаева 90, кв. 12',
    comment: 'Букет на день рождения, яркие цвета',
    card: 'Поздравляю с днем рождения!',
    details: {
      total: 18000,
      recipient: {
        name: 'Марат Сериков',
        phone: '+7 (777) 555-44-33',
      },
    },
    items: [
      { id: 1, name: 'Тюльпаны красные', quantity: 15, price: '800 ₸' },
      { id: 2, name: 'Герберы оранжевые', quantity: 5, price: '1,200 ₸' },
      { id: 3, name: 'Упаковка стандарт', quantity: 1, price: '3,000 ₸' }
    ],
    hasPhoto: false,
    hasClientReaction: false
  },
  {
    id: '1237',
    number: '№1237',
    totalPrice: '32,000 ₸',
    date: '2024-03-24',
    time: '17:30',
    status: ORDER_STATUS.COLLECTED,
    deliveryType: 'delivery',
    address: 'ул. Жандосова 58, кв. 89',
    comment: 'Доставить до 18:00',
    card: 'С наилучшими пожеланиями!',
    details: {
      total: 32000,
      recipient: {
        name: 'Асель Маратова',
        phone: '+7 (708) 456-78-90',
      },
    },
    items: [
      { id: 1, name: 'Пионы розовые', quantity: 7, price: '4,000 ₸' },
      { id: 2, name: 'Упаковка люкс', quantity: 1, price: '5,000 ₸' }
    ],
    hasPhoto: true,
    hasClientReaction: false
  },
  {
    id: '1240',
    number: '№1240',
    totalPrice: '28,000 ₸',
    date: '2024-03-25',
    time: '12:45',
    status: ORDER_STATUS.DELIVERED,
    deliveryType: 'delivery',
    address: 'ул. Тимирязева 42, офис 506',
    comment: 'Доставка в офис, позвонить за 15 минут',
    card: 'От всего коллектива!',
    details: {
      total: 28000,
      recipient: {
        name: 'Ержан Касымов',
        phone: '+7 (707) 789-01-23',
      },
    },
    items: [
      { id: 1, name: 'Гортензии синие', quantity: 3, price: '8,000 ₸' },
      { id: 2, name: 'Упаковка премиум', quantity: 1, price: '4,000 ₸' }
    ],
    hasPhoto: true,
    hasClientReaction: true
  }
];

export default function OrderProcessing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('order');
  const [orderStatus, setOrderStatus] = useState(null);

  // Проверяем, является ли id валидным UUID
  const isValidOrderId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  useEffect(() => {
    console.log('OrderProcessing Component Mounted');
    console.log('Order ID:', id);
    console.log('Supabase headers:', supabase.headers);
    console.log('Supabase config:', supabase.config);

    const fetchOrder = async () => {
      if (!isValidOrderId) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Attempting to fetch order with ID: ${id}`);
        
        // Проверяем и преобразуем ID перед запросом
        const sanitizedId = id.trim();
        
        // Получаем заказ по ID (предполагаем, что все ID теперь в формате UUID)
        const { data, error } = await ordersService.getById(sanitizedId);

        if (error) {
          throw new Error(error);
        }

        if (!data) {
          throw new Error('Заказ не найден');
        }

        console.log('Fetched order details:', data);
        console.log('Order items:', data.items);
        
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isValidOrderId]);

  useEffect(() => {
    console.log('Order ID:', id);
  }, [id]);

  // Состояния для модальных окон
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [writeOffModalOpen, setWriteOffModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Состояния для заказа
  const [items, setItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [margin, setMargin] = useState(0);
  const [statusHistory, setStatusHistory] = useState([]);

  // Состояния для сообщений
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Состояния для букета
  const [photos, setPhotos] = useState([]);
  const [bouquetComposition, setBouquetComposition] = useState([]);
  const [actualCost, setActualCost] = useState(0);
  const [clientFeedback, setClientFeedback] = useState(null);
  const [selectedBouquet, setSelectedBouquet] = useState(null);

  // Состояния для доставки
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    entrance: '',
    floor: '',
    apartment: '',
    comment: ''
  });
  const [courier, setCourier] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  // Состояния для списания
  const [selectedWriteOffItem, setSelectedWriteOffItem] = useState(null);
  const [writeOffQuantity, setWriteOffQuantity] = useState(1);
  const [writeOffReason, setWriteOffReason] = useState('');

  // Дополнительные состояния
  const [isDeliveryAddressModalOpen, setIsDeliveryAddressModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);

  const handleOrderUpdate = (updatedOrder) => {
    console.log('Updating order with:', updatedOrder);
    setOrder(updatedOrder);
  };

  // Обработчики изменения данных заказа
  const handleCommentChange = async (comment) => {
    try {
      await ordersService.updateOrder(order.id, { comment });
      setOrder(prev => ({ ...prev, comment }));
      toast.success('Комментарий обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении комментария');
      console.error('Error updating comment:', error);
    }
  };

  const handleCardTextChange = async (cardText) => {
    try {
      await ordersService.updateOrder(order.id, { card_text: cardText });
      setOrder(prev => ({ ...prev, card_text: cardText }));
      toast.success('Текст открытки обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении текста открытки');
      console.error('Error updating card text:', error);
    }
  };

  const handleDeliveryMethodChange = async (method) => {
    try {
      await ordersService.updateOrder(order.id, { delivery_method: method });
      setOrder(prev => ({ ...prev, delivery_method: method }));
      toast.success('Способ доставки обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении способа доставки');
      console.error('Error updating delivery method:', error);
    }
  };

  const handleDeliveryAddressChange = async (address) => {
    try {
      await ordersService.updateOrder(order.id, { delivery_address: address });
      setOrder(prev => ({ ...prev, delivery_address: address }));
      toast.success('Адрес доставки обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении адреса доставки');
      console.error('Error updating delivery address:', error);
    }
  };

  const handleRecipientNameChange = async (name) => {
    try {
      const updatedDetails = {
        ...order?.details,
        recipient: { ...order?.details?.recipient, name }
      };
      await ordersService.updateOrder(order.id, { details: updatedDetails });
      setOrder(prev => ({ ...prev, details: updatedDetails }));
      toast.success('Имя получателя обновлено');
    } catch (error) {
      toast.error('Ошибка при обновлении имени получателя');
      console.error('Error updating recipient name:', error);
    }
  };

  const handleRecipientPhoneChange = async (phone) => {
    try {
      const updatedDetails = {
        ...order?.details,
        recipient: { ...order?.details?.recipient, phone }
      };
      await ordersService.updateOrder(order.id, { details: updatedDetails });
      setOrder(prev => ({ ...prev, details: updatedDetails }));
      toast.success('Телефон получателя обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении телефона получателя');
      console.error('Error updating recipient phone:', error);
    }
  };

  // Функция изменения статуса
  const handleStatusChange = async (newStatus) => {
    try {
      const timestamp = new Date().toISOString();
      const statusUpdate = {
        status: newStatus,
        timestamp,
        user: 'current_user', // TODO: Получать из контекста авторизации
      };

      // Сохраняем в базу
      const { error } = await ordersService.updateOrderStatus(order.id, newStatus);
      
      if (error) throw error;

      // Обновляем локальное состояние
      setOrderStatus(newStatus);
      setStatusHistory(prev => [...prev, statusUpdate]);
      
      // Уведомляем пользователя
      toast.success(`Статус заказа изменен на "${getStatusLabel(newStatus)}"`);
      
      // Закрываем модальное окно
      setIsStatusModalOpen(false);
      
      // Логируем изменение
      logger.info('Order status updated', { 
        orderId: order.id, 
        oldStatus: orderStatus, 
        newStatus, 
        timestamp 
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Ошибка при изменении статуса заказа');
      logger.error('Failed to update order status', { 
        orderId: order.id, 
        error: error.message 
      });
    }
  };

  // Обработчики событий
  const handlePhotoUpload = () => {
    toast.success('Фото отправлено клиенту');
  };

  // Условный рендеринг
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
        <p className="text-red-500 text-xl">{error || 'Заказ не найден'}</p>
        <Button onClick={() => navigate('/orders')} className="mt-4">
          Вернуться к заказам
        </Button>
      </div>
    );
  }

  // Основной рендеринг
  return (
    <div className="container mx-auto py-6">
      {/* Шапка с номером заказа и кнопкой назад */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/orders')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">
              Заказ №{order?.number || id}
            </h2>
            <Badge variant="outline" className="text-base">
              {getStatusLabel(order?.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="order">Заказ</TabsTrigger>
          <TabsTrigger value="bouquet">Букет</TabsTrigger>
          <TabsTrigger value="delivery">Доставка</TabsTrigger>
        </TabsList>

        <TabsContent value="order">
          <OrderTab 
            order={order}
            onStatusChange={handleStatusChange}
            onCommentChange={handleCommentChange}
            onCardTextChange={handleCardTextChange}
          />
        </TabsContent>

        <TabsContent value="bouquet">
          <BouquetTab order={order} onOrderUpdate={handleOrderUpdate} />
        </TabsContent>

        <TabsContent value="delivery">
          <DeliveryTab 
            order={order}
            onDeliveryMethodChange={handleDeliveryMethodChange}
            onDeliveryAddressChange={handleDeliveryAddressChange}
            onRecipientNameChange={handleRecipientNameChange}
            onRecipientPhoneChange={handleRecipientPhoneChange}
          />
        </TabsContent>
      </div>
    </div>
  );
};