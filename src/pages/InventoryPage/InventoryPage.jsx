import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { Package, Search, Edit2, Trash2, Plus, Minus, ClipboardCheck, Check, X, Percent, Wallet, Calendar, Box, History } from 'lucide-react';
import RevisionMode from './components/RevisionMode';
import HistoryMode from './components/HistoryMode';

const InventoryPage = () => {
  const [mode, setMode] = useState('inventory'); // 'inventory', 'revision', 'history'
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  // Состояния для ревизии
  const [revisionItems, setRevisionItems] = useState([]);

  // Состояния для истории
  const [historyItems, setHistoryItems] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');

  const { data: inventoryData, loading, error, updateData } = useSupabase('inventory', {
    select: `
      *,
      products (
        id,
        name,
        description,
        price,
        category,
        sku
      )
    `
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Преобразуем данные в нужный формат
  const formatInventoryData = (data) => {
    if (!data) return [];
    
    return data.map(item => ({
      id: item.id,
      name: item.products?.name || 'Неизвестный товар',
      quantity: item.quantity,
      price: item.products?.price || 0,
      costPrice: item.products?.price || 0,
      markup: 30,
      active: true,
      location: item.location,
      min_quantity: item.min_quantity,
      max_quantity: item.max_quantity,
      status: item.status,
      product_id: item.product_id
    }));
  };

  const handleUpdateInventory = async (updatedInventory) => {
    try {
      for (const item of updatedInventory) {
        await updateData(item.id, {
          quantity: item.quantity,
          location: item.location,
          min_quantity: item.min_quantity,
          max_quantity: item.max_quantity,
          status: item.status
        });
      }
    } catch (err) {
      console.error('Error updating inventory:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить позицию?')) {
      try {
        await updateData(id, { active: false });
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  // Форматируем данные перед использованием
  const inventory = formatInventoryData(inventoryData);

  // Компонент статистики
  const StatsCards = () => {
    const stats = {
      totalItems: inventory?.length || 0,
      totalValue: inventory?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0,
      lastRevisionDate: '2024-03-21' // В реальном приложении брать из БД
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего позиций</p>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
            <Box className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Стоимость склада</p>
              <p className="text-2xl font-bold text-green-500">{stats.totalValue.toLocaleString()} ₸</p>
            </div>
            <Wallet className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Последняя ревизия</p>
              <p className="text-2xl font-bold">{new Date(stats.lastRevisionDate).toLocaleDateString()}</p>
            </div>
            <Calendar className="text-purple-500" size={24} />
          </div>
        </div>
      </div>
    );
  };

  // Функция для изменения количества товара (для мобильной версии)
  const handleQuantityChange = async (item, change) => {
    const newQuantity = Math.max(0, item.quantity + change);
    const updatedItem = { ...item, quantity: newQuantity };
    
    // Обновляем статус в зависимости от количества
    if (newQuantity === 0) {
      updatedItem.status = 'out_of_stock';
    } else if (newQuantity < item.min_quantity) {
      updatedItem.status = 'low_stock';
    } else {
      updatedItem.status = 'in_stock';
    }

    await handleUpdateInventory([updatedItem]);
  };

  // Адаптивное представление инвентаря
  const InventoryView = () => {
    if (isDesktop) {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Наименование</th>
                <th className="px-4 py-3 text-right">Количество</th>
                <th className="px-4 py-3 text-right">Цена</th>
                <th className="px-4 py-3 text-left">Локация</th>
                <th className="px-4 py-3 text-center">Статус</th>
                <th className="px-4 py-3 text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {inventory?.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{item.price.toLocaleString()} ₸</td>
                  <td className="px-4 py-3">{item.location}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      item.status === 'in_stock' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'low_stock'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'in_stock' ? 'В наличии' :
                       item.status === 'low_stock' ? 'Заканчивается' :
                       'Нет в наличии'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => {
                          setEditedProduct(item);
                          setIsEditing(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Мобильное представление с удобным управлением количеством
    return (
      <div className="space-y-4">
        {inventory?.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{item.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.status === 'in_stock' 
                  ? 'bg-green-100 text-green-800' 
                  : item.status === 'low_stock'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.status === 'in_stock' ? 'В наличии' :
                 item.status === 'low_stock' ? 'Заканчивается' :
                 'Нет в наличии'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>Локация: {item.location}</p>
              <p>Цена: {item.price.toLocaleString()} ₸</p>
            </div>

            {/* Контроль количества */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <button 
                onClick={() => handleQuantityChange(item, -1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow"
              >
                <Minus size={20} />
              </button>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{item.quantity}</div>
                <div className="text-xs text-gray-500">штук</div>
              </div>

              <button 
                onClick={() => handleQuantityChange(item, 1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow"
              >
                <Plus size={20} />
              </button>
            </div>

            {item.quantity < item.min_quantity && (
              <div className="mt-2 text-sm text-yellow-600">
                Мало товара (мин: {item.min_quantity})
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Функция для рендеринга контента в зависимости от режима
  const renderContent = () => {
    switch (mode) {
      case 'revision':
        return (
          <RevisionMode 
            inventory={inventory}
            onComplete={(revisionData) => {
              console.log('Ревизия завершена:', revisionData);
              // Здесь будет логика сохранения результатов ревизии
              setMode('inventory');
            }}
            onBack={() => setMode('inventory')}
          />
        );

      case 'history':
        return (
          <HistoryMode 
            onBack={() => setMode('inventory')}
          />
        );

      default:
        return (
          <>
            <StatsCards />
            <InventoryView />
          </>
        );
    }
  };

  if (loading) return <div className="p-4">Загрузка данных...</div>;
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      {mode === 'inventory' && (
        // Показываем верхнюю панель только в режиме инвентаря
        <div className="bg-white p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Package className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold">Склад</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setMode('revision')}
                className="p-2 bg-blue-500 text-white rounded-lg flex items-center"
              >
                <ClipboardCheck size={20} className="mr-1" />
                <span className="hidden md:inline">Ревизия</span>
              </button>
              <button
                onClick={() => setMode('history')}
                className="p-2 bg-gray-100 rounded-lg flex items-center"
              >
                <History size={20} className="mr-1" />
                <span className="hidden md:inline">История</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className={mode === 'inventory' ? "p-4" : ""}>
        {renderContent()}
      </div>
    </div>
  );
};

export default InventoryPage; 