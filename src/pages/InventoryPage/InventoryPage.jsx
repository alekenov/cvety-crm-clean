import React, { useState, useEffect, useMemo } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { 
  Package, 
  Search, 
  Edit2, 
  Trash2, 
  Plus, 
  Minus, 
  ClipboardCheck, 
  Check, 
  X, 
  Percent, 
  Wallet, 
  Calendar, 
  Box, 
  History, 
  Image as ImageIcon, 
  DollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
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

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    costPrice: 0,
    markup: 30,
    quantity: 0,
    location: '',
    photo: null,
    photoPreview: null
  });

  // Вычисляем конечную стоимость
  const finalPrice = useMemo(() => {
    const cost = parseFloat(newProduct.costPrice) || 0;
    const markup = parseFloat(newProduct.markup) || 0;
    return cost + (cost * markup / 100);
  }, [newProduct.costPrice, newProduct.markup]);

  // Обработчик загрузки фото
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

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
      id: item.id || Date.now(),
      name: item.products?.name || 'Неизвестный товар',
      quantity: item.quantity || 0,
      price: item.products?.price || 0,
      costPrice: item.products?.price || 0,
      markup: 30,
      active: true,
      location: item.location || '',
      status: getStatus(item.quantity || 0),
      product_id: item.product_id
    }));
  };

  // Функция определения статуса на основе количества
  const getStatus = (quantity) => {
    if (quantity === 0) return 'out_of_stock';
    if (quantity < 5) return 'low_stock';
    return 'in_stock';
  };

  const handleUpdateInventory = async (updatedInventory) => {
    try {
      for (const item of updatedInventory) {
        await updateData(item.id, {
          quantity: item.quantity,
          location: item.location,
          status: getStatus(item.quantity)
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

  // Форматируем данные перед использованием и добавляем проверку
  const inventory = formatInventoryData(inventoryData) || [];

  // Проверяем наличие данных перед сортировкой
  const sortedInventory = React.useMemo(() => {
    if (!inventory || !Array.isArray(inventory)) return [];
    
    return [...inventory].sort((a, b) => {
      if (a.status === 'out_of_stock' && b.status !== 'out_of_stock') return 1;
      if (a.status !== 'out_of_stock' && b.status === 'out_of_stock') return -1;
      return 0;
    });
  }, [inventory]);

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
              {sortedInventory?.map(item => (
                <tr 
                  key={item.id} 
                  className={`border-t ${
                    item.status === 'out_of_stock' ? 'bg-gray-50 text-gray-500' : ''
                  }`}
                >
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

    // Мобильное представление
    return (
      <div className="space-y-4">
        <button 
          onClick={() => {/* Здесь будет логика добавления */}}
          className="fixed bottom-20 right-4 md:bottom-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <Plus size={24} />
        </button>

        {sortedInventory?.map(item => (
          <div 
            key={item.id} 
            className={`bg-white p-4 rounded-lg shadow-sm ${
              item.status === 'out_of_stock' ? 'opacity-60' : ''
            }`}
          >
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

            {/* Улучшенный ввод количества без стрелок */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm text-gray-600 block mb-2">оличество:</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 0;
                  handleUpdateInventory([{
                    ...item,
                    quantity: newQuantity,
                    status: getStatus(newQuantity)
                  }]);
                }}
                className="w-full p-4 text-2xl font-bold text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <div className="text-center mt-2 text-sm text-gray-500">
                штук
              </div>
            </div>

            {item.quantity < 5 && item.quantity > 0 && (
              <div className="mt-3 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                Мало товара (меньше 5 шт.)
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
        return <InventoryView />;
    }
  };

  if (loading) return <div className="p-4">Загрузка данных...</div>;
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      {mode === 'inventory' && (
        <div className="bg-white p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Package className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold">Склад</h1>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={20} className="mr-1" />
                <span className="hidden md:inline">Добавить товар</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setMode('revision')}
              >
                <ClipboardCheck size={20} className="mr-1" />
                <span className="hidden md:inline">Ревизия</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setMode('history')}
              >
                <History size={20} className="mr-1" />
                <span className="hidden md:inline">История</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className={mode === 'inventory' ? "p-4" : ""}>
        {renderContent()}
      </div>

      {/* Метрики внизу страницы */}
      {mode === 'inventory' && sortedInventory.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:bottom-0 bottom-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Всего позиций</div>
                <div className="text-lg font-bold">{sortedInventory.length}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Стоимость склада</div>
                <div className="text-lg font-bold text-green-500">
                  {sortedInventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()} ₸
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Последняя ревизия</div>
                <div className="text-lg font-bold">{new Date('2024-03-21').toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Новый товар</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <Input
                type="text"
                placeholder="Название товара"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Себестоимость"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Наценка %"
                    value={newProduct.markup}
                    onChange={(e) => setNewProduct({ ...newProduct, markup: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Количество"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Место на складе"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="w-full"
                >
                  <ImageIcon size={16} className="mr-1" />
                  {newProduct.photoPreview ? 'Изменить фото' : 'Добавить фото'}
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                {newProduct.photoPreview && (
                  <img
                    src={newProduct.photoPreview}
                    alt="Preview"
                    className="mt-2 rounded-lg w-full h-48 object-cover"
                  />
                )}
              </div>
            </div>

            <div className="p-4 border-t flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Здесь будет логика сохранения
                  console.log('Новый товар:', {
                    ...newProduct,
                    finalPrice
                  });
                  setShowAddModal(false);
                }}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage; 