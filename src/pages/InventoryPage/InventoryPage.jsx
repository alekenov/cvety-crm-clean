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
  Box, 
  History,
  Wallet,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { H1, H3, Body, Caption } from '@/components/ui/Typography';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';
import TypeFilter from '@/components/Filters/TypeFilter';
import RevisionMode from './components/RevisionMode';
import HistoryMode from './components/HistoryMode';
import toast from 'react-hot-toast';

const showToast = {
  success: (message) => toast.success(message, { duration: 3000 }),
  error: (message) => toast.error(message, { duration: 3000 }),
  loading: (message) => toast.loading(message),
};

const InventoryPage = () => {
  const [mode, setMode] = useState('inventory'); // 'inventory', 'revision', 'history'
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  
  // Состояния для фильтров
  const [selectedType, setSelectedType] = useState(null);
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in_stock', 'low_stock', 'out_of_stock'

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

  const { data: inventoryData, loading, error, updateData } = useSupabase('inventory', {
    select: '*'
  });

  // Фильтрация данных
  const filteredInventoryData = useMemo(() => {
    if (!inventoryData) return [];
    
    let filtered = inventoryData;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по типу
    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Фильтр по статусу наличия
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'in_stock':
          filtered = filtered.filter(item => item.stock > 0);
          break;
        case 'low_stock':
          filtered = filtered.filter(item => item.stock <= item.min_stock && item.stock > 0);
          break;
        case 'out_of_stock':
          filtered = filtered.filter(item => item.stock === 0);
          break;
      }
    }

    return filtered;
  }, [inventoryData, searchQuery, selectedType, stockFilter]);

  // Компонент фильтров
  const FiltersSection = () => (
    <div className="space-y-6 mb-6">
      <TypeFilter value={selectedType} onChange={setSelectedType} />
      
      <FilterGroup icon={Box} title="Фильтр по наличию">
        <FilterButton
          active={stockFilter === 'all'}
          onClick={() => setStockFilter('all')}
        >
          Все товары
        </FilterButton>
        <FilterButton
          active={stockFilter === 'in_stock'}
          onClick={() => setStockFilter('in_stock')}
          variant="success"
        >
          В наличии
        </FilterButton>
        <FilterButton
          active={stockFilter === 'low_stock'}
          onClick={() => setStockFilter('low_stock')}
          variant="danger"
        >
          Заканчивается
        </FilterButton>
        <FilterButton
          active={stockFilter === 'out_of_stock'}
          onClick={() => setStockFilter('out_of_stock')}
          variant="danger"
        >
          Нет в наличии
        </FilterButton>
      </FilterGroup>
    </div>
  );

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
      name: item.name,
      quantity: item.stock,
      price: item.price,
      min_quantity: item.min_stock,
      location: '',
      status: getStatus(item.stock, item.min_stock),
      type: item.type,
      unit: item.unit
    }));
  };

  // Функция определения статуса на основе количества
  const getStatus = (quantity, minQuantity) => {
    if (quantity === 0) return 'out_of_stock';
    if (quantity <= minQuantity) return 'low_stock';
    return 'in_stock';
  };

  const handleUpdateInventory = async (updatedInventory) => {
    const loadingToast = showToast.loading('Обновление количества...');
    try {
      for (const item of updatedInventory) {
        await updateData(item.id, {
          stock: item.quantity,
          location: item.location,
          status: getStatus(item.quantity, item.min_quantity)
        });
      }
      showToast.success('Количество успешно обновлено');
    } catch (err) {
      console.error('Error updating inventory:', err);
      showToast.error('Ошибка при обновлении количества');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить позицию?')) {
      try {
        await updateData(id, { active: false });
        showToast.success('Позиция успешно удалена');
      } catch (err) {
        console.error('Error deleting item:', err);
        showToast.error('Ошибка при удалении позиции');
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
              <Body size="sm" className="text-gray-500">Всего позиций</Body>
              <Body size="xl" className="font-bold">{stats.totalItems}</Body>
            </div>
            <Box className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Body size="sm" className="text-gray-500">Стоимость склада</Body>
              <Body size="xl" className="font-bold text-green-500">{stats.totalValue.toLocaleString()} ₸</Body>
            </div>
            <Wallet className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Body size="sm" className="text-gray-500">Последняя ревизия</Body>
              <Body size="xl" className="font-bold">{new Date(stats.lastRevisionDate).toLocaleDateString()}</Body>
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
                <th className="px-4 py-3 text-left">Тип</th>
                <th className="px-4 py-3 text-right">Количество</th>
                <th className="px-4 py-3 text-right">Цена</th>
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
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3 text-right">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3 text-right">{item.price.toLocaleString()} ₸/{item.unit}</td>
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
            <div className="flex items-center justify-between mb-2">
              <div>
                <H3 className="font-medium">{item.name}</H3>
                <Body size="sm" className="text-gray-500">{item.type} • {item.price.toLocaleString()} ₸/{item.unit}</Body>
              </div>
              <Caption className={`inline-block px-2 py-1 rounded-full ${
                item.status === 'in_stock' 
                  ? 'bg-green-100 text-green-800' 
                  : item.status === 'low_stock'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.status === 'in_stock' ? 'В наличии' :
                 item.status === 'low_stock' ? 'Заканчивается' :
                 'Нет в наличии'}
              </Caption>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <Body size="sm">Локация: {item.location}</Body>
            </div>

            {/* Улучшенный ввод количества без стрелок */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Body size="sm" className="text-gray-600 block mb-2">Количество:</Body>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 0;
                  handleUpdateInventory([{
                    ...item,
                    quantity: newQuantity,
                    status: getStatus(newQuantity, item.min_quantity)
                  }]);
                }}
                className="w-full p-4 text-2xl font-bold text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <Body size="sm" className="text-center mt-2 text-gray-500">
                штук
              </Body>
            </div>

            {item.quantity < item.min_quantity && item.quantity > 0 && (
              <Body size="sm" className="mt-3 text-yellow-600 bg-yellow-50 p-2 rounded">
                Мало товара (меньше {item.min_quantity} шт.)
              </Body>
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <H1>Инвентарь</H1>
        <div className="flex gap-4">
          <Button
            variant={mode === 'inventory' ? 'default' : 'outline'}
            onClick={() => setMode('inventory')}
          >
            <Package className="mr-2 h-4 w-4" />
            Инвентарь
          </Button>
          <Button
            variant={mode === 'revision' ? 'default' : 'outline'}
            onClick={() => setMode('revision')}
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Ревизия
          </Button>
          <Button
            variant={mode === 'history' ? 'default' : 'outline'}
            onClick={() => setMode('history')}
          >
            <History className="mr-2 h-4 w-4" />
            История
          </Button>
        </div>
      </div>

      {mode === 'inventory' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowSearch(!showSearch)}>
                <Search className="h-4 w-4" />
              </Button>
              {showSearch && (
                <Input
                  type="text"
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              )}
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить товар
            </Button>
          </div>

          <FiltersSection />

          {/* Таблица или список товаров */}
          <InventoryView />

          {/* Метрики внизу страницы */}
          {sortedInventory.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:bottom-0 bottom-16">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Body size="sm" className="text-gray-500">Всего позиций</Body>
                    <Body size="lg" className="font-bold">{sortedInventory.length}</Body>
                  </div>
                  <div className="text-center">
                    <Body size="sm" className="text-gray-500">Стоимость склада</Body>
                    <Body size="lg" className="font-bold text-green-500">
                      {sortedInventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()} ₸
                    </Body>
                  </div>
                  <div className="text-center">
                    <Body size="sm" className="text-gray-500">Последняя ревизия</Body>
                    <Body size="lg" className="font-bold">{new Date('2024-03-21').toLocaleDateString()}</Body>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {mode === 'revision' && (
        <RevisionMode
          items={revisionItems}
          onSave={(items) => {
            setRevisionItems(items);
            showToast.success('Ревизия сохранена');
          }}
        />
      )}

      {mode === 'history' && (
        <HistoryMode
          items={historyItems}
          filter={historyFilter}
          onFilterChange={setHistoryFilter}
        />
      )}

      {/* Модальное окно */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <H3 className="font-semibold">Новый товар</H3>
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