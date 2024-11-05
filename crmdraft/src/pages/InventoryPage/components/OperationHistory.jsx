import React, { useState } from 'react';
import { Package, Search, ArrowDown, ArrowUp, Calendar, Filter, History, Box, Trash, FileText, User, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function OperationHistory({ history }) {
  const [selectedOperation, setSelectedOperation] = useState('all');

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

  const OperationCard = ({ operation }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <div className={`flex items-center ${getOperationColor(operation.type)}`}>
              {getOperationIcon(operation.type)}
              <span className="ml-2 font-medium">
                {operation.type === 'in' ? 'Приемка' : operation.type === 'out' ? 'Продажа' : 'Списание'}
              </span>
            </div>

            <div className="flex items-center mt-2 text-sm text-gray-600">
              <User size={14} className="mr-1" />
              <span>{operation.operator.name}</span>
              <span className="mx-1">•</span>
              <span className="text-gray-400">{operation.operator.role}</span>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(operation.date).toLocaleString()}
            </p>

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

  return (
    <div>
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
        </div>
      </div>

      <div className="space-y-2">
        {history
          .filter(operation => selectedOperation === 'all' || operation.type === selectedOperation)
          .map(operation => (
            <OperationCard key={operation.id} operation={operation} />
          ))
        }
      </div>
    </div>
  );
} 