import React, { useState, useEffect } from 'react';
import { Package, Check, X, Save, ArrowLeft, AlertCircle, Search } from 'lucide-react';

const StockRevision = ({ inventory, setInventory, onComplete }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [revisionData, setRevisionData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Добавляем слушатель изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [revisionItems, setRevisionItems] = useState(
    inventory.map(item => ({
      id: item.id,
      name: item.name,
      expected: item.quantity,
      actual: null,
      price: item.price,
      lastRevision: '2024-02-20',
      difference: null
    }))
  );

  const handleActualChange = (id, value) => {
    setRevisionItems(items => items.map(item => {
      if (item.id === id) {
        const actual = value === '' ? null : Number(value);
        const difference = actual === null ? null : actual - item.expected;
        return { ...item, actual, difference };
      }
      return item;
    }));
  };

  const handleSave = () => {
    // Сохраняем изменения в инвентаре
    const updatedInventory = inventory.map(item => ({
      ...item,
      quantity: revisionData[item.id] || item.quantity
    }));
    
    setInventory(updatedInventory);
    
    // Показываем сообщение об успехе
    setShowSuccess(true);
    
    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      setShowSuccess(false);
      onComplete();
    }, 3000);
  };

  const getItemStatus = (item) => {
    if (item.actual === null) return 'pending';
    if (item.actual === item.expected) return 'match';
    return item.actual > item.expected ? 'excess' : 'shortage';
  };

  const getTotalDifference = () => {
    const shortage = revisionItems.reduce((sum, item) => {
      if (item.difference && item.difference < 0) {
        return sum + (item.difference * item.price);
      }
      return sum;
    }, 0);

    const excess = revisionItems.reduce((sum, item) => {
      if (item.difference && item.difference > 0) {
        return sum + (item.difference * item.price);
      }
      return sum;
    }, 0);

    return { shortage: Math.abs(shortage), excess };
  };

  const filteredItems = revisionItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'match': return 'text-green-600 bg-green-50';
      case 'excess': return 'text-blue-600 bg-blue-50';
      case 'shortage': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const { shortage, excess } = getTotalDifference();
  const completedCount = revisionItems.filter(item => item.actual !== null).length;
  const progress = (completedCount / revisionItems.length) * 100;

  const MobileView = () => (
    <div className="h-full bg-gray-100 overflow-y-auto">
      {/* Шапка */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button onClick={onComplete} className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold ml-2">Ревизия склада</h1>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-gray-200 rounded-lg">
            <Search size={20} className="text-gray-600" />
          </button>
          <button 
            onClick={handleSave}
            className="p-2 bg-green-500 text-white rounded-lg"
          >
            <Save size={20} />
          </button>
        </div>
      </div>

      {/* Поиск */}
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Поиск товара..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border"
          />
        </div>
      )}

      {/* Прогресс */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Проверено: {completedCount} из {revisionItems.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Итоги */}
      {(shortage > 0 || excess > 0) && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-medium mb-2">Предварительные итоги:</h3>
          <div className="space-y-2 text-sm">
            {shortage > 0 && (
              <div className="flex justify-between items-center text-red-600">
                <span>Недостача:</span>
                <span>{shortage.toLocaleString()} ₸</span>
              </div>
            )}
            {excess > 0 && (
              <div className="flex justify-between items-center text-blue-600">
                <span>Излишки:</span>
                <span>{excess.toLocaleString()} ₸</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Список товаров */}
      <div className="space-y-2">
        {filteredItems.map(item => {
          const status = getItemStatus(item);
          const statusColor = getStatusColor(status);

          return (
            <div key={item.id} className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    По учету: {item.expected} шт
                  </p>
                </div>
                <div className="text-right">
                  {editingQuantity === item.id ? (
                    <input
                      type="number"
                      value={item.actual === null ? '' : item.actual}
                      onChange={(e) => handleActualChange(item.id, e.target.value)}
                      onBlur={() => setEditingQuantity(null)}
                      className="w-24 p-2 text-xl font-medium border rounded text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => setEditingQuantity(item.id)}
                      className="w-24 p-2 text-xl font-medium text-right cursor-pointer hover:bg-gray-50 rounded"
                    >
                      {item.actual === null ? '—' : `${item.actual} шт`}
                    </div>
                  )}
                </div>
              </div>
              
              {item.actual !== null && (
                <div className={`mt-2 flex justify-between items-center px-2 py-1 rounded ${statusColor}`}>
                  <span className="text-sm">
                    {status === 'match' && 'Совпадает'}
                    {status === 'excess' && `Излишек: +${item.difference} шт`}
                    {status === 'shortage' && `Недостача: ${item.difference} шт`}
                  </span>
                  {(status === 'excess' || status === 'shortage') && (
                    <span className="text-sm font-medium">
                      {Math.abs(item.difference * item.price).toLocaleString()} ₸
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const DesktopView = () => (
    <div className="h-full bg-white rounded-lg shadow-sm overflow-y-auto">
      {/* Шапка */}
      <div className="p-6 border-b flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onComplete} className="mr-4">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold">Ревизия склада</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск товара..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center">
            <Save size={20} className="mr-2" />
            Сохранить
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Прогресс */}
          <div className="col-span-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Проверено: {completedCount} из {revisionItems.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Итоги */}
          <div>
            {(shortage > 0 || excess > 0) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Предварительные итоги:</h3>
                <div className="space-y-2 text-sm">
                  {shortage > 0 && (
                    <div className="flex justify-between items-center text-red-600">
                      <span>Недостача:</span>
                      <span>{shortage.toLocaleString()} ₸</span>
                    </div>
                  )}
                  {excess > 0 && (
                    <div className="flex justify-between items-center text-blue-600">
                      <span>Излишки:</span>
                      <span>{excess.toLocaleString()} ₸</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Таблица товаров */}
        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  По учету
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Фактически
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Разница
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map(item => {
                const status = getItemStatus(item);
                const statusColor = getStatusColor(status);

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.expected} шт
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingQuantity === item.id ? (
                        <input
                          type="number"
                          value={item.actual === null ? '' : item.actual}
                          onChange={(e) => handleActualChange(item.id, e.target.value)}
                          onBlur={() => setEditingQuantity(null)}
                          className="w-24 p-2 text-lg border rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => setEditingQuantity(item.id)}
                          className="w-24 p-2 text-lg text-right cursor-pointer hover:bg-gray-50 rounded"
                        >
                          {item.actual === null ? '—' : `${item.actual} шт`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.actual !== null && (
                        <span className={`inline-flex px-2 py-1 rounded ${statusColor}`}>
                          {status === 'match' && 'Совпадает'}
                          {status === 'excess' && `+${item.difference} шт`}
                          {status === 'shortage' && `${item.difference} шт`}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.difference && (
                        <span className={status === 'shortage' ? 'text-red-600' : 'text-blue-600'}>
                          {Math.abs(item.difference * item.price).toLocaleString()} ₸
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {isDesktop ? <DesktopView /> : <MobileView />}
      
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          Ревизия успешно сохранена и добавлена в историю операций
        </div>
      )}
      
      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
      >
        Сохранить ревизию
      </button>
    </div>
  );
};

export default StockRevision; 