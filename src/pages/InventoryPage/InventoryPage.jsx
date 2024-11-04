import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Search, Filter, Plus, Edit2, 
  Archive, Package, Calendar 
} from 'lucide-react';

function InventoryPage() {
  const [expandedGroups, setExpandedGroups] = useState(['today', 'yesterday']);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const inventory = {
    today: [
      {
        id: 1,
        name: 'Freedom 60см',
        quantity: 300,
        unit: 'шт',
        category: 'Розы',
        price: 576,
        date: '02.11.2024',
        active: true
      },
      {
        id: 2,
        name: 'Pink Floyd 60см',
        quantity: 150,
        unit: 'шт',
        category: 'Розы',
        price: 610,
        date: '02.11.2024',
        active: true
      },
      {
        id: 3,
        name: 'Тюльпан Strong Gold',
        quantity: 200,
        unit: 'шт',
        category: 'Тюльпаны',
        price: 300,
        date: '02.11.2024',
        active: true
      }
    ],
    yesterday: [
      {
        id: 4,
        name: 'Red Naomi 60см',
        quantity: 120,
        unit: 'шт',
        category: 'Розы',
        price: 550,
        date: '01.11.2024',
        active: true
      },
      {
        id: 5,
        name: 'Тюльпан Pink Expression',
        quantity: 180,
        unit: 'шт',
        category: 'Тюльпаны',
        price: 280,
        date: '01.11.2024',
        active: true
      }
    ],
    old: [
      {
        id: 6,
        name: 'Red Naomi 50см',
        quantity: 0,
        unit: 'шт',
        category: 'Розы',
        price: 450,
        date: '29.10.2024',
        active: false
      }
    ]
  };

  const groupTitles = {
    today: 'Сегодня, 2 ноября',
    yesterday: 'Вчера, 1 ноября',
    old: 'Старые поставки'
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleEdit = (item) => {
    setEditingItem({
      ...item,
      isEditing: true
    });
  };

  const handleSave = () => {
    // Здесь будет логика сохранения изменений
    setEditingItem(null);
  };

  // Мобильная версия
  const MobileView = () => (
    <div className="sm:hidden bg-gray-100 min-h-screen">
      {/* Заголовок */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold flex items-center">
            <Package className="text-blue-500 mr-2" size={20} />
            Склад
          </h1>
          <button className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button className="p-2 bg-gray-100 rounded-lg">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Список товаров */}
      <div className="p-4">
        {Object.entries(inventory).map(([group, items]) => (
          <div key={group} className="mb-4">
            <div 
              className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-2 cursor-pointer"
              onClick={() => toggleGroup(group)}
            >
              {expandedGroups.includes(group) ? (
                <ChevronDown size={20} className="mr-2" />
              ) : (
                <ChevronRight size={20} className="mr-2" />
              )}
              <span className="font-medium">{groupTitles[group]}</span>
              <span className="ml-2 text-gray-500">({items.length})</span>
            </div>

            {expandedGroups.includes(group) && items.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-sm p-4 mb-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantity} {item.unit}</p>
                    <p className="text-sm text-green-600">{item.price} ₸</p>
                  </div>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 bg-gray-50 rounded-lg"
                  >
                    <Archive size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Десктопная версия
  const DesktopView = () => (
    <div className="hidden sm:block min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Верхняя панель */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold flex items-center">
            <Package className="mr-2" size={28} />
            Склад
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button className="p-2 bg-gray-100 rounded-lg">
              <Calendar size={20} />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg">
              <Filter size={20} />
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center">
              <Plus size={20} className="mr-2" />
              Добавить приход
            </button>
          </div>
        </div>

        {/* Таблица товаров */}
        <div className="bg-white rounded-lg shadow">
          {/* Заголовок таблицы */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium">
            <div className="col-span-5">Название</div>
            <div className="col-span-2 text-right">В наличии</div>
            <div className="col-span-3 text-right">Цена за штуку</div>
            <div className="col-span-2 text-right">Действия</div>
          </div>

          {/* Группы товаров по датам */}
          {Object.entries(inventory).map(([group, items]) => (
            <div key={group}>
              <div 
                className="p-4 bg-gray-100 border-b flex items-center cursor-pointer"
                onClick={() => toggleGroup(group)}
              >
                {expandedGroups.includes(group) ? (
                  <ChevronDown size={20} className="mr-2" />
                ) : (
                  <ChevronRight size={20} className="mr-2" />
                )}
                <span className="font-medium">{groupTitles[group]}</span>
                <span className="ml-2 text-gray-500">({items.length})</span>
              </div>
              {expandedGroups.includes(group) && items.map(item => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 ${
                    item.quantity === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  {editingItem?.id === item.id ? (
                    // Режим редактирования
                    <>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={editingItem.quantity}
                          onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                          className="w-full p-2 border rounded text-right"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                          className="w-full p-2 border rounded text-right"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <button 
                          onClick={handleSave}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg mr-2"
                        >
                          Сохранить
                        </button>
                        <button 
                          onClick={() => setEditingItem(null)}
                          className="px-3 py-1 bg-gray-200 rounded-lg"
                        >
                          Отмена
                        </button>
                      </div>
                    </>
                  ) : (
                    // Режим просмотра
                    <>
                      <div className="col-span-5">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        {item.quantity} {item.unit}
                      </div>
                      <div className="col-span-3 text-right font-medium">
                        {item.price} ₸
                      </div>
                      <div className="col-span-2 text-right">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded mr-2"
                          title="Редактировать"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                          title="Архивировать"
                        >
                          <Archive size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
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