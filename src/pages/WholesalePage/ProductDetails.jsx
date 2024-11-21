import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar, Heart, Building2, Package, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [quantity, setQuantity] = useState(0);

  // Product data
  const product = {
    id: 1,
    name: "Роза Red Naomi 50см",
    images: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/400",
      "/api/placeholder/400/400"
    ],
    rating: 4.8,
    reviewCount: 156,
    country: {
      name: "Кения",
      flag: "🇰🇪"
    },
    farm: {
      name: "Freedom Flowers",
      rating: 4.9
    },
    prices: [
      { quantity: 1, price: 450, label: "Базовая цена" },
      { quantity: 5, price: 420, label: "Средний опт" },
      { quantity: 20, price: 400, label: "Крупный опт" }
    ],
    packSize: 25,
    minOrder: 1,
    description: "Роза сорта Red Naomi отличается крупным бутоном, насыщенным красным цветом и стойкостью до 14 дней",
    available: 50,
    delivery: "Пятница, 15 марта",
    orderDeadline: "Сегодня до 18:00",
    inFavorites: false,
    specifications: [
      { label: "Длина стебля", value: "50 см" },
      { label: "Размер бутона", value: "5-6 см" },
      { label: "Стойкость", value: "12-14 дней" },
      { label: "Упаковка", value: "25 штук" }
    ]
  };

  // Функция для определения текущей цены на основе количества
  const getCurrentPrice = () => {
    const sortedPrices = [...product.prices].sort((a, b) => b.quantity - a.quantity);
    for (const price of sortedPrices) {
      if (quantity >= price.quantity) {
        return price.price;
      }
    }
    return product.prices[0].price;
  };

  // Обработчики для корзины
  const handleAddToCart = () => {
    setQuantity(product.minOrder);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity <= product.minOrder) {
      setQuantity(0);
    } else {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back button - visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-10 p-4">
        <Link to="/purchase" className="flex items-center text-gray-600">
          <ChevronLeft className="w-5 h-5" />
          <span>Назад</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 lg:pt-8 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left column - Gallery */}
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="relative w-full aspect-[3/4] mb-6">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Navigation arrows */}
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button 
                  className="bg-white/80 p-2 rounded-full"
                  onClick={() => setCurrentImageIndex(i => i > 0 ? i - 1 : product.images.length - 1)}
                >
                  <ChevronLeft />
                </button>
                <button 
                  className="bg-white/80 p-2 rounded-full"
                  onClick={() => setCurrentImageIndex(i => i < product.images.length - 1 ? i + 1 : 0)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            {/* Thumbnail strip - desktop only */}
            <div className="hidden lg:grid grid-cols-4 gap-2 p-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`relative ${currentImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* Right column - Product info */}
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
                <button className={`p-2 rounded-full ${product.inFavorites ? 'bg-red-50' : 'bg-gray-100'}`}>
                  <Heart className={product.inFavorites ? 'text-red-500' : 'text-gray-400'} />
                </button>
              </div>

              {/* Farm info */}
              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{product.country.flag}</span>
                    <span>{product.country.name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="text-yellow-400 fill-current w-4 h-4" />
                    <span className="ml-1">{product.farm.rating}</span>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Building2 size={16} className="text-blue-500 mr-2" />
                  <span className="font-medium">{product.farm.name}</span>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Package size={18} className="text-gray-500 mr-2" />
                  <span>В наличии:</span>
                </div>
                <span className="font-bold">
                  {product.available} пачек по {product.packSize} шт
                </span>
              </div>

              {/* Delivery date */}
              <div className="flex items-center text-sm text-gray-600 mt-3">
                <Calendar size={16} className="mr-1" />
                Поставка {product.delivery}
              </div>
            </div>

            {/* Prices */}
            <div className="bg-white p-4 rounded-lg">
              <h2 className="font-semibold mb-3">Цены за штуку:</h2>
              <div className="grid lg:grid-cols-3 gap-2">
                {product.prices.map((priceLevel, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      index === 0 ? 'bg-gray-50' : 'bg-green-50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{priceLevel.label}</span>
                      <div className="text-sm text-gray-600">
                        от {priceLevel.quantity} {priceLevel.quantity === 1 ? 'пачки' : 'пачек'}
                      </div>
                      <div className="font-bold text-green-600 mt-1">{priceLevel.price} ₸/шт</div>
                      <div className="text-sm text-gray-600">
                        {priceLevel.quantity * product.packSize} штук
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Характеристики</h2>
                <button 
                  className="text-blue-500 text-sm"
                  onClick={() => setShowAllInfo(!showAllInfo)}
                >
                  {showAllInfo ? 'Скрыть' : 'Все характеристики'}
                </button>
              </div>
              <div className="grid lg:grid-cols-2 gap-2">
                {product.specifications
                  .slice(0, showAllInfo ? undefined : 3)
                  .map((spec, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-lg">
              <h2 className="font-semibold mb-2">Описание</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order button - fixed on mobile, normal on desktop */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white border-t lg:relative lg:mt-4 lg:max-w-7xl lg:mx-auto">
        {quantity === 0 ? (
          <button 
            onClick={handleAddToCart}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-lg font-bold transition-colors"
          >
            <div className="flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 mr-2" />
              <span>Добавить в корзину</span>
            </div>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <button
                onClick={handleDecrement}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="font-medium">{quantity} пач</div>
                <div className="text-sm text-gray-600">{quantity * product.packSize} штук</div>
              </div>
              <button
                onClick={handleIncrement}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center font-medium">
              {(getCurrentPrice() * quantity * product.packSize).toLocaleString()} ₸
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
