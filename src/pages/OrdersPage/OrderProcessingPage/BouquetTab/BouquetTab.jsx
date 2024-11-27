import React, { useState } from 'react';
import { Camera, Plus, Minus, X, AlertCircle, MessageCircle, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

export default function BouquetTab() {
  const [photos, setPhotos] = useState({});
  const [showFlowerPicker, setShowFlowerPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composition, setComposition] = useState([
    { id: 1, name: 'Роза розовая', count: 25, price: 450 },
    { id: 2, name: 'Гипсофила', count: 2, price: 800 }
  ]);

  const order = {
    id: '32451',
    items: [
      { 
        id: 1,
        type: 'bouquet',
        name: 'Букет "Нежное облако"',
        price: 15000
      },
      {
        id: 2,
        type: 'card',
        name: 'Открытка поздравительная',
        price: 500
      }
    ]
  };

  // Список доступных цветов для добавления
  const flowers = [
    { id: 101, name: 'Роза красная', price: 450 },
    { id: 102, name: 'Роза белая', price: 450 },
    { id: 103, name: 'Хризантема', price: 350 },
    { id: 104, name: 'Гипсофила', price: 800 },
    { id: 105, name: 'Эустома', price: 550 }
  ];

  const handlePhotoUpload = (itemId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotos(prev => ({
        ...prev,
        [itemId]: URL.createObjectURL(file)
      }));
    }
  };

  const updateCount = (flowerId, change) => {
    setComposition(prev => prev.map(flower => {
      if (flower.id === flowerId) {
        const newCount = Math.max(0, flower.count + change);
        return { ...flower, count: newCount };
      }
      return flower;
    }).filter(flower => flower.count > 0));
  };

  const addFlower = (flower) => {
    const existing = composition.find(f => f.id === flower.id);
    if (existing) {
      updateCount(flower.id, 1);
    } else {
      setComposition([...composition, { ...flower, count: 1 }]);
    }
    setShowFlowerPicker(false);
  };

  const calculateTotals = (item) => {
    const materialCost = composition.reduce((sum, flower) => 
      sum + (flower.count * flower.price), 0);
    const margin = ((item.price - materialCost) / item.price * 100).toFixed(0);
    return { materialCost, margin };
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Основной контент */}
      <div className="flex-1 p-4 space-y-4">
        {order.items.map(item => {
          const { materialCost, margin } = calculateTotals(item);
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Заголовок товара */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-green-600 font-bold mt-1">
                      {item.price.toLocaleString()} ₸
                    </p>
                  </div>
                </div>
              </div>

              {/* Фото до отправки */}
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium mb-3">Фото до отправки:</h4>
                {photos[item.id] ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <img 
                        src={photos[item.id]} 
                        alt="Букет" 
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button 
                          onClick={() => setPhotos(prev => ({ ...prev, [item.id]: null }))}
                          className="bg-white/90 p-2 rounded-full shadow-sm"
                        >
                          <X size={16} />
                        </button>
                        <label className="bg-white/90 p-2 rounded-full shadow-sm cursor-pointer">
                          <Camera size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(item.id, e)}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg flex items-center">
                      <Check size={16} className="text-green-600 mr-2" />
                      <span className="text-sm text-green-700">
                        Фото отправлено клиенту
                      </span>
                    </div>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg aspect-[3/4] flex flex-col items-center justify-center">
                      <Camera className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Нажмите чтобы добавить фото</p>
                    </div>
                    <input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(item.id, e)}
                    />
                  </label>
                )}
              </div>

              {/* Состав букета */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Состав букета</h4>
                  <button 
                    onClick={() => setShowFlowerPicker(true)}
                    className="text-blue-600 text-sm font-medium flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Добавить цветок
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {composition.map(flower => (
                    <div key={flower.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{flower.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {flower.price} ₸/шт
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white rounded-lg p-1">
                            <button 
                              onClick={() => updateCount(flower.id, -1)}
                              className="p-2"
                            >
                              <Minus size={16} className="text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {flower.count}
                            </span>
                            <button 
                              onClick={() => updateCount(flower.id, 1)}
                              className="p-2"
                            >
                              <Plus size={16} className="text-gray-600" />
                            </button>
                          </div>
                          <span className="font-medium min-w-[80px] text-right">
                            {(flower.count * flower.price).toLocaleString()} ₸
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Итоги */}
                <div className="space-y-2">
                  <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-medium">Стоимость материалов:</span>
                    <span className="font-bold">
                      {materialCost.toLocaleString()} ₸
                    </span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-medium">Маржинальность:</span>
                    <span className="font-bold text-green-600">
                      {margin}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно выбора цветов */}
      {showFlowerPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white p-4 rounded-t-xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Добавить цветок</h3>
                <button onClick={() => setShowFlowerPicker(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск цветов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              {flowers
                .filter(f => 
                  f.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(flower => (
                  <button
                    key={flower.id}
                    onClick={() => addFlower(flower)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{flower.name}</div>
                      <div className="text-sm text-gray-600">
                        {flower.price} ₸/шт
                      </div>
                    </div>
                  </button>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}