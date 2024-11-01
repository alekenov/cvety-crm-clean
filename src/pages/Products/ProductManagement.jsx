import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Eye, EyeOff, ArrowUp, ArrowDown, Package, Truck } from 'lucide-react';

function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('name');
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: "Букет 'Весеннее настроение'", 
      price: 15000, 
      image: "https://images.unsplash.com/photo-1587556930799-8dca6fad6d7e?w=800", 
      active: true, 
      type: 'bouquet',
      freeDelivery: true
    },
    { 
      id: 2, 
      name: "Букет 'Нежность'", 
      price: 12000, 
      image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800", 
      active: true, 
      type: 'bouquet',
      freeDelivery: true
    },
    { 
      id: 3, 
      name: "Композиция 'Летний сад'", 
      price: 20000, 
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800", 
      active: false, 
      type: 'bouquet',
      freeDelivery: false
    },
    { 
      id: 4, 
      name: "Открытка 'С днем рождения'", 
      price: 500, 
      image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800", 
      active: true, 
      type: 'additional',
      freeDelivery: false
    },
    { 
      id: 5, 
      name: "Ваза хрустальная", 
      price: 5000, 
      image: "https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?w=800", 
      active: true, 
      type: 'additional',
      freeDelivery: false
    }
  ]);

  const [comboProducts, setComboProducts] = useState([
    { 
      id: 1, 
      name: "Праздничный набор", 
      price: 25000, 
      active: true, 
      items: [
        { id: 2, name: "Букет 'Нежность'", image: "/api/placeholder/50/50" },
        { id: 4, name: "Открытка 'С днем рождения'", image: "/api/placeholder/50/50" },
        { id: 5, name: "Ваза хрустальная", image: "/api/placeholder/50/50" }
      ]
    },
    { 
      id: 2, 
      name: "Романтический вечер", 
      price: 30000, 
      active: true, 
      items: [
        { id: 1, name: "Букет 'Весеннее настроение'", image: "/api/placeholder/50/50" },
        { id: 5, name: "Ваза хрустальная", image: "/api/placeholder/50/50" }
      ]
    }
  ]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const toggleProductStatus = (id, isCombo = false) => {
    if (isCombo) {
      setComboProducts(items => items.map(item => 
        item.id === id ? {...item, active: !item.active} : item
      ));
    } else {
      setProducts(items => items.map(item => 
        item.id === id ? {...item, active: !item.active} : item
      ));
    }
  };

  const handleSort = (order) => setSortOrder(order);

  const filteredAndSortedProducts = products
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(product => activeTab === 'all' || product.type === activeTab)
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'price_asc') return a.price - b.price;
      if (sortOrder === 'price_desc') return b.price - a.price;
      return 0;
    });

  const filteredAndSortedComboProducts = comboProducts
    .filter(combo => combo.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'price_asc') return a.price - b.price;
      if (sortOrder === 'price_desc') return b.price - a.price;
      return 0;
    });

  // Мобильная версия
  const MobileView = () => (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen sm:hidden">
      {/* Заголовок */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold flex items-center">
            <Package className="text-blue-500 mr-2" size={20} />
            Товары
          </h1>
          <button
            className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex overflow-x-auto gap-2 pb-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Все товары
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeTab === 'bouquets' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('bouquets')}
          >
            Букеты
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeTab === 'additional' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('additional')}
          >
            Доп. товары
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeTab === 'combo' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('combo')}
          >
            Комбо
          </button>
        </div>
      </div>

      {/* Список товаров */}
      <div className="p-4">
        {activeTab !== 'combo' ? (
          <div className="space-y-4">
            {filteredAndSortedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.freeDelivery && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Truck size={12} className="mr-1" />
                      Бесплатная доставка
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-green-600">{product.price} ₸</p>
                    <div className="flex gap-2">
                      <button
                        className={`p-2 rounded-lg ${
                          product.active 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        onClick={() => toggleProductStatus(product.id)}
                      >
                        {product.active ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                      <button
                        className="p-2 rounded-lg bg-blue-100 text-blue-600"
                        onClick={() => alert(`Редактирование ${product.name}`)}
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedComboProducts.map(combo => (
              <div key={combo.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{combo.name}</h3>
                  <p className="text-lg font-bold text-green-600">{combo.price} ₸</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {combo.items.map(item => (
                    <div key={item.id} className="aspect-square">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg"
                        title={item.name}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    className={`p-2 rounded-lg ${
                      combo.active 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => toggleProductStatus(combo.id, true)}
                  >
                    {combo.active ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  <button
                    className="p-2 rounded-lg bg-blue-100 text-blue-600"
                    onClick={() => alert(`Редактирование комбо ${combo.name}`)}
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Десктопная версия
  const DesktopView = () => (
    <div className="hidden sm:block min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Верхняя панель */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="text-blue-500 mr-2" size={24} />
                <h1 className="text-xl font-bold">Управление товарами</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-64 pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  <Filter size={20} />
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600"
                >
                  <Plus size={20} className="mr-2" />
                  Добавить товар
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 flex items-center space-x-2">
            <button
              className={`px-3 py-1.5 rounded-full text-sm ${
                activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('all')}
            >
              Все товары
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm ${
                activeTab === 'bouquets' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('bouquets')}
            >
              Букеты
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm ${
                activeTab === 'additional' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('additional')}
            >
              Доп. товары
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm ${
                activeTab === 'combo' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('combo')}
            >
              Комбо наборы
            </button>

            {showFilters && (
              <>
                <div className="h-4 w-px bg-gray-300 mx-2"></div>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                    sortOrder === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleSort('name')}
                >
                  По названию
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                    sortOrder === 'price_asc' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleSort('price_asc')}
                >
                  Цена <ArrowUp size={14} className="ml-1" />
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                    sortOrder === 'price_desc' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleSort('price_desc')}
                >
                  Цена <ArrowDown size={14} className="ml-1" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Сетка товаров */}
        {activeTab !== 'combo' ? (
          <div className="grid grid-cols-3 gap-6">
            {filteredAndSortedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="aspect-square mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-lg font-bold text-green-600">{product.price} ₸</p>
                  <div className="flex justify-between pt-2">
                    <button
                      className={`p-2 rounded-lg ${
                        product.active 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={() => toggleProductStatus(product.id)}
                    >
                      {product.active ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    <button
                      className="p-2 rounded-lg bg-blue-100 text-blue-600"
                      onClick={() => alert(`Редактирование ${product.name}`)}
                    >
                      <Edit2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filteredAndSortedComboProducts.map(combo => (
              <div key={combo.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{combo.name}</h3>
                  <p className="text-lg font-bold text-green-600">{combo.price} ₸</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {combo.items.map(item => (
                    <div key={item.id} className="aspect-square">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg"
                        title={item.name}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    className={`p-2 rounded-lg ${
                      combo.active 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => toggleProductStatus(combo.id, true)}
                  >
                    {combo.active ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  <button
                    className="p-2 rounded-lg bg-blue-100 text-blue-600"
                    onClick={() => alert(`Редактирование комбо ${combo.name}`)}
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}

export default ProductManagement; 