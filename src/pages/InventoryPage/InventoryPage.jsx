import React, { useState } from 'react';
import { Package, Box, History } from 'lucide-react';
import StockManagement from './components/StockManagement';
import OperationHistory from './components/OperationHistory';

export default function InventoryPage() {
  const [activeView, setActiveView] = useState('stock');
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
    }
  ]);

  const [history, setHistory] = useState([
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

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdateInventory = (newInventory) => {
    setInventory(newInventory);
  };

  const handleAddHistory = (operation) => {
    setHistory([operation, ...history]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Package className="text-blue-500 mr-2" size={24} />
          <h1 className="text-xl font-bold">Управление складом</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveView('stock')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'stock' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <Box size={20} className="mr-2" />
            Склад
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeView === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <History size={20} className="mr-2" />
            История
          </button>
        </div>
      </div>

      {isDesktop ? (
        <div className="grid grid-cols-3 gap-6">
          {activeView === 'stock' && (
            <div className="col-span-3">
              <StockManagement 
                inventory={inventory} 
                onUpdateInventory={handleUpdateInventory}
                onAddHistory={handleAddHistory}
              />
            </div>
          )}
          {activeView === 'history' && (
            <div className="col-span-3">
              <OperationHistory history={history} />
            </div>
          )}
        </div>
      ) : (
        <div>
          {activeView === 'stock' ? (
            <StockManagement 
              inventory={inventory} 
              onUpdateInventory={handleUpdateInventory}
              onAddHistory={handleAddHistory}
            />
          ) : (
            <OperationHistory history={history} />
          )}
        </div>
      )}
    </div>
  );
}