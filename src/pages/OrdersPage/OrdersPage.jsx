import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import logger from '../../utils/logger';
import { ordersService } from '@/services/ordersService';
import { Clock, Phone, MapPin, MessageCircle, Truck, Store } from 'lucide-react';
import { Heading, Text, Label } from '@/components/ui/Typography/Typography';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DateFilter from '@/components/Filters/DateFilter';
import TypeFilter from '@/components/Filters/TypeFilter';

// Services
import { storageService } from '@/services/storage/storageService';

const statusColors = {
  'Не оплачен': 'bg-red-500',
  'Оплачен': 'bg-blue-500',
  'В работе': 'bg-yellow-500',
  'Собран': 'bg-purple-500',
  'Ожидает курьера': 'bg-orange-500',
  'В пути': 'bg-indigo-500',
  'Доставлен': 'bg-green-500',
  'Проблема с доставкой': 'bg-red-700',
  'Готов к самовывозу': 'bg-teal-500'
}

const nextStatus = {
  'Не оплачен': 'Оплачен',
  'Оплачен': 'В работе',
  'В работе': 'Собран',
  'Собран': 'Ожидает курьера',
  'Ожидает курьера': 'В пути',
  'В пути': 'Доставлен',
  'Готов к самовывозу': 'Доставлен'
}

const OrderCard = ({ order, onStatusChange, onUploadPhoto, onRespondToClientReaction, onClick, onViewPhotos }) => {
  const getDateText = (dateString) => {
    if (!dateString) return 'Дата не указана';
    
    try {
      const orderDate = new Date(dateString);
      
      // Проверка на корректность даты
      if (isNaN(orderDate.getTime())) {
        console.warn('Invalid date:', dateString);
        return 'Некорректная дата';
      }
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (orderDate.toDateString() === today.toDateString()) {
        return 'Сегодня';
      } else if (orderDate.toDateString() === tomorrow.toDateString()) {
        return 'Завтра';
      } else {
        return orderDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Ошибка даты';
    }
  }

  return (
    <Card 
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={onClick}
      data-order-id={order.id}  // Добавляем data-атрибут
    >
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <Text variant="h2" className="font-bold text-lg">{order.number}</Text>
          <Badge className={`${statusColors[order.status]} text-white`}>
            {order.status}
          </Badge>
          <Text variant="body" className="font-semibold text-green-600 w-full sm:w-auto mt-2 sm:mt-0">{order.totalPrice}</Text>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Text variant="body" className="text-gray-600 flex items-center">
              <Clock size={16} className="mr-1" />
              {getDateText(order.date)}, {order.time}
            </Text>
          </div>

          <div className="space-y-1">
            <Text variant="body" className="flex items-center text-gray-600">
              <Phone size={16} className="mr-1" />
              {order.phone}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${order.phone}`;
                }}
              >
                <Phone size={16} className="text-blue-500" />
                <span className="sr-only">Call client</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`);
                }}
              >
                <MessageCircle size={16} className="text-green-500" />
                <span className="sr-only">WhatsApp client</span>
              </Button>
            </Text>
            <Text variant="body" className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              {order.address}
            </Text>
          </div>

          <div>
            <Text variant="h3" className="font-medium mb-2">Состав заказа:</Text>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <Text variant="body">{item.name}</Text>
                  </div>
                  <Text variant="body" className="font-medium">{item.price}</Text>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {order.status === 'Оплачен' && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      onUploadPhoto(order.id, file);
                    }
                  };
                  input.click();
                }}
              >
                <div />
                Загрузить фото
              </Button>
            )}
            {order.hasPhoto && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewPhotos(order.number);
                }}
              >
                <div className="w-4 h-4" />
                Просмотр фото
              </Button>
            )}
            {nextStatus[order.status] && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(order.id, nextStatus[order.status]);
                }}
              >
                <div />
                {nextStatus[order.status]}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const mockOrders = [
  {
    number: '№1234',
    totalPrice: '15,000 ₸',
    date: '2024-03-24',
    time: '14:30',
    status: 'Не оплачен',
    deliveryType: 'delivery',
    address: 'ул. Абая 150, кв. 25',
    clientName: 'Айгерим Сатпаева',
    phone: '+7 (777) 123-45-67',
    hasClientReaction: true,
    hasPhoto: false,
    items: [
      { name: 'Розы красные', quantity: 11, price: '1,000 ₸' },
      { name: 'Упаковка премиум', quantity: 1, price: '4,000 ₸' }
    ]
  },
  {
    number: '№1235',
    totalPrice: '55,000 ₸',
    date: '2024-03-24',
    time: '15:00',
    status: 'Оплачен',
    deliveryType: 'delivery',
    address: 'пр. Достык 89, офис 401',
    clientName: 'Болат Нурланов',
    phone: '+7 (707) 234-56-78',
    hasClientReaction: false,
    hasPhoto: true,
    comment: 'Хочу букет в бело-розовых тонах',
    items: [
      { name: 'Роза Red Naomi 60 см', quantity: 15, price: '2,000 ₸' },
      { name: 'Гвоздика розовая 50 см', quantity: 7, price: '1,000 ₸' },
      { name: 'Хризантема кустовая 50 см', quantity: 3, price: '1,500 ₸' },
      { name: 'Эустома белая 50 см', quantity: 5, price: '1,800 ₸' },
      { name: 'Статица сиреневая 45 см', quantity: 2, price: '1,200 ₸' }
    ]
  },
  {
    number: '№1236',
    totalPrice: '18,500 ₸',
    date: '2024-03-24',
    time: '16:15',
    status: 'В работе',
    deliveryType: 'pickup',
    address: 'Магазин на Байтурсынова',
    clientName: 'Динара Ахметова',
    phone: '+7 (747) 345-67-89',
    hasClientReaction: false,
    hasPhoto: true,
    items: [
      { name: 'Тюльпаны микс', quantity: 15, price: '800 ₸' },
      { name: 'Зелень декоративная', quantity: 2, price: '1,500 ₸' }
    ]
  },
  {
    number: '№1237',
    totalPrice: '32,000 ₸',
    date: '2024-03-24',
    time: '17:30',
    status: 'Собран',
    deliveryType: 'delivery',
    address: 'ул. Жандосова 58, кв. 89',
    clientName: 'Асель Маратова',
    phone: '+7 (708) 456-78-90',
    hasClientReaction: false,
    hasPhoto: true,
    items: [
      { name: 'Пионы розовые', quantity: 7, price: '4,000 ₸' },
      { name: 'Упаковка люкс', quantity: 1, price: '5,000 ₸' }
    ]
  },
  {
    number: '№1238',
    totalPrice: '45,000 ₸',
    date: '2024-03-25',
    time: '10:00',
    status: 'Ожидает курьера',
    deliveryType: 'delivery',
    address: 'ул. Сатпаева 90/20, кв. 150',
    clientName: 'Марат Сулейменов',
    phone: '+7 (701) 567-89-01',
    hasClientReaction: false,
    hasPhoto: true,
    items: [
      { name: 'Розы премиум микс', quantity: 25, price: '1,500 ₸' },
      { name: 'Упаковка премиум', quantity: 1, price: '7,500 ₸' }
    ]
  },
  {
    number: '№1239',
    totalPrice: '22,000 ₸',
    date: '2024-03-25',
    time: '11:30',
    status: 'В пути',
    deliveryType: 'delivery',
    address: 'пр. Аль-Фараби 77/8, кв. 203',
    clientName: 'Алия Нурпеисова',
    phone: '+7 (777) 678-90-12',
    hasClientReaction: false,
    hasPhoto: true,
    items: [
      { name: 'Лилии белые', quantity: 5, price: '3,500 ₸' },
      { name: 'Упаковка стандарт', quantity: 1, price: '2,500 ₸' }
    ]
  },
  {
    number: '№1240',
    totalPrice: '28,000 ₸',
    date: '2024-03-25',
    time: '12:45',
    status: 'Доставлен',
    deliveryType: 'delivery',
    address: 'ул. Тимирязева 42, офис 506',
    clientName: 'Ержан Касымов',
    phone: '+7 (707) 789-01-23',
    hasClientReaction: true,
    hasPhoto: true,
    items: [
      { name: 'Гортензии синие', quantity: 3, price: '8,000 ₸' },
      { name: 'Упаковка премиум', quantity: 1, price: '4,000 ₸' }
    ]
  },
  {
    number: '№1241',
    totalPrice: '19,500 ₸',
    date: '2024-03-25',
    time: '14:00',
    status: 'Проблема с доставкой',
    deliveryType: 'delivery',
    address: 'ул. Розыбакиева 247, кв. 89',
    clientName: 'Гульнара Сериккызы',
    phone: '+7 (747) 890-12-34',
    hasClientReaction: true,
    hasPhoto: true,
    items: [
      { name: 'Хризантемы кустовые', quantity: 7, price: '2,500 ₸' },
      { name: 'Упаковка стандарт', quantity: 1, price: '2,000 ₸' }
    ]
  },
  {
    number: '№1242',
    totalPrice: '35,000 ₸',
    date: '2024-03-25',
    time: '15:30',
    status: 'Готов к самовывозу',
    deliveryType: 'pickup',
    address: 'Магазин на Байтурсынова',
    clientName: 'Тимур Жумабаев',
    phone: '+7 (708) 901-23-45',
    hasClientReaction: false,
    hasPhoto: true,
    items: [
      { name: 'Розы красные премиум', quantity: 21, price: '1,500 ₸' },
      { name: 'Упаковка люкс', quantity: 1, price: '3,500 ₸' }
    ]
  },
  {
    number: '№1243',
    totalPrice: '42,000 ₸',
    date: '2024-03-26',
    time: '09:00',
    status: 'Не оплачен',
    deliveryType: 'delivery',
    address: 'пр. Назарбаева 301, кв. 42',
    clientName: 'Сауле Бекенова',
    phone: '+7 (777) 012-34-56',
    hasClientReaction: false,
    hasPhoto: false,
    items: [
      { name: 'Пионовидные розы', quantity: 15, price: '2,500 ₸' },
      { name: 'Упаковка премиум', quantity: 1, price: '4,500 ₸' }
    ]
  }
];

