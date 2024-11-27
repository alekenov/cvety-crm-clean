import React, { 
  useState, 
  useEffect, 
  useCallback,
  useRef
} from 'react';
import { logger } from '../../services/logging/loggingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Search, X, MessageCircle, FileText, Phone, Calendar, Clock, Send, MapPin, Home, ArrowLeft, ArrowRight, User, CreditCard, Truck, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ordersService } from '../../services/supabaseClient';

// Mock catalog products
const mockCatalogProducts = [
  {
    id: 1,
    name: 'Букет "Весенний"',
    description: '15 тюльпанов, зелень, упаковка',
    price: 15000,
    category: 'Букеты',
    image: '/placeholder.jpg',
    isActive: true
  },
  {
    id: 2,
    name: 'Розы красные',
    description: '25 роз, премиум упаковка',
    price: 25000,
    category: 'Розы',
    image: '/placeholder.jpg',
    isActive: true
  },
  {
    id: 3,
    name: 'Букет "Нежность"',
    description: 'Пионы, розы, зелень',
    price: 20000,
    category: 'Букеты',
    image: '/placeholder.jpg',
    isActive: true
  },
  {
    id: 4,
    name: 'Упаковка стандарт',
    description: 'Крафт-бумага, лента',
    price: 2000,
    category: 'Упаковка',
    image: '/placeholder.jpg',
    isActive: true
  },
  {
    id: 5,
    name: 'Упаковка премиум',
    description: 'Дизайнерская бумага, атласная лента',
    price: 5000,
    category: 'Упаковка',
    image: '/placeholder.jpg',
    isActive: true
  }
];

