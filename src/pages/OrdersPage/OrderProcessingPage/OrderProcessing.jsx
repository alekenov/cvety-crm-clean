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

const OrderProcessing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Основные состояния
  const [activeTab, setActiveTab] = useState("order");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUS.NEW);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  
  // Состояния для вкладки "ЗАКАЗ"
  const [items, setItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [margin, setMargin] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Состояния для вкладки "БУКЕТ"
  const [photos, setPhotos] = useState([]);
  const [bouquetComposition, setBouquetComposition] = useState([]);
  const [actualCost, setActualCost] = useState(0);
  const [clientFeedback, setClientFeedback] = useState(null);
  
  // Состояния для вкладки "ДОСТАВКА"
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    entrance: '',
    floor: '',
    apartment: '',
    intercom: '',
    comment: ''
  });
  const [courier, setCourier] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  // Обработчики событий
  const handlePhotoUpload = () => {
    // Реализация загрузки фото
    toast.success('Фото отправлено клиенту');
  };

  const handleDeliveryConfirm = () => {
    // Реализация подтверждения доставки
    setDeliveryStatus('completed');
    toast.success('Доставка подтверждена');
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) {
        logger.warn('OrderProcessing', 'No order ID provided');
        return;
      }

      setLoading(true);
      logger.log('OrderProcessing', `Searching for order with ID: ${id}`);

      try {
        // Ищем заказ по номеру в mockOrders
        const mockOrder = mockOrders.find(order => {
          const orderNumber = order.number.replace(/[^0-9]/g, '');
          logger.debug('OrderProcessing', `Comparing order numbers: ${orderNumber} === ${id}`);
          return orderNumber === id;
        });
        
        if (mockOrder) {
          logger.log('OrderProcessing', 'Found order', { 
            orderNumber: mockOrder.number,
            status: mockOrder.status,
            recipient: mockOrder.details.recipient.name
          });
          setOrderData(mockOrder);
          setOrderStatus(mockOrder.status || ORDER_STATUS.NEW);
        } else {
          logger.error('OrderProcessing', `Order not found for ID: ${id}`);
          navigate('/orders');
        }
      } catch (error) {
        logger.error('OrderProcessing', 'Error fetching order', { error: error.message });
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id, navigate]);

  // Показываем загрузку только когда реально что-то загружаем
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-lg">Загрузка заказа...</div>
      </div>
    );
  }

  // Не показываем ничего, пока нет данных
  if (!orderData) {
    return null;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'order':
        return <OrderTab />;
      case 'bouquet':
        return <BouquetTab />;
      case 'delivery':
        return <DeliveryTab />;
      default:
        return <OrderTab />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">Заказ {orderData?.number}</h2>
            <Badge variant={orderStatus === ORDER_STATUS.PAID ? "success" : "warning"}>
              {getStatusLabel(orderStatus)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span>{orderData?.time}</span>
        </div>
      </div>
      
      <div className="flex mb-4 space-x-4 p-4">
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'order' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('order')}
        >
          Заказ
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'bouquet' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('bouquet')}
        >
          Букет
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'delivery' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('delivery')}
        >
          Доставка
        </button>
      </div>
      
      {renderTab()}

      {/* Нижняя панель с действиями */}
      <div className="border-t bg-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Итого</p>
            <p className="text-xl font-bold">{orderData.totalPrice}</p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'order' && (
              <>
                <Button variant="outline" onClick={() => setShowRefundModal(true)}>
                  Отклонить
                </Button>
                <Button onClick={() => setShowPaymentModal(true)}>
                  Принять
                </Button>
              </>
            )}
            {activeTab === 'bouquet' && (
              <Button onClick={handlePhotoUpload}>
                Отправить фото
              </Button>
            )}
            {activeTab === 'delivery' && (
              <Button onClick={handleDeliveryConfirm}>
                Подтвердить доставку
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessing;