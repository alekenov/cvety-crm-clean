import React, { useState, useEffect } from 'react';
import { Plus, Search, X, MessageCircle, FileText, Phone, Calendar, Clock, Send, MapPin, Home, ArrowLeft, ArrowRight, User, CreditCard, Truck, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showAddCustomItem, setShowAddCustomItem] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

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

  const timeSlots = [
    { label: '09:00 - 12:00', value: '09:00' },
    { label: '12:00 - 15:00', value: '12:00' },
    { label: '15:00 - 18:00', value: '15:00' },
    { label: '18:00 - 21:00', value: '18:00' },
  ];

  const stores = [
    { id: 1, name: "Магазин на Абая" },
    { id: 2, name: "Магазин на Достык" },
  ];

  const [catalogProducts, setCatalogProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      setCatalogProducts(products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price || 0
      })));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleAddProduct = (product) => {
    setOrderItems([...orderItems, { ...product, type: 'product' }]);
    setShowProductSearch(false);
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    const name = e.target.itemName.value;
    const price = Number(e.target.itemPrice.value);
    
    setOrderItems([...orderItems, { 
      id: Date.now(),
      name,
      price,
      type: 'custom'
    }]);
    
    setShowAddCustomItem(false);
    e.target.reset();
  };

  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const deliveryCost = orderForm.deliveryMethod === 'delivery' ? 1500 : 0;
  const total = subtotal + deliveryCost;

  const handleCreateOrder = async () => {
    try {
      console.log('Начало создания заказа');

      // Проверяем обязательные поля
      if (!orderForm.recipient.phone && !orderForm.customer.phone) {
        throw new Error('Необходимо указать телефон получателя или заказчика');
      }

      if (orderItems.length === 0) {
        throw new Error('Добавьте хотя бы один товар в заказ');
      }

      // Формируем адрес
      const address = orderForm.deliveryMethod === 'delivery'
        ? `${orderForm.recipient.address.street || ''} ${
            orderForm.recipient.address.apartment ? `кв. ${orderForm.recipient.address.apartment}` : ''
          } ${
            orderForm.recipient.address.floor ? `этаж ${orderForm.recipient.address.floor}` : ''
          }`.trim() || 'Адрес не указан'
        : 'Самовывоз';

      // Формируем данные заказа строго по структуре таблицы
      const orderData = {
        number: Date.now().toString(),
        status: 'Не оплачен',
        client_phone: orderForm.recipient.phone || orderForm.customer.phone,
        address: address,
        delivery_date: new Date().toISOString().split('T')[0],
        delivery_time: orderForm.deliveryMethod === 'delivery' ? orderForm.deliveryTime : orderForm.pickupTime,
        client_comment: orderForm.cardMessage || '',
        total_price: total
      };

      console.log('Данные заказа для отправки:', orderData);

      // Создаем заказ
      const { data: orderResponse, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (orderError) {
        console.error('Ошибка при создании заказа:', orderError);
        throw new Error(`Ошибка при создании заказа: ${orderError.message}`);
      }

      console.log('Ответ после создания заказа:', orderResponse);

      if (!orderResponse || !orderResponse[0]) {
        throw new Error('Не удалось получить данные созданного заказа');
      }

      const orderId = orderResponse[0].id;

      // Создаем записи товаров заказа
      const orderItemsData = orderItems.map(item => ({
        order_id: orderId,
        product_id: item.type === 'product' ? item.id : null,
        price: parseFloat(item.price)
      }));

      console.log('Данные товаров для отправки:', orderItemsData);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) {
        console.error('Ошибка при добавлении товаров:', itemsError);
        // Удаляем созданный заказ, если не удалось добавить товары
        await supabase.from('orders').delete().eq('id', orderId);
        throw new Error(`Ошибка при добавлении товаров: ${itemsError.message}`);
      }

      console.log('Заказ успешно создан');
      
      // Переходим на страницу заказов с флагом обновления
      navigate('/orders', { 
        replace: true, 
        state: { 
          refresh: true,
          newOrderId: orderId
        }
      });

    } catch (error) {
      console.error('Подробная ошибка:', error);
      alert(error.message);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Новый заказ</h1>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Товары и услуги</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <button 
            onClick={() => setShowProductSearch(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center justify-center"
          >
            <Search size={16} className="mr-2" />
            Каталог
          </button>
          <button 
            onClick={() => setShowAddCustomItem(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Добавить
          </button>
        </div>

        <div className="space-y-2">
          {orderItems.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-green-600">{item.price.toLocaleString()} ₸</div>
              </div>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Сумма заказа:</span>
            <span>{subtotal.toLocaleString()} ₸</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Доставка:</span>
            <span>{deliveryCost.toLocaleString()} ₸</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Итого:</span>
            <span className="text-green-600">{total.toLocaleString()} ₸</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Способ получения</label>
          <div className="flex flex-col sm:flex-row justify-between p-1 bg-gray-100 rounded-md">
            <button
              onClick={() => setOrderForm({...orderForm, deliveryMethod: 'delivery'})}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                orderForm.deliveryMethod === 'delivery' ? 'bg-blue-500 text-white' : 'text-gray-700'
              } mb-2 sm:mb-0`}
            >
              <Truck size={16} className="mr-2" />
              Доставка
            </button>
            <button
              onClick={() => setOrderForm({...orderForm, deliveryMethod: 'pickup'})}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                orderForm.deliveryMethod === 'pickup' ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              <Store size={16} className="mr-2" />
              Самовывоз
            </button>
          </div>
        </div>

        {orderForm.deliveryMethod === 'pickup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Выберите магазин</label>
              <select
                value={orderForm.pickupStore}
                onChange={(e) => setOrderForm({...orderForm, pickupStore: e.target.value})}
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите магазин</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время самовывоза</label>
              <div className="flex flex-col sm:flex-row justify-between p-1 bg-gray-100 rounded-md">
                <button
                  onClick={() => setOrderForm({...orderForm, pickupType: 'asap'})}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    orderForm.pickupType === 'asap' ? 'bg-blue-500 text-white' : 'text-gray-700'
                  } mb-2 sm:mb-0`}
                >
                  Как можно скорее
                </button>
                <button
                  onClick={() => setOrderForm({...orderForm, pickupType: 'scheduled'})}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    orderForm.pickupType === 'scheduled' ? 'bg-blue-500 text-white' : 'text-gray-700'
                  }`}
                >
                  Выбрать время
                </button>
              </div>
              {orderForm.pickupType === 'scheduled' && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={orderForm.pickupDate}
                    onChange={e => setOrderForm({...orderForm, pickupDate: e.target.value})}
                    className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <select
                    value={orderForm.pickupTime}
                    onChange={e => setOrderForm({...orderForm, pickupTime: e.target.value})}
                    className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </>
        )}

        {orderForm.deliveryMethod === 'delivery' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя получателя</label>
              <input
                type="text"
                value={orderForm.recipient.name}
                onChange={e => setOrderForm({...orderForm, recipient: {...orderForm.recipient, name: e.target.value}})}
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите имя получателя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон получателя</label>
              <input
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
                <input
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
                <button
                  type="button"
                  onClick={() => alert('Открыть карту для выбора адреса')}
                  className="p-3 bg-blue-500 text-white rounded-r-md border border-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <MapPin size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <input
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
                <input
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

      <button 
        className="w-full bg-green-500 text-white p-4 rounded-md text-lg font-medium flex items-center justify-center"
        onClick={() => setCurrentStep(2)}
      >
        Далее
        <ArrowRight size={20} className="ml-2" />
      </button>
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
              <button
                onClick={() => setOrderForm({...orderForm, deliveryType: 'asap'})}
                className={`flex-1 py-2 px-4 rounded-md ${
                  orderForm.deliveryType === 'asap' ? 'bg-blue-500 text-white' : 'text-gray-700'
                } mb-2 sm:mb-0`}
              >
                Как можно скорее
              </button>
              <button
                onClick={() => setOrderForm({...orderForm, deliveryType: 'scheduled'})}
                className={`flex-1 py-2 px-4 rounded-md ${
                  orderForm.deliveryType === 'scheduled' ? 'bg-blue-500 text-white' : 'text-gray-700'
                }`}
              >
                Выбрать время
              </button>
            </div>

            {orderForm.deliveryType === 'scheduled' && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="date"
                  value={orderForm.deliveryDate}
                  onChange={e => setOrderForm({...orderForm, deliveryDate: e.target.value})}
                  className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                <select
                  value={orderForm.deliveryTime}
                  onChange={e => setOrderForm({...orderForm, deliveryTime: e.target.value})}
                  className="p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
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

        <button
          onClick={() => setShowComment(!showComment)}
          className="text-blue-500 flex items-center"
        >
          <FileText size={16} className="mr-1" />
          {showComment ? 'Скрыть комментарий' : 'Добавить комментарий'}
        </button>

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
            <input
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
              <input
                type="radio"
                checked={orderForm.paymentMethod === 'kaspi'}
                onChange={() => setOrderForm({...orderForm, paymentMethod: 'kaspi'})}
                className="form-radio text-blue-500"
              />
              <span>Каспи</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
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
        <button 
          className="w-full sm:w-1/2 bg-gray-200 text-gray-800 p-4 rounded-md text-lg font-medium flex items-center justify-center"
          onClick={() => setCurrentStep(1)}
        >
          <ArrowLeft size={20} className="mr-2" />
          Назад
        </button>
        <button 
          className="w-full sm:w-1/2 bg-green-500 text-white p-4 rounded-md text-lg font-medium flex items-center justify-center"
          onClick={handleCreateOrder}
        >
          <Send size={20} className="mr-2" />
          Создать заказ
        </button>
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
              <button onClick={() => setShowProductSearch(false)}>
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Поиск товара..."
              className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {catalogProducts.map(product => (
                <button
                  key={product.id}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-md transition duration-150"
                  onClick={() => handleAddProduct(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-green-600">{product.price.toLocaleString()} ₸</div>
                </button>
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
              <button onClick={() => setShowAddCustomItem(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddCustomItem} className="space-y-4">
              <input
                name="itemName"
                type="text"
                placeholder="Название"
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                name="itemPrice"
                type="number"
                placeholder="Цена"
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-green-500 text-white p-3 rounded-md font-medium"
              >
                Добавить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderPage;