import React, { useState } from 'react';
import { Plus, Minus, X, Search } from 'lucide-react';

const FlowerWriteOff = ({ onAddFlower, onWriteOff }) => {
  // Изначальный состав букета
  const [flowers, setFlowers] = useState([
    { id: 1, name: 'Роза Red Naomi', height: '60', quantity: 15, isOriginal: true },
    { id: 2, name: 'Гвоздика розовая', height: '50', quantity: 7, isOriginal: true },
    { id: 3, name: 'Хризантема кустовая', height: '50', quantity: 3, isOriginal: true },
    { id: 4, name: 'Эустома белая', height: '50', quantity: 5, isOriginal: true },
    { id: 5, name: 'Статица сиреневая', height: '45', quantity: 2, isOriginal: true }
  ]);

  const [showAddNew, setShowAddNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Простой список всех доступных цветов
  const availableFlowers = [
    'Роза Red Naomi',
    'Роза Freedom',
    'Роза Pink Mondial',
    'Гвоздика розовая',
    'Хризантема кустовая',
    'Эустома белая',
    'Статица сиреневая',
    'Альстромерия',
    'Гипсофила',
    'Роза Кения',
    'Гербера',
    'Лилия',
    'Ирис',
    'Тюльпан'
  ].sort();

  const filteredFlowers = availableFlowers.filter(flower =>
    flower.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFlower = (flowerName) => {
    const newFlower = {
      id: Date.now(),
      name: flowerName,
      height: '50',
      quantity: 1,
      isOriginal: false
    };
    setFlowers([...flowers, newFlower]);
    setShowAddNew(false);
    setSearchQuery('');
    onAddFlower?.(newFlower);
  };

  const updateQuantity = (id, change) => {
    setFlowers(flowers.map(flower => {
      if (flower.id === id) {
        const newQuantity = Math.max(0, flower.quantity + change);
        return { ...flower, quantity: newQuantity };
      }
      return flower;
    }));
  };

  const removeFlower = (id) => {
    setFlowers(flowers.filter(flower => flower.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Основной список цветов */}
      <div className="space-y-2">
        {flowers.filter(f => f.quantity > 0).map((flower) => (
          <div 
            key={flower.id} 
            className={`p-3 rounded-lg ${flower.isOriginal ? 'bg-blue-50' : 'bg-gray-100'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">{flower.name}</span>
              <button
                onClick={() => removeFlower(flower.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{flower.height} см</span>
              <div className="flex items-center bg-white rounded-lg border">
                <button
                  onClick={() => updateQuantity(flower.id, -1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 font-bold text-sm min-w-[2.5rem] text-center">
                  {flower.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(flower.id, 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопки управления */}
      <div className="flex space-x-3">
        <button 
          className="flex-1 bg-green-50 text-green-600 py-3 px-4 rounded-lg font-semibold hover:bg-green-100 transition-colors"
          onClick={() => setShowAddNew(true)}
        >
          Добавить цветок
        </button>
        <button 
          className="flex-1 bg-blue-50 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
          onClick={() => onWriteOff?.(flowers)}
        >
          Списать
        </button>
      </div>

      {/* Модальное окно добавления цветка */}
      {showAddNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск цветка..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button
                onClick={() => {
                  setShowAddNew(false);
                  setSearchQuery('');
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredFlowers.map((flower, index) => (
                <button
                  key={index}
                  onClick={() => addFlower(flower)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  {flower}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowerWriteOff;
