import React, { useState } from 'react';
import { Package, Box, History, Eye, EyeOff, ClipboardEdit, Plus, ChevronDown, ChevronUp, X, Settings } from 'lucide-react';
import StockManagement from './components/StockManagement';
import OperationHistory from './components/OperationHistory';
import StockRevision from './components/StockRevision';

export default function InventoryPage() {
  const [activeView, setActiveView] = useState('stock');
  const [showCosts, setShowCosts] = useState(false);
  const [showInactive, setShowInactive] = useState(true);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Freedom',
      quantity: 300,
      costPrice: 400,
      markup: 44,
      price: 576,
      active: true
    },
    {
      id: 2,
      name: 'Mondial',
      quantity: 150,
      costPrice: 450,
      markup: 35,
      price: 590,
      active: true
    },
    {
      id: 3,
      name: 'Pink Expression',
      quantity: 0,
      costPrice: 380,
      markup: 45,
      price: 450,
      active: false
    },
    {
      id: 4,
      name: 'Гипсофила',
      quantity: 0,
      costPrice: 350,
      markup: 40,
      price: 490,
      active: false
    }
  ]);

  const [history] = useState([
    {
      id: 1,
      type: 'in',
      date: '2024-03-20 10:30',
      comment: 'Приемка от поставщика',
      operator: {
        id: 1,
        name: 'Анна',
        role: 'Флорист'
      },
      items: [
        { 
          id: 1,
          name: 'Freedom',
          quantity: 500,
          price: 400
        }
      ]
    },
    {
      id: 2,
      type: 'out',
      date: '2024-03-20 15:45',
      comment: 'Продажа (Букет "Нежность")',
      operator: {
        id: 2,
        name: 'Мария',
        role: 'Менеджер'
      },
      order: {
        id: '1234',
        name: 'Букет "Нежность"',
        client: 'Айым',
        status: 'Доставлен',
        price: 25000,
      },
      items: [
        { 
          id: 1,
          name: 'Freedom',
          quantity: 25,
          price: 576
        },
        {
          id: 2,
          name: 'Pink Mondial',
          quantity: 15,
          price: 590
        }
      ]
    }
  ]);

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSaveItem = (formData) => {
    if (editingItem) {
      // Обновление существующего товара
      setInventory(inventory.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } : item
      ));
    } else {
      // Добавление нового товара
      setInventory([...inventory, {
        id: Math.max(...inventory.map(i => i.id)) + 1,
        ...formData,
        active: true
      }]);
    }
    setShowAddModal(false);
    setEditingItem(null);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center">
          <Package className="text-blue-500 mr-2" size={24} />
          <h1 className="text-xl font-bold">Управление складом</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Мобильные кнопки */}
          <div className="flex md:hidden space-x-2">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`p-2 rounded-lg flex items-center justify-center ${
                showInactive ? 'bg-gray-200' : 'bg-gray-100'
              }`}
            >
              {showInactive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <button
              onClick={() => setShowCosts(!showCosts)}
              className={`p-2 rounded-lg flex items-center justify-center ${
                showCosts ? 'bg-green-500 text-white' : 'bg-gray-100'
              }`}
            >
              {showCosts ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            <button
              onClick={() => setIsRevisionMode(!isRevisionMode)}
              className={`p-2 rounded-lg flex items-center justify-center ${
                isRevisionMode ? 'bg-yellow-500 text-white' : 'bg-gray-100'
              }`}
            >
              <ClipboardEdit size={20} />
            </button>
          </div>

          {/* Десктопные кнопки */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`px-4 py-2 rounded-lg flex items-center justify-center ${
                showInactive ? 'bg-gray-200' : 'bg-gray-100'
              }`}
            >
              {showInactive ? (
                <>
                  <ChevronUp size={20} className="mr-2" />
                  <span className="whitespace-nowrap">Скрыть неактивные</span>
                </>
              ) : (
                <>
                  <ChevronDown size={20} className="mr-2" />
                  <span className="whitespace-nowrap">Показать неактивные</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowCosts(!showCosts)}
              className={`px-4 py-2 rounded-lg flex items-center justify-center ${
                showCosts ? 'bg-green-500 text-white' : 'bg-gray-100'
              }`}
            >
              {showCosts ? (
                <>
                  <EyeOff size={20} className="mr-2" />
                  Скрыть цены
                </>
              ) : (
                <>
                  <Eye size={20} className="mr-2" />
                  Показать цены
                </>
              )}
            </button>

            <button
              onClick={() => setIsRevisionMode(!isRevisionMode)}
              className={`px-4 py-2 rounded-lg flex items-center justify-center ${
                isRevisionMode ? 'bg-yellow-500 text-white' : 'bg-gray-100'
              }`}
            >
              <ClipboardEdit size={20} className="mr-2" />
              {isRevisionMode ? 'Отменить ревизию' : 'Начать ревизию'}
            </button>
          </div>

          {/* Кнопки навигации */}
          <div className="flex w-full sm:w-auto space-x-2">
            <button
              onClick={() => setActiveView('stock')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg flex items-center justify-center ${
                activeView === 'stock' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              <Box size={20} className="mr-2" />
              <span className="hidden sm:inline">Склад</span>
              <span className="sm:hidden">Склад</span>
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg flex items-center justify-center ${
                activeView === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              <History size={20} className="mr-2" />
              <span className="hidden sm:inline">История</span>
              <span className="sm:hidden">История</span>
            </button>

            {/* Кнопка добавления товара */}
            <button
              onClick={() => {
                setEditingItem(null);
                setShowAddModal(true);
              }}
              className="p-2 rounded-lg flex items-center justify-center bg-green-500 text-white"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {isRevisionMode ? (
        <StockRevision 
          inventory={inventory}
          setInventory={setInventory}
          onComplete={() => setIsRevisionMode(false)}
        />
      ) : (
        activeView === 'stock' ? (
          <StockManagement 
            inventory={inventory} 
            setInventory={setInventory} 
            showCosts={showCosts}
            showInactive={showInactive}
            onEditItem={handleEditItem}
          />
        ) : (
          <OperationHistory 
            history={history} 
            showCosts={showCosts}
          />
        )
      )}

      {/* Модальное окно добавления/редактирования товара */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Редактировать товар' : 'Добавить товар'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                name: e.target.name.value,
                costPrice: parseInt(e.target.costPrice.value),
                markup: parseInt(e.target.markup.value),
                quantity: parseInt(e.target.quantity.value),
                price: parseInt(e.target.price.value)
              };
              handleSaveItem(formData);
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Наименование
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Введите название товара"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Себестоимость
                </label>
                <input
                  type="number"
                  name="costPrice"
                  defaultValue={editingItem?.costPrice}
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Наценка (%)
                </label>
                <input
                  type="number"
                  name="markup"
                  defaultValue={editingItem?.markup}
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество
                </label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue={editingItem?.quantity}
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена продажи
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editingItem?.price}
                  className="w-full p-2 border rounded-lg"
                  placeholder="0"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  {editingItem ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}