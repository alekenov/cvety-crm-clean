import React, { useState } from 'react';
import { Package, Search, ArrowDown, ArrowUp, Calendar, Filter, History, Box, Trash, FileText, User, ExternalLink, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const HistoryMode = ({ onBack }) => {
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('today');

  // Тестовые данные истории операций
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
        },
        {
          id: 3,
          name: 'Гипсофила',
          quantity: 3,
          price: 450
        },
        {
          id: 4,
          name: 'Эвкалипт',
          quantity: 5,
          price: 350
        }
      ]
    },
    {
      id: 3,
      type: 'writeoff',
      date: '2024-03-20 18:20',
      comment: 'Списание брака',
      operator: {
        id: 3,
        name: 'Алия',
        role: 'Старший флорист'
      },
      items: [
        { 
          id: 1,
          name: 'Freedom',
          quantity: 15,
          price: 400,
          reason: 'Поврежденные стебли'
        }
      ]
    },
    {
      id: 4,
      type: 'out',
      date: '2024-03-21 11:15',
      comment: 'Продажа (Букет "Весенний")',
      operator: {
        id: 2,
        name: 'Мария',
        role: 'Менеджер'
      },
      order: {
        id: '1235',
        name: 'Букет "Весенний"',
        client: 'Динара',
        status: 'В доставке',
        price: 18000,
      },
      items: [
        { 
          id: 5,
          name: 'Тюльпаны',
          quantity: 19,
          price: 450
        },
        {
          id: 6,
          name: 'Нарциссы',
          quantity: 7,
          price: 380
        }
      ]
    }
  ]);

  // Вспомогательные функции
  const getOperationColor = (type) => {
    switch(type) {
      case 'in': return 'text-green-600';
      case 'out': return 'text-blue-600';
      case 'writeoff': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOperationIcon = (type) => {
    switch(type) {
      case 'in': return <ArrowDown size={16} />;
      case 'out': return <ArrowUp size={16} />;
      case 'writeoff': return <Trash size={16} />;
      default: return null;
    }
  };

  // Компонент карточки операции
  const OperationCard = ({ operation }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            {/* Тип операции */}
            <div className={`flex items-center ${getOperationColor(operation.type)}`}>
              {getOperationIcon(operation.type)}
              <span className="ml-2 font-medium">
                {operation.type === 'in' ? 'Приемка' : operation.type === 'out' ? 'Продажа' : 'Списание'}
              </span>
            </div>

            {/* Оператор */}
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <User size={14} className="mr-1" />
              <span>{operation.operator.name}</span>
              <span className="mx-1">•</span>
              <span className="text-gray-400">{operation.operator.role}</span>
            </div>

            {/* Время */}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(operation.date).toLocaleString()}
            </p>

            {/* Состав */}
            <div className="mt-3">
              {operation.items.length === 1 ? (
                <div className="font-bold">
                  {operation.type === 'in' ? '+' : '-'}{operation.items[0].quantity} шт × {operation.items[0].price} ₸
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center text-blue-600"
                  >
                    {showDetails ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        <span className="text-sm">Скрыть состав</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        <span className="text-sm">Показать состав ({operation.items.length})</span>
                      </>
                    )}
                  </button>
                  
                  {showDetails && (
                    <div className="mt-2 space-y-1 bg-gray-50 p-2 rounded-lg">
                      {operation.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="text-gray-600">
                            {item.quantity} шт × {item.price} ₸
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Информация о заказе */}
            {operation.order && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{operation.order.name}</div>
                    <div className="text-sm text-gray-600">
                      Клиент: {operation.order.client}
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Переход к заказу ${operation.order.id}`)}
                    className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm"
                  >
                    Заказ #{operation.order.id}
                    <ExternalLink size={14} className="ml-1" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    operation.order.status === 'Доставлен' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {operation.order.status}
                  </span>
                  <span className="font-bold text-green-600">
                    {operation.order.price.toLocaleString()} ₸
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const isDesktop = window.innerWidth >= 1024;

  // Десктопное представление операции
  const DesktopOperationRow = ({ operation }) => (
    <tr className="border-t">
      <td className="p-4">
        <div className={`flex items-center ${getOperationColor(operation.type)}`}>
          {getOperationIcon(operation.type)}
          <span className="ml-2">
            {operation.type === 'in' ? 'Приемка' : 
             operation.type === 'out' ? 'Продажа' : 'Списание'}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center">
          <User size={14} className="mr-1" />
          <span>{operation.operator.name}</span>
        </div>
      </td>
      <td className="p-4">{new Date(operation.date).toLocaleString()}</td>
      <td className="p-4">
        {operation.items.map(item => (
          <div key={item.id} className="text-sm">
            {item.name}: {item.quantity} шт
          </div>
        ))}
      </td>
      <td className="p-4">
        {operation.order && (
          <button 
            onClick={() => alert(`Переход к заказу ${operation.order.id}`)}
            className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm"
          >
            #{operation.order.id}
            <ExternalLink size={14} className="ml-1" />
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className={isDesktop ? "p-6" : "max-w-md mx-auto p-4"}>
      {/* Шапка */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-2">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold">История склада</h1>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedOperation('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedOperation === 'all' ? 'bg-gray-200' : 'bg-gray-100'
            }`}
          >
            Все операции
          </button>
          <button
            onClick={() => setSelectedOperation('in')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedOperation === 'in' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
            }`}
          >
            Приемка
          </button>
          <button
            onClick={() => setSelectedOperation('out')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedOperation === 'out' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
            }`}
          >
            Продажи
          </button>
          <button
            onClick={() => setSelectedOperation('writeoff')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedOperation === 'writeoff' ? 'bg-red-100 text-red-600' : 'bg-gray-100'
            }`}
          >
            Списания
          </button>
        </div>
      </div>

      {/* Контент */}
      {isDesktop ? (
        // Десктопная версия
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Тип операции</th>
                <th className="p-4 text-left">Оператор</th>
                <th className="p-4 text-left">Дата</th>
                <th className="p-4 text-left">Состав</th>
                <th className="p-4 text-left">Заказ</th>
              </tr>
            </thead>
            <tbody>
              {history
                .filter(operation => selectedOperation === 'all' || operation.type === selectedOperation)
                .map(operation => (
                  <DesktopOperationRow key={operation.id} operation={operation} />
                ))
              }
            </tbody>
          </table>
        </div>
      ) : (
        // Мобильная версия (существующий код)
        <div className="space-y-2">
          {history
            .filter(operation => selectedOperation === 'all' || operation.type === selectedOperation)
            .map(operation => (
              <OperationCard key={operation.id} operation={operation} />
            ))
          }
        </div>
      )}
    </div>
  );
};

export default HistoryMode; 