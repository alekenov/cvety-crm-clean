import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, MapPin, Calendar, ShoppingBag, Package, Gift, CreditCard } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import { Calendar as CalendarComponent } from '../../components/ui/Calendar/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/Popover/Popover';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Component() {
  const [screen, setScreen] = useState('catalog');
  const [cart, setCart] = useState([]);
  const [isSelfRecipient, setIsSelfRecipient] = useState(false);
  const [isPickup, setIsPickup] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [activeCategory, setActiveCategory] = useState('catalog');
  const [totalCost, setTotalCost] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [showCourierComment, setShowCourierComment] = useState(false);

  // Sample data (expanded catalog)
  const catalogItems = [
    { id: 1, name: '25 красных роз', price: 15000, type: 'catalog' },
    { id: 2, name: 'Букет "Нежность"', price: 12000, type: 'catalog' },
    { id: 3, name: 'Композиция "Лето"', price: 18000, type: 'catalog' },
    { id: 4, name: 'Букет "Весенний"', price: 13000, type: 'catalog' },
    { id: 5, name: 'Корзина "Изобилие"', price: 20000, type: 'catalog' },
    { id: 6, name: '101 роза', price: 35000, type: 'catalog' },
  ];

  const additionalItems = [
    { id: 201, name: 'Открытка', price: 500, type: 'additional' },
    { id: 202, name: 'Упаковка подарочная', price: 1000, type: 'additional' },
    { id: 203, name: 'Шары (набор)', price: 1500, type: 'additional' },
    { id: 204, name: 'Мягкая игрушка', price: 2000, type: 'additional' },
  ];

  const stores = [
    { id: 1, name: 'Магазин на Абая', address: 'ул. Абая, 150' },
    { id: 2, name: 'Магазин в ТРЦ "Мега"', address: 'пр. Сейфуллина, 500' },
    { id: 3, name: 'Магазин в ТД "Астана"', address: 'ул. Толе би, 73' },
  ];

  const timeSlots = [
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00'
  ];

  useEffect(() => {
    const newTotalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalCost(newTotalCost);
  }, [cart]);

  const handleAdd = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity === 0 ? null : {...item, quantity: newQuantity};
      }
      return item;
    }).filter(Boolean));
  };

  const CatalogScreen = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={activeCategory === 'catalog' ? 'primary' : 'outline'}
          onClick={() => setActiveCategory('catalog')}
          className="flex-1 md:flex-none min-w-[120px]"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Каталог
        </Button>
        <Button
          variant={activeCategory === 'additional' ? 'primary' : 'outline'}
          onClick={() => setActiveCategory('additional')}
          className="flex-1 md:flex-none min-w-[120px]"
        >
          <Gift className="mr-2 h-4 w-4" />
          Доп. товары
        </Button>
        <Button
          variant={activeCategory === 'custom' ? 'primary' : 'outline'}
          onClick={() => setActiveCategory('custom')}
          className="flex-1 md:flex-none min-w-[120px]"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Своя сумма
        </Button>
      </div>

      {activeCategory !== 'custom' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(activeCategory === 'catalog' ? catalogItems : additionalItems).map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-bold mb-2">Ввести сумму</h3>
          <div className="flex items-center">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Введите сумму"
              className="flex-grow p-2 border rounded-l-lg"
            />
            <button
              onClick={() => {
                if (customAmount) {
                  handleAdd({ id: Date.now(), name: 'Пользовательская сумма', price: Number(customAmount), type: 'custom' });
                  setCustomAmount('');
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg"
            >
              Добавить
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const ItemCard = ({ item }) => (
    <div className="bg-white p-3 rounded-lg flex flex-col justify-between">
      <div>
        <div className="font-medium text-sm">{item.name}</div>
        <div className="text-green-600 text-sm">{item.price} ₸</div>
      </div>
      {cart.find(i => i.id === item.id) ? (
        <div className="flex items-center justify-end space-x-2 mt-2">
          <button 
            onClick={() => updateQuantity(item.id, -1)}
            className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Minus size={16} />
          </button>
          <span className="font-bold text-sm">
            {cart.find(i => i.id === item.id)?.quantity || 0}
          </span>
          <button 
            onClick={() => updateQuantity(item.id, 1)}
            className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleAdd(item)}
          className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm mt-2 w-full"
        >
          Выбрать
        </button>
      )}
    </div>
  );

  const DeliveryScreen = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-bold mb-2">Способ получения</h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsPickup(false)}
              className={`flex-1 py-2 px-4 rounded-lg ${!isPickup ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            >
              Доставка
            </button>
            <button
              onClick={() => setIsPickup(true)}
              className={`flex-1 py-2 px-4 rounded-lg ${isPickup ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            >
              Самовывоз
            </button>
          </div>
          {isPickup ? (
            <div>
              <label htmlFor="store-select" className="block text-sm font-medium text-gray-700 mb-2">
                Выберите магазин
              </label>
              <div className="space-y-2">
                {stores.map((store) => (
                  <label key={store.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="store"
                      value={store.id}
                      checked={selectedStore === store.id.toString()}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-gray-500">{store.address}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="delivery-address" className="block text-sm font-medium text-gray-700 mb-1">
                Адрес доставки
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    id="delivery-address"
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Введите адрес доставки"
                    className="w-full p-2 pr-10 border rounded-md"
                  />
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => alert('Открыть карту для выбора адреса')}
                  >
                    <MapPin size={20} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Квартира"
                    className="w-1/2 p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Этаж"
                    className="w-1/2 p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowCourierComment(!showCourierComment)}
                  className="flex items-center gap-2 text-blue-600"
                >
                  <Plus size={20} />
                  <span>Добавить комментарий для курьера</span>
                </button>
                {showCourierComment && (
                  <textarea
                    placeholder="Введите комментарий для курьера..."
                    className="w-full p-3 border rounded-lg mt-2 min-h-[100px]"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-bold mb-4">{isPickup ? 'Время самовывоза' : 'Время доставки'}</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="deliveryTime"
                value="asap"
                className="w-4 h-4"
                defaultChecked
                onChange={() => {
                  setDeliveryDate(null);
                  setDeliveryTime('');
                }}
              />
              <span>Как можно скорее</span>
            </label>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deliveryTime"
                  value="scheduled"
                  className="w-4 h-4"
                  onChange={() => {
                    if (!deliveryDate) setDeliveryDate(new Date());
                    if (!deliveryTime) setDeliveryTime(timeSlots[0]);
                  }}
                />
                <span>Выбрать дату и время</span>
              </label>
              {deliveryDate && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : <span>Выберите дату</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CustomerDetailsScreen = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-bold mb-4">Заказчик</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Телефон</label>
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              className="w-full p-3 border rounded-lg text-lg"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelfRecipient}
              onChange={(e) => setIsSelfRecipient(e.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Я сам получатель</span>
          </label>
        </div>

        {!isSelfRecipient && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-bold mb-4">Получатель</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Имя</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Введите имя получателя"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Телефон</label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full p-3 border rounded-lg text-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-bold mb-4">Открытка</h3>
          <textarea
            placeholder="Введите текст для открытки..."
            className="w-full p-3 border rounded-lg min-h-[100px]"
          />
        </div>

        <div className="bg-white rounded-lg p-4">
          <button
            onClick={() => setShowComment(!showComment)}
            className="flex items-center gap-2 text-blue-600"
          >
            <Plus size={20} />
            <span>Добавить комментарий</span>
          </button>
          {showComment && (
            <textarea
              placeholder="Введите ваш комментарий..."
              className="w-full p-3 border rounded-lg mt-2 min-h-[100px]"
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {screen !== 'catalog' && (
              <button 
                onClick={() => setScreen(screen === 'delivery' ? 'catalog' : 'delivery')}
                className="mr-4 hover:text-gray-600"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-xl md:text-2xl font-bold">Новый заказ</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Side - Main Content */}
          <div className="flex-1">
            {screen === 'catalog' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    variant={activeCategory === 'catalog' ? 'primary' : 'outline'}
                    onClick={() => setActiveCategory('catalog')}
                    className="min-w-[140px]"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Каталог
                  </Button>
                  <Button
                    variant={activeCategory === 'additional' ? 'primary' : 'outline'}
                    onClick={() => setActiveCategory('additional')}
                    className="min-w-[140px]"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Доп. товары
                  </Button>
                  <Button
                    variant={activeCategory === 'custom' ? 'primary' : 'outline'}
                    onClick={() => setActiveCategory('custom')}
                    className="min-w-[140px]"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Своя сумма
                  </Button>
                </div>

                {activeCategory !== 'custom' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(activeCategory === 'catalog' ? catalogItems : additionalItems)
                      .map(item => <ItemCard key={item.id} item={item} />)}
                  </div>
                ) : (
                  <div className="max-w-md">
                    {/* ... содержимое для своей суммы ... */}
                  </div>
                )}
              </div>
            )}

            {screen === 'delivery' && <DeliveryScreen />}
            {screen === 'customer' && <CustomerDetailsScreen />}
          </div>

          {/* Right Side - Cart Summary */}
          <div className="hidden lg:block w-80">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Корзина</h2>
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price} ₸ × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Итого:</span>
                      <span className="text-xl font-bold text-green-600">{totalCost} ₸</span>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => setScreen(
                        screen === 'catalog' ? 'delivery' : 
                        screen === 'delivery' ? 'customer' : 
                        undefined
                      )}
                    >
                      {screen === 'catalog' && 'Далее: Доставка'}
                      {screen === 'delivery' && 'Далее: Данные получателя'}
                      {screen === 'customer' && 'Создать заказ'}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Корзина пуста</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Итого:</span>
            <span className="text-xl font-bold text-green-600">{totalCost} ₸</span>
          </div>
          {cart.length > 0 && (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setScreen(
                screen === 'catalog' ? 'delivery' : 
                screen === 'delivery' ? 'customer' : 
                undefined
              )}
            >
              {screen === 'catalog' && 'Далее: Доставка'}
              {screen === 'delivery' && 'Далее: Данные получателя'}
              {screen === 'customer' && 'Создать заказ'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}