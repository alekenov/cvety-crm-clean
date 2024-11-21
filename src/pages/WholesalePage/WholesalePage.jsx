import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, AlertCircle, Flag, Building2, Star, Filter as FilterIcon, Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function WholesalePurchase() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flowers');
  const [cart, setCart] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = {
    flowers: [
      { 
        id: 1, 
        name: "Роза Red Naomi 50см", 
        regularPrice: 450,
        wholesalePrice: 400, // Цена от 50 тыс
        packSize: 25,
        minOrder: 1,
        available: 50,
        image: "/api/placeholder/100/100",
        country: "Кения",
        supplier: "Freedom Flowers",
        supplierRating: 4.8
      },
      { 
        id: 2, 
        name: "Роза Pink Floyd 60см", 
        regularPrice: 480,
        wholesalePrice: 420,
        packSize: 25,
        minOrder: 1,
        available: 30,
        image: "/api/placeholder/100/100",
        country: "Эквадор",
        supplier: "Plantador",
        supplierRating: 4.9
      }
    ],
    supplies: [
      {
        id: 101,
        name: "Лента атласная белая 2см",
        regularPrice: 150,
        wholesalePrice: 120,
        packSize: 1,
        minOrder: 10,
        available: 100,
        image: "/api/placeholder/100/100",
        country: "Китай",
        supplier: "Decorative Plus",
        supplierRating: 4.7
      },
      {
        id: 102,
        name: "Флористическая пена",
        regularPrice: 450,
        wholesalePrice: 380,
        packSize: 1,
        minOrder: 5,
        available: 200,
        image: "/api/placeholder/100/100",
        country: "Южная Корея",
        supplier: "Flora Supply",
        supplierRating: 4.9
      }
    ]
  };

  const currentItems = categories[activeTab] || [];

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = [...categories.flowers, ...categories.supplies].find(i => i.id === Number(itemId));
      const isWholesale = total >= 50000;
      const price = isWholesale ? item.wholesalePrice : item.regularPrice;
      return total + (price * quantity * item.packSize);
    }, 0);
  };

  const total = calculateTotal();
  const isWholesale = total >= 50000;

  // Вспомогательная функция для отображения флага страны
  const getCountryFlag = (country) => {
    const flags = {
      'Кения': '🇰🇪',
      'Эквадор': '🇪🇨',
      'Китай': '🇨🇳',
      'Южная Корея': '🇰🇷'
    };
    return flags[country] || '🌍';
  };

  const handleAddToCart = (item) => {
    setCart({ ...cart, [item.id]: item.minOrder });
  };

  const handleRemoveFromCart = (itemId) => {
    const newCart = { ...cart };
    delete newCart[itemId];
    setCart(newCart);
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    setCart({ ...cart, [itemId]: quantity });
  };

  return (
    <div className="container mx-auto px-4 bg-gray-100 min-h-screen pb-24">
      {/* Шапка */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex justify-between items-center lg:w-auto">
            <h1 className="text-xl lg:text-2xl font-bold">Закупка товаров</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden"
            >
              <Search size={20} />
            </Button>
          </div>

          {/* Поиск для десктопа */}
          <div className="hidden lg:block w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск товаров"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border"
              />
            </div>
          </div>

          {/* Мобильный поиск */}
          {showSearch && (
            <div className="lg:hidden mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Поиск товаров"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border"
                />
              </div>
            </div>
          )}

          {/* Табы категорий */}
          <div className="flex rounded-lg overflow-hidden bg-gray-100 lg:w-1/4">
            <Button
              variant={activeTab === 'flowers' ? 'primary' : 'ghost'}
              className="flex-1"
              onClick={() => setActiveTab('flowers')}
            >
              Цветы
            </Button>
            <Button
              variant={activeTab === 'supplies' ? 'primary' : 'ghost'}
              className="flex-1"
              onClick={() => setActiveTab('supplies')}
            >
              Фурнитура
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:gap-6">
        {/* Основной контент */}
        <div className="lg:flex-grow">
          {total > 0 && !isWholesale && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-700">
                <AlertCircle size={20} className="mr-2" />
                <div>
                  <p className="font-medium">До оптовой цены осталось: {(50000 - total).toLocaleString()} ₸</p>
                  <p className="text-sm">От 50 000 ₸ действуют оптовые цены</p>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {currentItems
              .filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(item => {
                const quantity = cart[item.id] || 0;
                const currentPrice = isWholesale ? item.wholesalePrice : item.regularPrice;
                const total = quantity * currentPrice * (item.packSize || 1);

                return (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row mb-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full md:w-24 h-32 md:h-24 rounded-lg object-cover mb-3 md:mb-0"
                      />
                      <div className="md:ml-3 flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        
                        {/* Origin and Supplier */}
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="mr-2">
                            {getCountryFlag(item.country)} {item.country}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 size={14} className="mr-1" />
                          <span>{item.supplier}</span>
                          <span className="ml-1 text-yellow-500">★</span>
                          <span className="ml-1">{item.supplierRating}</span>
                        </div>

                        {/* Pricing */}
                        <div className="mt-1">
                          {isWholesale ? (
                            <div className="text-green-600">
                              <span className="line-through text-gray-400 text-sm mr-2">
                                {item.regularPrice} ₸
                              </span>
                              <span className="font-bold">{item.wholesalePrice} ₸/шт</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-bold text-green-600">
                                {item.regularPrice} ₸/шт
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                (от 50 тыс: {item.wholesalePrice} ₸)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="bg-gray-50 p-2 rounded-lg mb-3 text-sm">
                      <span>
                        В наличии: {item.available} {item.packSize > 1 ? 'пачек' : 'шт'}
                      </span>
                      {item.packSize > 1 && (
                        <span className="ml-2">(по {item.packSize} шт)</span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    {quantity === 0 ? (
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => handleAddToCart(item)}
                      >
                        В корзину
                      </Button>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center bg-gray-100 rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (quantity <= (item.minOrder || 1)) {
                                  handleRemoveFromCart(item.id);
                                } else {
                                  handleUpdateQuantity(item.id, quantity - 1);
                                }
                              }}
                              className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-gray-200 rounded-l-lg transition-colors"
                            >
                              <MinusIcon className="w-5 h-5" />
                            </Button>
                            <span className="mx-4 font-medium">
                              {quantity} {item.packSize > 1 ? 'пачек' : 'шт'}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-green-500 hover:bg-gray-200 rounded-r-lg transition-colors"
                            >
                              <PlusIcon className="w-5 h-5" />
                            </Button>
                          </div>
                          <div className="font-bold text-green-600">
                            {total.toLocaleString()} ₸
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          Всего {quantity * (item.packSize || 1)} штук
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Mobile Cart Button */}
        <div className="lg:hidden fixed left-0 right-0 bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] bg-white border-t border-gray-200">
          <div className="px-4 py-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/purchase/checkout')}
            >
              Оформить заказ
            </Button>
          </div>
        </div>

        {/* Desktop Cart Summary */}
        <div className="hidden lg:block fixed right-4 top-24 w-80">
          {Object.keys(cart).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Корзина</h2>
              <div className="space-y-4 mb-6">
                {Object.entries(cart).map(([itemId, quantity]) => {
                  const item = [...categories.flowers, ...categories.supplies].find(i => i.id === Number(itemId));
                  const currentPrice = isWholesale ? item.wholesalePrice : item.regularPrice;
                  const itemTotal = quantity * currentPrice * item.packSize;

                  return (
                    <div key={itemId} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {quantity} {item.packSize > 1 ? 'пачек' : 'шт'} × {currentPrice} ₸
                        </p>
                      </div>
                      <span className="font-medium">{itemTotal.toLocaleString()} ₸</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg">Итого:</span>
                  <span className="font-bold text-lg text-green-600">{total.toLocaleString()} ₸</span>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/purchase/checkout')}
                >
                  Оформить заказ
                </Button>
                {isWholesale && (
                  <div className="text-center text-green-600 text-sm mt-2">
                    Применена оптовая цена
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
