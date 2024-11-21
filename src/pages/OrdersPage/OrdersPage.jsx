import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Camera, Truck, AlertTriangle, MapPin, Phone, User, Store, Clock, ThumbsUp, ThumbsDown, RefreshCw, Check, ArrowRight, Plus, Calendar, X, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Input from "@/components/ui/Input/Input"

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

const OrderCard = ({ order, onStatusChange, onUploadPhoto, onRespondToClientReaction, onClick }) => {
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
              {order.client}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${order.client}`;
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
                  window.open(`https://wa.me/${order.client.replace(/[^0-9]/g, '')}`);
                }}
              >
                <MessageCircle size={16} className="text-green-500" />
                <span className="sr-only">WhatsApp client</span>
              </Button>
            </p>
            <p className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              {order.deliveryType === 'pickup' 
                ? `${order.shop} (Самовывоз)` 
                : order.address}
              {order.addressNeedsClarification && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle size={16} className="ml-1 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Требуется уточнение адреса</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </p>
          </div>

          {order.shop && order.deliveryType !== 'pickup' && (
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="flex items-center text-gray-700">
                <Store size={16} className="mr-1" />
                Магазин: {order.shop}
              </p>
              {order.florist && order.status !== 'Оплачен' && (
                <p className="flex items-center text-gray-700 mt-1">
                  <User size={16} className="mr-1" />
                  Флорист: {order.florist}
                </p>
              )}
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Состав заказа:</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.description} 
                      className="w-12 h-12 object-cover rounded-md mr-2"
                    />
                    <span className="text-sm">{item.description}</span>
                  </div>
                  <span className="font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {order.clientComment && (
            <div className="bg-yellow-50 p-2 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center">
                <MessageCircle size={16} className="mr-1 text-yellow-500" />
                Комментарий клиента:
              </h4>
              <p className="text-sm">{order.clientComment}</p>
            </div>
          )}

          {order.clientReaction && (
            <div className={`p-2 rounded-lg ${
              order.clientReaction === 'positive' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h4 className="font-medium mb-1 flex items-center">
                {order.clientReaction === 'positive' ? (
                  <ThumbsUp size={16} className="mr-1 text-green-500" />
                ) : (
                  <ThumbsDown size={16} className="mr-1 text-red-500" />
                )}
                Реакция клиента:
              </h4>
              <p className="text-sm">{order.clientReactionComment}</p>
              {order.clientReaction === 'negative' && !order.reassemblyRequested && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRespondToClientReaction(order.number, 'reassemble');
                  }}
                  variant="primary"
                  size="sm"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Пересобрать букет
                </Button>
              )}
            </div>
          )}

          {order.deliveryProblem && (
            <div className="bg-red-50 p-2 rounded-lg">
              <h4 className="font-medium mb-1 flex items-center text-red-700">
                <AlertTriangle size={16} className="mr-1" />
                Проблема с доставкой:
              </h4>
              <p className="text-sm text-red-700">{order.deliveryProblem}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            {order.status === 'Оплачен' && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadPhoto(order.number);
                }}
              >
                <Camera size={16} className="mr-1" />
                Загрузить фото
              </Button>
            )}
            {nextStatus[order.status] && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(order.number, nextStatus[order.status]);
                }}
              >
                <ArrowRight size={16} className="mr-1" />
                {nextStatus[order.status]}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOrderClick = (orderNumber) => {
    // Remove all non-numeric characters and convert to string
    const cleanNumber = String(orderNumber).replace(/[^0-9]/g, '');
    console.log('Original order number:', orderNumber);
    console.log('Cleaned order number:', cleanNumber);
    navigate(`/orders/${cleanNumber}`);
  };

  const handleNewOrder = () => {
    navigate('/orders/create');
  };

  const handleUploadPhoto = (orderNumber) => {
    console.log(`Upload photo for order ${orderNumber}`);
  };

  const handleRespondToClientReaction = (orderNumber, reaction) => {
    console.log(`Respond to client reaction for order ${orderNumber}: ${reaction}`);
  };

  const handleStatusChange = (orderNumber, newStatus) => {
    console.log(`Change status of order ${orderNumber} to ${newStatus}`);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleDeliveryTypeFilterChange = (type) => {
    setDeliveryTypeFilter(type === deliveryTypeFilter ? 'all' : type);
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter === dateFilter ? 'all' : filter);
    if (filter !== 'custom') {
      setCustomDate(null);
    }
  };

  const mockOrders = [
    {
      number: '№1234',
      totalPrice: '15,000 ₸',
      date: '2024-11-18',
      time: '14:00',
      status: 'В работе',
      client: '+7 (777) 123-45-67',
      address: 'ул. Абая, 1',
      shop: 'Центральный',
      florist: 'Анна',
      deliveryType: 'delivery',
      items: [
        { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Весенний"', price: '10,000 ₸' },
        { image: '/placeholder.svg?height=48&width=48', description: 'Открытка', price: '500 ₸' },
      ],
      clientComment: 'Пожалуйста, добавьте больше розовых цветов',
    },
    {
      number: '№1235',
      totalPrice: '8,000 ₸',
      date: '2024-11-19',
      time: '16:30',
      status: 'Оплачен',
      client: '+7 (777) 987-65-43',
      address: 'пр. Достык, 5',
      shop: 'Южный',
      deliveryType: 'pickup',
      items: [
        { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Летний"', price: '8,000 ₸' },
      ],
    },
    {
      number: '№1236',
      totalPrice: '20,000 ₸',
      date: '2024-11-18',
      time: '10:00',
      status: 'Не оплачен',
      client: '+7 (777) 111-22-33',
      address: 'ул. Жандосова, 55',
      shop: 'Западный',
      deliveryType: 'delivery',
      addressNeedsClarification: true,
      items: [
        { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Роскошь"', price: '18,000 ₸' },
        { image: '/placeholder.svg?height=48&width=48', description: 'Ваза', price: '2,000 ₸' },
      ],
    },
    {
      number: '№1237',
      totalPrice: '12,000 ₸',
      date: '2024-11-20',
      time: '11:30',
      status: 'Готов к самовывозу',
      client: '+7 (777) 444-55-66',
      address: 'ул. Толе би, 59',
      shop: 'Восточный',
      deliveryType: 'pickup',
      items: [
        { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Нежность"', price: '12,000 ₸' },
      ],
    },
    {
      number: '№1238',
      totalPrice: '25,000 ₸',
      date: '2024-11-18',
      time: '13:45',
      status: 'В пути',
      client: '+7 (777) 777-88-99',
      address: 'мкр. Самал-2, д. 33',
      shop: 'Центральный',
      deliveryType: 'delivery',
      items: [
        { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Экзотика"', price: '22,000 ₸' },
        { image: '/placeholder.svg?height=48&width=48', description: 'Шоколад', price: '3,000 ₸' },
      ],
      deliveryProblem: 'Клиент не отвечает на звонки',
    },
  ];

  const filteredOrders = mockOrders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (deliveryTypeFilter !== 'all' && order.deliveryType !== deliveryTypeFilter) return false;
    
    const orderDate = new Date(order.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateFilter === 'today' && orderDate.toDateString() !== today.toDateString()) return false;
    if (dateFilter === 'tomorrow' && orderDate.toDateString() !== tomorrow.toDateString()) return false;
    if (dateFilter === 'custom' && customDate && orderDate.toDateString() !== customDate.toDateString()) return false;

    return true;
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
            <Plus size={20} className="mr-2" />
            Новый заказ
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium mb-2">Статус заказа</h3>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Фильтр по статусу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    {Object.keys(statusColors).map(status => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${statusColors[status]}`} />
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={dateFilter === 'custom' ? 'primary' : 'outline'}
                        size="sm"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {customDate ? format(customDate, 'PPP') : 'Выбрать дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={customDate}
                        onSelect={(date) => {
                          setCustomDate(date);
                          setDateFilter('custom');
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Поиск</h3>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по номеру, клиенту или адресу"
                  icon={<Search size={16} />}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders
            .filter(order => {
              const searchLower = searchQuery.toLowerCase();
              return !searchQuery ||
                order.number.toLowerCase().includes(searchLower) ||
                order.client.toLowerCase().includes(searchLower) ||
                (order.address && order.address.toLowerCase().includes(searchLower));
            })
            .map((order) => (
              <OrderCard
                key={order.number}
                order={order}
                onStatusChange={(newStatus) => console.log(`Status changed to ${newStatus}`)}
                onUploadPhoto={() => console.log('Upload photo clicked')}
                onRespondToClientReaction={(response) => console.log(`Client reaction response: ${response}`)}
                onClick={() => handleOrderClick(order.number)}
              />
            ))}
        </div>
      </div>
    </div>
  )
}