// Список магазинов для самовывоза
const pickupStores = [
  { 
    id: 'store1', 
    name: 'Цветочный Рай (ул. Абая, 100)', 
    address: 'ул. Абая, 100',
    workingHours: 'Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-19:00'
  },
  { 
    id: 'store2', 
    name: 'Бутик Цветов (пр. Назарбаева, 50)', 
    address: 'пр. Назарбаева, 50',
    workingHours: 'Пн-Вс: 9:00-21:00'
  },
  { 
    id: 'store3', 
    name: 'Флористический Салон (ул. Гагарина, 25)', 
    address: 'ул. Гагарина, 25',
    workingHours: 'Пн-Пт: 11:00-19:00, Сб: 10:00-18:00, Вс: Выходной'
  }
];

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showAddCustomItem, setShowAddCustomItem] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [catalogProducts] = useState(mockCatalogProducts);
  const [productsLoading] = useState(false);

  const [orderForm, setOrderForm] = useState({
    deliveryMethod: 'delivery',
    pickupStore: '',
    pickupType: 'asap',
    pickupDate: '',
    pickupTime: '12:00',
    recipient: {
      name: '',
      phone: '',
      address: {
        street: '',
        building: '',
        apartment: '',
        floor: '',
      },
    },
    customer: {
      phone: '',
    },
    cardMessage: '',
    internalComment: '',
    deliveryDate: '',
    deliveryTime: '12:00',
    deliveryType: 'asap',
    paymentMethod: 'kaspi',
  });

  useEffect(() => {
    logger.log('CreateOrderPage', 'Страница создания заказа загружена');
    logger.setCurrentUrl(window.location.href);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Валидация данных
      if (!validateForm()) {
        return;
      }

      // Подготовка данных для отправки
      const preparedOrderData = prepareOrderData();

      // Создание заказа через Supabase
      const createdOrder = await ordersService.createOrder(preparedOrderData);

      // Логирование и уведомление
      logger.log('CreateOrderPage', `Создан новый заказ ${createdOrder.number}`);
      toast.success(`Заказ ${createdOrder.number} успешно создан`);

      // Очистка формы и переход
      setOrderItems([]);
      setOrderForm({
        deliveryMethod: 'delivery',
        pickupStore: '',
        pickupType: 'asap',
        pickupDate: '',
        pickupTime: '12:00',
        recipient: {
          name: '',
          phone: '',
          address: {
            street: '',
            building: '',
            apartment: '',
            floor: '',
          },
        },
        customer: {
          phone: '',
        },
        cardMessage: '',
        internalComment: '',
        deliveryDate: '',
        deliveryTime: '12:00',
        deliveryType: 'asap',
        paymentMethod: 'kaspi',
      });
      navigate(`/orders/${createdOrder.number}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Не удалось создать заказ');
      logger.error('CreateOrderPage', 'Ошибка при создании заказа', null, error);
    }
  };

  const prepareOrderData = () => {
    const { deliveryMethod, recipient, customer, ...rest } = orderForm;
    
    return {
      id: Date.now(), // Generate a unique order ID
      number: `ORDER-${Date.now()}`, // Generate a unique order number
      status: 'new',
      client_phone: customer.phone || recipient.phone,
      address: deliveryMethod === 'delivery' ? formatAddress(recipient.address) : null,
      delivery_time: formatDeliveryTime(),
      total_price: calculateTotalPrice() + (deliveryMethod === 'delivery' ? 1500 : 0),
      items: orderItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price
      })),
      client_comment: orderForm.cardMessage,
      shop: deliveryMethod === 'pickup' ? orderForm.pickupStore : null,
      florist: null, // You might want to add logic to select a florist
      delivery_address: deliveryMethod === 'delivery' ? formatAddress(recipient.address) : null,
      delivery_date: deliveryMethod === 'delivery' ? orderForm.deliveryDate : orderForm.pickupDate,
      store_id: deliveryMethod === 'pickup' ? orderForm.pickupStore : null,
      florist_name: null, // You might want to add logic to select a florist name
      created_at: new Date().toISOString(),
    };
  };

  const formatAddress = (address) => {
    const parts = [
      address.street,
      address.building,
      address.apartment && `кв. ${address.apartment}`,
      address.floor && `этаж ${address.floor}`
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const formatDeliveryTime = () => {
    const date = orderForm.deliveryMethod === 'delivery' ? 
      orderForm.deliveryDate : 
      orderForm.pickupDate;
    
    const time = orderForm.deliveryMethod === 'delivery' ? 
      orderForm.deliveryTime : 
      orderForm.pickupTime;

    return `${date}T${time}:00`;
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const handleAddProduct = useCallback((product) => {
    try {
      logger.log('CreateOrderPage', 'Добавление продукта в заказ', { product });
      setOrderItems(prev => [...prev, { ...product, type: 'product' }]);
      setShowProductSearch(false);
    } catch (error) {
      logger.error('CreateOrderPage', 'Ошибка при добавлении продукта', { product }, error);
    }
  }, []);

  const handleAddCustomItem = useCallback((e) => {
    try {
      logger.log('CreateOrderPage', 'Добавление пользовательского товара в заказ');
      e.preventDefault();
      const name = e.target.itemName.value;
      const price = Number(e.target.itemPrice.value);
      
      setOrderItems(prev => [...prev, { 
        id: Date.now(),
        name,
        price,
        type: 'custom'
      }]);
      
      setShowAddCustomItem(false);
      e.target.reset();
    } catch (error) {
      logger.error('CreateOrderPage', 'Ошибка при добавлении пользовательского товара', null, error);
    }
  }, []);

  const handleRemoveItem = useCallback((itemId) => {
    try {
      logger.log('CreateOrderPage', 'Удаление товара из заказа', { itemId });
      setOrderItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      logger.error('CreateOrderPage', 'Ошибка при удалении товара', { itemId }, error);
    }
  }, []);

  const validateForm = () => {
    const { deliveryMethod, recipient, customer, pickupStore } = orderForm;
    const validationErrors = [];

    console.log('Validate Form Data:', { 
      deliveryMethod, 
      recipient: JSON.stringify(recipient, null, 2), 
      customer: JSON.stringify(customer, null, 2),
      pickupStore 
    });

    // Проверка телефона
    if (!customer.phone && !recipient.phone) {
      validationErrors.push('Не указан телефонный номер');
      logger.warn('CreateOrderPage', 'Ошибка валидации', { 
        details: 'Отсутствует телефонный номер',
        customerPhone: customer.phone,
        recipientPhone: recipient.phone
      });
    }

    // Проверка способа доставки
    if (deliveryMethod === 'delivery') {
      // Проверка адреса при доставке
      const addressErrors = [];
      
      // Более гибкая проверка адреса
      const { address } = recipient;
      if (!address || Object.keys(address).length === 0) {
        addressErrors.push('полный адрес');
        logger.warn('CreateOrderPage', 'Ошибка адреса', { 
          details: 'Адрес не заполнен',
          address: address
        });
      } else {
        // Проверяем каждое поле более детально
        if (!address.street || address.street.trim() === '') {
          addressErrors.push('улица');
          logger.warn('CreateOrderPage', 'Ошибка адреса', { 
            details: 'Не указана улица',
            street: address.street 
          });
        }
        // Смягчаем проверку номера дома
        const hasBuildingIdentifier = 
          (address.building && address.building.trim() !== '') ||
          (address.apartment && address.apartment.trim() !== '') ||
          (address.entrance && address.entrance.trim() !== '');

        if (!hasBuildingIdentifier) {
          addressErrors.push('идентификатор здания');
          logger.warn('CreateOrderPage', 'Ошибка адреса', { 
            details: 'Не указан номер дома, подъезд или квартира',
            building: address.building,
            apartment: address.apartment,
            entrance: address.entrance
          });
        }
      }

      if (addressErrors.length > 0) {
        validationErrors.push(`Не полный адрес доставки: отсутствуют ${addressErrors.join(', ')}`);
      }
    } else if (deliveryMethod === 'pickup') {
      // Проверка точки самовывоза
      if (!pickupStore) {
        validationErrors.push('Не выбрана точка самовывоза');
        logger.warn('CreateOrderPage', 'Ошибка самовывоза', { 
          details: 'Точка самовывоза не выбрана',
          pickupStore 
        });
      }
    }

    // Проверка товаров
    if (orderItems.length === 0) {
      validationErrors.push('Корзина пуста');
      logger.warn('CreateOrderPage', 'Ошибка корзины', { 
        details: 'В заказе отсутствуют товары',
        orderItemsCount: orderItems.length 
      });
    }

    // Если есть ошибки - показываем их
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join('. ');
      toast.error(errorMessage);
      return false;
    }

    return true;
  };

  const timeSlots = [
    { label: '09:00 - 12:00', value: '09:00' },
    { label: '12:00 - 15:00', value: '12:00' },
    { label: '15:00 - 18:00', value: '15:00' },
    { label: '18:00 - 21:00', value: '18:00' },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Новый заказ</h1>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Товары и услуги</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={() => setShowProductSearch(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center justify-center"
          >
            <Search size={16} className="mr-2" />
            Каталог
          </Button>
          <Button 
            onClick={() => setShowAddCustomItem(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Добавить
          </Button>
        </div>

        <div className="space-y-2">
          {orderItems.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-green-600">{item.price.toLocaleString()} ₸</div>
              </div>
              <Button 
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500"
              >
                <X size={20} />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Сумма заказа:</span>
            <span>{calculateTotalPrice().toLocaleString()} ₸</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Доставка:</span>
            <span>{orderForm.deliveryMethod === 'delivery' ? 1500 : 0} ₸</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Итого:</span>
            <span className="text-green-600">{(calculateTotalPrice() + (orderForm.deliveryMethod === 'delivery' ? 1500 : 0)).toLocaleString()} ₸</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Способ получения</label>
          <div className="flex flex-col sm:flex-row justify-between p-1 bg-gray-100 rounded-md">
            <Button
              onClick={() => setOrderForm({...orderForm, deliveryMethod: 'delivery'})}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                orderForm.deliveryMethod === 'delivery' ? 'bg-blue-500 text-white' : 'text-gray-700'
              } mb-2 sm:mb-0`}
            >
              <Truck size={16} className="mr-2" />
              Доставка
            </Button>
            <Button
              onClick={() => setOrderForm({...orderForm, deliveryMethod: 'pickup'})}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                orderForm.deliveryMethod === 'pickup' ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              <Store size={16} className="mr-2" />
              Самовывоз
            </Button>
          </div>
        </div>

        {orderForm.deliveryMethod === 'pickup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Выберите магазин</label>
              <Select
                value={orderForm.pickupStore}
                onChange={(e) => setOrderForm({...orderForm, pickupStore: e.target.value})}
              >
                <SelectTrigger className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  Выберите магазин
                </SelectTrigger>
                <SelectContent>
                  {pickupStores.map(store => (
                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время самовывоза</label>
              <div className="flex flex-col sm:flex-row justify-between p-1 bg-gray-100 rounded-md">
                <Button
                  onClick={() => setOrderForm({...orderForm, pickupType: 'asap'})}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    orderForm.pickupType === 'asap' ? 'bg-blue-500 text-white' : 'text-gray-700'
                  } mb-2 sm:mb-0`}
                >
                  Как можно скорее
                </Button>
                <Button
                  onClick={() => setOrderForm({...orderForm, pickupType: 'scheduled'})}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    orderForm.pickupType === 'scheduled' ? 'bg-blue-500 text-white' : 'text-gray-700'
                  }`}
                >
                  Выбрать время
                </Button>
              </div>
              {orderForm.pickupType === 'scheduled' && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={orderForm.pickupDate}
                    onChange={e => setOrderForm({...orderForm, pickupDate: e.target.value})}
                    className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Select
                    value={orderForm.pickupTime}
                    onChange={e => setOrderForm({...orderForm, pickupTime: e.target.value})}
                  >
                    <SelectTrigger className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      {orderForm.pickupTime}
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(slot => (
                        <SelectItem key={slot.value} value={slot.value}>{slot.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </>
        )}

        {orderForm.deliveryMethod === 'delivery' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя получателя</label>
              <Input
                type="text"
                value={orderForm.recipient.name}
                onChange={e => setOrderForm({...orderForm, recipient: {...orderForm.recipient, name: e.target.value}})}
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите имя получателя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон получателя</label>
              <Input
                type="tel"
                value={orderForm.recipient.phone}
                onChange={e => setOrderForm({...orderForm, recipient: {...orderForm.recipient, phone: e.target.value}})}
                placeholder="+7 (___) ___-__-__"
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки</label>
              <div className="flex items-center">
                <Input
                  type="text"
                  value={orderForm.recipient.address.street}
                  onChange={e => setOrderForm({
                    ...orderForm,
                    recipient: {
                      ...orderForm.recipient,
                      address: { ...orderForm.recipient.address, street: e.target.value }
                    }
                  })}
                  placeholder="Улица и номер дома"
                  className="flex-1 p-3 bg-gray-50 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  type="button"
                  onClick={() => alert('Открыть карту для выбора адреса')}
                  className="p-3 bg-blue-500 text-white rounded-r-md border border-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <MapPin size={20} />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <Input
                  type="text"
                  value={orderForm.recipient.address.apartment}
                  onChange={e => setOrderForm({
                    ...orderForm,
                    recipient: {
                      ...orderForm.recipient,
                      address: { ...orderForm.recipient.address, apartment: e.target.value }
                    }
                  })}
                  placeholder="Квартира/Офис"
                  className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <Input
                  type="text"
                  value={orderForm.recipient.address.floor}
                  onChange={e => setOrderForm({
                    ...orderForm,
                    recipient: {
                      ...orderForm.recipient,
                      address: { ...orderForm.recipient.address, floor: e.target.value }
                    }
                  })}
                  placeholder="Этаж"
                  className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <Button 
        className="w-full bg-green-500 text-white p-4 rounded-md text-lg font-medium flex items-center justify-center"
        onClick={() => setCurrentStep(2)}
      >
        Далее
        <ArrowRight size={20} className="ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Детали заказа</h1>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm space-y-6">
        {orderForm.deliveryMethod === 'delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Время доставки</label>
            <div className="flex flex-col sm:flex-row justify-between p-1 bg-gray-100 rounded-md">
              <Button
                onClick={() => setOrderForm({...orderForm, deliveryType: 'asap'})}
                className={`flex-1 py-2 px-4 rounded-md ${
                  orderForm.deliveryType === 'asap' ? 'bg-blue-500 text-white' : 'text-gray-700'
                } mb-2 sm:mb-0`}
              >
                Как можно скорее
              </Button>
              <Button
                onClick={() => setOrderForm({...orderForm, deliveryType: 'scheduled'})}
                className={`flex-1 py-2 px-4 rounded-md ${
                  orderForm.deliveryType === 'scheduled' ? 'bg-blue-500 text-white' : 'text-gray-700'
                }`}
              >
                Выбрать время
              </Button>
            </div>

            {orderForm.deliveryType === 'scheduled' && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={orderForm.deliveryDate}
                  onChange={e => setOrderForm({...orderForm, deliveryDate: e.target.value})}
                  className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Select
                  value={orderForm.deliveryTime}
                  onChange={e => setOrderForm({...orderForm, deliveryTime: e.target.value})}
                >
                  <SelectTrigger className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    {orderForm.deliveryTime}
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot.value} value={slot.value}>{slot.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Текст открытки</label>
          <textarea
            value={orderForm.cardMessage}
            onChange={e => setOrderForm({...orderForm, cardMessage: e.target.value})}
            placeholder="Введите текст для открытки..."
            className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-24"
          />
        </div>

        <Button
          onClick={() => setShowComment(!showComment)}
          className="text-blue-500 flex items-center"
        >
          <FileText size={16} className="mr-1" />
          {showComment ? 'Скрыть комментарий' : 'Добавить комментарий'}
        </Button>

        {showComment && (
          <div>
            <textarea
              value={orderForm.internalComment}
              onChange={e => setOrderForm({...orderForm, internalComment: e.target.value})}
              placeholder="Внутренний комментарий..."
              className="w-full p-3 bg-yellow-50 rounded-md border border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 h-24"
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Данные заказчика</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон заказчика</label>
            <Input
              type="tel"
              value={orderForm.customer.phone}
              onChange={e => setOrderForm({...orderForm, customer: {...orderForm.customer, phone: e.target.value}})}
              className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Способ оплаты</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <Input
                type="radio"
                checked={orderForm.paymentMethod === 'kaspi'}
                onChange={() => setOrderForm({...orderForm, paymentMethod: 'kaspi'})}
                className="form-radio text-blue-500"
              />
              <span>Каспи</span>
            </label>
            <label className="flex items-center space-x-3">
              <Input
                type="radio"
                checked={orderForm.paymentMethod === 'card'}
                onChange={() => setOrderForm({...orderForm, paymentMethod: 'card'})}
                className="form-radio text-blue-500"
              />
              <span>Картой</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <Button 
          className="w-full sm:w-1/2 bg-gray-200 text-gray-800 p-4 rounded-md text-lg font-medium flex items-center justify-center"
          onClick={() => setCurrentStep(1)}
        >
          <ArrowLeft size={20} className="mr-2" />
          Назад
        </Button>
        <Button 
          className="w-full sm:w-1/2 bg-green-500 text-white p-4 rounded-md text-lg font-medium flex items-center justify-center"
          onClick={handleSubmit}
        >
          <Send size={20} className="mr-2" />
          Создать заказ
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </div>

      {/* Модальные окна */}
      {showProductSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Выбор товара</h3>
              <Button onClick={() => setShowProductSearch(false)}>
                <X size={24} />
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Поиск товара..."
              className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {catalogProducts.map(product => (
                <Button
                  key={product.id}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-md transition duration-150"
                  onClick={() => handleAddProduct(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-green-600">{product.price.toLocaleString()} ₸</div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddCustomItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Добавить товар/услугу</h3>
              <Button onClick={() => setShowAddCustomItem(false)}>
                <X size={24} />
              </Button>
            </div>
            <form onSubmit={handleAddCustomItem} className="space-y-4">
              <Input
                name="itemName"
                type="text"
                placeholder="Название"
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <Input
                name="itemPrice"
                type="number"
                placeholder="Цена"
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-green-500 text-white p-3 rounded-md font-medium"
              >
                Добавить
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderPage;