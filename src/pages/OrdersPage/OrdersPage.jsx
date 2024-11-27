import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import logger from '../../utils/logger';
import { ordersService } from '../../services/supabaseClient';
import { Clock, Phone, MapPin, MessageCircle, Truck, Store } from 'lucide-react';

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
    const today = new Date();
    const orderDate = new Date(dateString);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (orderDate.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (orderDate.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return orderDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  }

  return (
    <Card 
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <span className="font-bold text-lg">{order.number}</span>
          <Badge className={`${statusColors[order.status]} text-white`}>
            {order.status}
          </Badge>
          <span className="font-semibold text-green-600 w-full sm:w-auto mt-2 sm:mt-0">{order.totalPrice}</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <Clock size={16} className="mr-1" />
              {getDateText(order.date)}, {order.time}
            </span>
          </div>

          <div className="space-y-1">
            <p className="flex items-center text-gray-600">
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
            </p>
            <p className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              {order.address}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Состав заказа:</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.price}</span>
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

export default function OrdersPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await ordersService.fetchOrders();
        setOrders(fetchedOrders);
        setIsLoading(false);
      } catch (err) {
        console.error('Detailed Error:', err);
        setError(err);
        setIsLoading(false);
        toast.error(`Не удалось загрузить заказы: ${err.message || 'Неизвестная ошибка'}`);
        logger.error('OrdersPage', 'Ошибка при загрузке заказов', null, err);
      }
    };

    loadOrders();
  }, []);

  const handleOrderClick = useCallback((orderNumber) => {
    try {
      logger.log('OrdersPage', `Переход на страницу заказа ${orderNumber}`);
      const cleanNumber = String(orderNumber).replace(/[^0-9]/g, '');
      logger.log('OrdersPage', `Navigating to order details for order number: ${orderNumber}, clean ID: ${cleanNumber}`);
      navigate(`/orders/${cleanNumber}`);
    } catch (error) {
      logger.error('OrdersPage', `Ошибка при переходе на страницу заказа ${orderNumber}`, null, error);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await ordersService.updateOrderStatus(orderId, newStatus);
      
      // Обновляем локальный список заказов
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Статус заказа ${orderId} обновлен на ${newStatus}`);
    } catch (error) {
      console.error('Detailed Error:', error);
      toast.error(`Не удалось обновить статус заказа: ${error.message}`);
      logger.error('OrdersPage Status Change', 'Ошибка при изменении статуса заказа', { 
        orderId, 
        newStatus 
      }, error);
    }
  };

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

  const handleStatusFilterChange = useCallback((status) => {
    try {
      logger.log('OrdersPage', `Изменение фильтра статуса на ${status}`);
      setStatusFilter(status);
      console.log('Filtering by status:', status);
    } catch (error) {
      logger.error('OrdersPage', `Ошибка при изменении фильтра статуса`, null, error);
    }
  }, []);

  const handleDeliveryTypeFilterChange = useCallback((type) => {
    try {
      logger.log('OrdersPage', `Изменение фильтра типа доставки на ${type}`);
      setDeliveryTypeFilter(type);
      console.log('Filtering by delivery type:', type);
    } catch (error) {
      logger.error('OrdersPage', `Ошибка при изменении фильтра типа доставки`, null, error);
    }
  }, []);

  const handleDateFilterChange = useCallback((date) => {
    try {
      logger.log('OrdersPage', `Изменение фильтра даты на ${date}`);
      setDateFilter(date);
      if (date !== 'custom') {
        setCustomDate(null);
      }
      console.log('Filtering by date:', date);
    } catch (error) {
      logger.error('OrdersPage', `Ошибка при изменении фильтра даты`, null, error);
    }
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDeliveryType = deliveryTypeFilter === 'all' || order.deliveryMethod === deliveryTypeFilter;
    const matchesSearch = !searchQuery || 
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientComment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (dateFilter === 'today') {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'tomorrow') {
        matchesDate = orderDate.toDateString() === tomorrow.toDateString();
      } else if (dateFilter === 'custom' && customDate) {
        matchesDate = orderDate.toDateString() === new Date(customDate).toDateString();
      }
    }

    return matchesStatus && matchesDeliveryType && matchesSearch && matchesDate;
  });

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
          <Button 
            onClick={handleNewOrder} 
            variant="primary"
            size="md"
          >
            <div />
            Новый заказ
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium mb-2">Статус заказа</h3>
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    {Object.keys(statusColors).map(status => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${statusColors[status]}`} />
                          {status}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Тип доставки</h3>
                <div className="flex gap-2">
                  <Button
                    variant={deliveryTypeFilter === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDeliveryTypeFilterChange('all')}
                  >
                    Все типы доставки
                  </Button>
                  <Button
                    variant={deliveryTypeFilter === 'delivery' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDeliveryTypeFilterChange('delivery')}
                  >
                    <Truck size={16} className="mr-1" />
                    Доставка
                  </Button>
                  <Button
                    variant={deliveryTypeFilter === 'pickup' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDeliveryTypeFilterChange('pickup')}
                  >
                    <Store size={16} className="mr-1" />
                    Самовывоз
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Дата заказа</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={dateFilter === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDateFilterChange('all')}
                  >
                    Все даты
                  </Button>
                  <Button
                    variant={dateFilter === 'today' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDateFilterChange('today')}
                  >
                    Сегодня
                  </Button>
                  <Button
                    variant={dateFilter === 'tomorrow' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDateFilterChange('tomorrow')}
                  >
                    Завтра
                  </Button>
                  <div>
                    <Button
                      variant={dateFilter === 'custom' ? 'primary' : 'outline'}
                      size="sm"
                    >
                      <div />
                      {customDate ? 'Выбранная дата' : 'Выбрать дату'}
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Поиск</h3>
                <div>
                  <div />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Поиск по номеру, клиенту или адресу" 
                    className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders
            .map((order) => (
              <OrderCard
                key={order.number}
                order={order}
                onStatusChange={handleStatusChange}
                onUploadPhoto={handleUploadPhoto}
                onRespondToClientReaction={handleRespondToClientReaction}
                onViewPhotos={handleViewPhotos}
                onClick={() => handleOrderClick(order.number)}
              />
            ))}
        </div>
      </div>
    </div>
  )
}