// Добавляем стили для анимации исчезновения
const orderVanishStyles = `
  @keyframes orderVanish {
    0% { 
      opacity: 1; 
      transform: scale(1) rotate(0deg);
    }
    50% { 
      opacity: 0.5; 
      transform: scale(1.1) rotate(10deg);
    }
    100% { 
      opacity: 0; 
      transform: scale(0.1) rotate(360deg);
    }
  }

  .order-vanish {
    animation: orderVanish 5s ease-in-out forwards;
  }
`;

export default function OrdersPage() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('today');
  const [typeFilter, setTypeFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Получаем список заказов
        const fetchedOrders = await ordersService.fetchOrders();
        
        if (fetchedOrders && Array.isArray(fetchedOrders)) {
          setOrders(fetchedOrders);
          setError(null);
        } else {
          throw new Error('Получены некорректные данные от сервера');
        }
      } catch (err) {
        console.error('Detailed Error:', err);
        setError(err);
        
        // Если ошибка связана с превышением лимита запросов, пробуем повторить через некоторое время
        if (err.message?.includes('rate limit') && retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // Экспоненциальная задержка
          toast.error(`Превышен лимит запросов. Повторная попытка через ${retryDelay/1000} сек...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, retryDelay);
          
          return;
        }
        
        toast.error(`Не удалось загрузить заказы: ${err.message || 'Неизвестная ошибка'}`);
        logger.error('OrdersPage', 'Ошибка при загрузке заказов', null, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [retryCount]); // Перезапускаем эффект при изменении счетчика повторных попыток

  const handleOrderClick = useCallback((orderNumber) => {
    try {
      if (!orderNumber) {
        throw new Error('Номер заказа не указан');
      }
      logger.log('OrdersPage', `Переход на страницу заказа ${orderNumber}`);
      
      // Извлекаем только цифры из номера заказа
      const cleanNumber = String(orderNumber).replace(/[^0-9]/g, '');
      
      logger.log('OrdersPage', `Navigating to order details for order number: ${orderNumber}, clean ID: ${cleanNumber}`);
      
      if (!cleanNumber) {
        throw new Error('Некорректный номер заказа');
      }
      
      // Используем прямую навигацию без проверки
      navigate(`/orders/${cleanNumber}`);
    } catch (error) {
      console.error('Detailed error:', error);
      logger.error('OrdersPage', `Ошибка при переходе на страницу заказа ${orderNumber}`, null, error);
      toast.error(`Не удалось перейти на страницу заказа: ${error.message}`);
    }
  }, [navigate]);

  const handleNewOrder = useCallback(() => {
    try {
      logger.log('OrdersPage', 'Создание нового заказа');
      navigate('/orders/create');
    } catch (error) {
      logger.error('OrdersPage', 'Ошибка при создании нового заказа', null, error);
    }
  }, [navigate]);

  const handleUploadPhoto = useCallback(async (orderId, photoFile) => {
    try {
      // Генерируем уникальное имя файла
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${orderId}_${Date.now()}.${fileExt}`;
      const filePath = `orders/${fileName}`;

      // Загрузка файла в Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('order_photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      // Получаем публичный URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('order_photos')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      // Обновляем запись заказа с URL фото
      const updatedOrder = await ordersService.uploadOrderPhoto(orderId, publicUrl);

      // Обновляем локальное состояние
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                photos: [...(order.photos || []), publicUrl]
              } 
            : order
        )
      );

      toast.success('Фото успешно загружено');
      logger.log('OrdersPage', `Загружено фото для заказа ${orderId}`);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Не удалось загрузить фото');
      logger.error('OrdersPage', 'Ошибка при загрузке фото', null, error);
    }
  }, []);

  const handleRespondToClientReaction = useCallback((orderNumber, reaction) => {
    try {
      logger.log('OrdersPage', `Ответ на реакцию клиента для заказа ${orderNumber}`);
      console.log(`Responding to client reaction for order ${orderNumber}: ${reaction}`);
    } catch (error) {
      logger.error('OrdersPage', `Ошибка при ответе на реакцию клиента для заказа ${orderNumber}`, null, error);
    }
  }, []);

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      await ordersService.updateOrderStatus(orderId, newStatus);
      
      // Обновляем локальное состояние
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success('Статус заказа обновлен');
    } catch (error) {
      logger.error('Error updating order status:', error);
      toast.error('Ошибка при обновлении статуса заказа');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewPhotos = useCallback(async (orderNumber) => {
    try {
      logger.log('OrdersPage', `Просмотр фото для заказа ${orderNumber}`);
      const cleanNumber = orderNumber.replace(/[^0-9]/g, '');
      const path = `orders/${cleanNumber}/photos`;
      
      const photos = await storageService.listFiles(path);
      
      if (photos && photos.length > 0) {
        // Here you could show photos in a modal or navigate to a photos view
        logger.log('OrdersPage', `Фото для заказа ${orderNumber} успешно загружены`);
        console.log('Order photos:', photos);
      } else {
        toast.error('Нет фотографий для этого заказа');
        logger.error('OrdersPage', `Ошибка при загрузке фото для заказа ${orderNumber}`);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Ошибка при загрузке фотографий');
      logger.error('OrdersPage', `Ошибка при загрузке фото для заказа ${orderNumber}`, null, error);
    }
  }, []);

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      console.warn('Orders is not an array:', orders);
      return [];
    }

    console.log('Total orders before filtering:', orders.length);
    
    let filtered = [...orders];

    // Date filtering
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(order => {
        // Используем любую доступную дату
        const orderDate = new Date(order.delivery_time || order.created_at);
        const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        console.log('Order date check:', {
          orderId: order.id,
          orderDate: orderDay,
          today: todayDay,
          filter: dateFilter,
          match: orderDay.getTime() === todayDay.getTime()
        });

        switch (dateFilter) {
          case 'today':
            return orderDay.getTime() === todayDay.getTime();
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return orderDay.getTime() === tomorrow.getTime();
          case 'week':
            const weekLater = new Date(today);
            weekLater.setDate(weekLater.getDate() + 7);
            return orderDay >= today && orderDay <= weekLater;
          case 'month':
            const monthLater = new Date(today);
            monthLater.setMonth(monthLater.getMonth() + 1);
            return orderDay >= today && orderDay <= monthLater;
          default:
            return true;
        }
      });
    }

    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.number?.toString().toLowerCase().includes(query) ||
        order.client_name?.toLowerCase().includes(query) ||
        order.client_phone?.toLowerCase().includes(query)
      );
    }

    console.log('Filtering results:', {
      totalBefore: orders.length,
      totalAfter: filtered.length,
      dateFilter,
      searchQuery
    });

    return filtered;
  }, [orders, dateFilter, searchQuery]); // Убрали typeFilter из зависимостей

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Heading className="text-3xl font-bold">Заказы</Heading>
        <Button onClick={() => navigate('/orders/new')} variant="default">
          Новый заказ
        </Button>
      </div>

      <div className="space-y-6">
        <DateFilter 
          value={dateFilter} 
          onChange={(value) => {
            console.log('Date filter changed:', value);
            setDateFilter(value);
          }} 
        />
        {/* Временно скрываем фильтр по типу */}
        {/* <TypeFilter value={typeFilter} onChange={setTypeFilter} /> */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            {error.message || 'Произошла ошибка при загрузке заказов'}
          </div>
          <Button 
            onClick={() => setRetryCount(prev => prev + 1)}
            variant="outline"
          >
            Попробовать снова
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Заказы не найдены
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onUploadPhoto={handleUploadPhoto}
              onRespondToClientReaction={handleRespondToClientReaction}
              onClick={() => handleOrderClick(order.number)}
              onViewPhotos={() => handleViewPhotos(order)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Всего заказов: {orders.length}, Отфильтровано: {filteredOrders.length}
      </div>
    </div>
  );
}