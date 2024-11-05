import React, { useState, useEffect } from 'react';
import { Package, Search, Save, ArrowLeft, AlertCircle } from 'lucide-react';

const RevisionMode = ({ inventory, onComplete, onBack }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'match': return 'text-green-600 bg-green-50';
      case 'excess': return 'text-blue-600 bg-blue-50';
      case 'shortage': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredItems = revisionItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = revisionItems.filter(item => item.actual !== null).length;
  const progress = (completedCount / revisionItems.length) * 100;
  const { shortage, excess } = getTotalDifference();

  const DesktopView = () => (
    <div className="space-y-4">
      {/* Прогресс и итоги в одном ряду */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4">
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

        {(shortage > 0 || excess > 0) && (
          <div className="bg-white rounded-lg p-4">
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

      {/* Таблица товаров */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Наименование</th>
              <th className="p-4 text-right">По учету</th>
              <th className="p-4 text-right">Фактически</th>
              <th className="p-4 text-right">Разница</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const status = getItemStatus(item);
              return (
                <tr key={item.id} className="border-t">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 text-right">{item.expected} шт</td>
                  <td className="p-4 text-right">
                    <input
                      type="number"
                      value={item.actual === null ? '' : item.actual}
                      onChange={(e) => handleActualChange(item.id, e.target.value)}
                      className="w-24 p-2 border rounded text-right"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-4 text-right">
                    {item.difference !== null && (
                      <span className={getStatusColor(status)}>
                        {item.difference > 0 ? '+' : ''}{item.difference} шт
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
  );

  const MobileView = () => (
    <div className="space-y-4">
      {/* Прогресс */}
      <div className="bg-white rounded-lg p-4">
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
        <div className="bg-white rounded-lg p-4">
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
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    По учету: {item.expected} шт
                  </p>
                </div>
                <div className="text-right">
                  <input
                    type="number"
                    value={item.actual === null ? '' : item.actual}
                    onChange={(e) => handleActualChange(item.id, e.target.value)}
                    placeholder="0"
                    className="w-20 p-2 border rounded text-right"
                  />
                  <span className="text-sm text-gray-500 ml-1">шт</span>
                </div>
              </div>
              
              {item.actual !== null && (
                <div className={`flex justify-between items-center px-2 py-1 rounded ${statusColor}`}>
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

  return (
    <div className={isDesktop ? "p-6" : "max-w-md mx-auto p-4"}>
      {/* Шапка */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-2">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold">Ревизия склада</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSearch(!showSearch)} 
            className="p-2 bg-white rounded-lg"
          >
            <Search size={20} className="text-gray-600" />
          </button>
          <button 
            onClick={() => onComplete(revisionItems)}
            className="p-2 bg-green-500 text-white rounded-lg flex items-center"
          >
            <Save size={20} className="mr-1" />
            <span>Сохранить</span>
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

      {/* Основной контент */}
      {isDesktop ? <DesktopView /> : <MobileView />}
    </div>
  );
};

export default RevisionMode;