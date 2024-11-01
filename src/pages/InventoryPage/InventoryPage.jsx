import React, { useState } from 'react';
import { 
  Package, Search, Edit2, Plus, Check, ArrowUpDown, 
  Share2, ClipboardCheck, X 
} from 'lucide-react';

// Компонент строки товара для десктопной версии
const DesktopProductRow = ({ product, onEdit }) => (
  <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50">
    <div className="col-span-6 font-medium">
      <div className="flex items-center">
        {product.name}
        <span className={`ml-2 px-2 py-0.5 ${
          product.quantity > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        } text-xs rounded-full`}>
          {product.quantity > 0 ? 'В наличии' : 'Нет в наличии'}
        </span>
      </div>
    </div>
    <div className="col-span-3">{product.quantity} шт</div>
    <div className="col-span-3 flex justify-between items-center">
      <span className="font-medium text-green-600">{product.price} тг</span>
      <button 
        onClick={() => onEdit(product.id)}
        className="p-1 text-gray-400 hover:text-blue-500"
      >
        <Edit2 size={16} />
      </button>
    </div>
  </div>
);

// Компонент карточки товара для мобильной версии
const MobileProductCard = ({ product, onEdit }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-3">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center">
          <h3 className="font-semibold">{product.name}</h3>
          <span className={`ml-2 px-2 py-0.5 ${
            product.quantity > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          } text-xs rounded-full`}>
            {product.quantity > 0 ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{product.quantity} шт</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-green-600">{product.price} тг</p>
        <button 
          onClick={() => onEdit(product.id)}
          className="mt-2 p-2 text-gray-400 hover:text-blue-500"
        >
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

function InventoryPage() {
  const [sortBy, setSortBy] = useState('name');
  const [showInactive, setShowInactive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isInventoryMode, setIsInventoryMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Пример данных товаров
  const products = [
    {
      id: 1,
      name: "Freedom",
      quantity: 300,
      price: 576,
      cost: 400,
      markup: 44
    },
    {
      id: 2,
      name: "Mondial",
      quantity: 0,
      price: 590,
      cost: 410,
      markup: 44
    }
  ];

  // Мобильная версия
  const MobileView = () => (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen sm:hidden">
      <div className="bg-white p-4 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-semibold flex items-center">
          <Package className="text-blue-500 mr-2" size={20} />
          Склад
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setIsInventoryMode(!isInventoryMode)}
            className={`p-2 rounded-full ${
              isInventoryMode ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {isInventoryMode ? <Check size={20} /> : <ClipboardCheck size={20} />}
          </button>
          <button
            className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {showSearch && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск товара..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {products.map(product => (
            <MobileProductCard 
              key={product.id} 
              product={product}
              onEdit={setEditingId}
            />
          ))}
        </div>
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
                <h1 className="text-xl font-bold">Склад</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск товара..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <button 
                  onClick={() => setIsInventoryMode(!isInventoryMode)}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    isInventoryMode ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                >
                  {isInventoryMode ? (
                    <>
                      <Check size={20} className="mr-2" />
                      Завершить ревизию
                    </>
                  ) : (
                    <>
                      <ClipboardCheck size={20} className="mr-2" />
                      Ревизия
                    </>
                  )}
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center">
                  <Plus size={20} className="mr-2" />
                  Добавить товар
                </button>
              </div>
            </div>
          </div>
          
          {/* Фильтры */}
          <div className="px-4 pb-4 flex items-center space-x-2">
            <button 
              className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                sortBy === 'name' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSortBy('name')}
            >
              <ArrowUpDown size={14} className="mr-1" />
              По названию
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm ${
                sortBy === 'quantity' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSortBy('quantity')}
            >
              По количеству
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full text-sm ${
                sortBy === 'price' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSortBy('price')}
            >
              По цене
            </button>
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            <label className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 mr-2"
              />
              <span className="text-sm text-gray-700">
                Показывать отсутствующие
              </span>
            </label>
          </div>
        </div>

        {/* Таблица товаров */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
            <div className="col-span-6 flex items-center">Наименование</div>
            <div className="col-span-3">Количество</div>
            <div className="col-span-3 flex justify-between items-center pr-8">Цена продажи</div>
          </div>

          <div className="divide-y">
            {products.map(product => (
              <DesktopProductRow 
                key={product.id} 
                product={product}
                onEdit={setEditingId}
              />
            ))}
          </div>
        </div>
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

export default InventoryPage; 