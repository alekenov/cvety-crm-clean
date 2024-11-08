import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  Receipt,
  Share,
  Trash
} from 'lucide-react';

const FinancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showNewOperation, setShowNewOperation] = useState(false);

  // Расширенный список транзакций
  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: 25000,
      category: 'Продажа',
      date: '2024-03-20 15:30',
      description: 'Букет "Нежность"',
      paymentMethod: 'kaspi',
      receipt: true,
      operator: 'Анна'
    },
    {
      id: 2,
      type: 'expense',
      amount: 15000,
      category: 'Закуп цветов',
      date: '2024-03-20 12:00',
      description: 'Розы Freedom 50 шт',
      paymentMethod: 'cash',
      receipt: true,
      operator: 'Мария'
    },
    {
      id: 3,
      type: 'expense',
      amount: 1500,
      category: 'Курьер',
      date: '2024-03-20 14:30',
      description: '3 доставки',
      paymentMethod: 'cash',
      operator: 'Мария'
    },
    {
      id: 4,
      type: 'expense',
      amount: 3500,
      category: 'Списание',
      date: '2024-03-20 18:00',
      description: '10 роз (брак)',
      operator: 'Анна'
    },
    {
      id: 5,
      type: 'expense',
      amount: 5000,
      category: 'Материалы',
      date: '2024-03-20 11:00',
      description: 'Ленты и бумага',
      paymentMethod: 'cash',
      receipt: true,
      operator: 'Мария'
    },
    {
      id: 6,
      type: 'income',
      amount: 18000,
      category: 'Продажа',
      date: '2024-03-20 16:45',
      description: 'Букет "Весенний"',
      paymentMethod: 'card',
      receipt: true,
      operator: 'Анна'
    }
  ];

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="card">
          {/* Верхняя статистика */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Основная информация */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Финансы</h1>
                <div className="flex space-x-3">
                  <button 
                    className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => alert('Отправить отчет')}
                  >
                    <Share size={22} className="text-gray-600" />
                  </button>
                  <button 
                    className="p-2.5 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition-colors"
                    onClick={() => setShowNewOperation(!showNewOperation)}
                  >
                    <Plus size={22} />
                  </button>
                </div>
              </div>

              <div className="periodSelector">
                {['today', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    className={`${
                      selectedPeriod === period 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    } p-2.5 rounded-lg mr-2`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === 'today' && 'Сегодня'}
                    {period === 'week' && 'Неделя'}
                    {period === 'month' && 'Месяц'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Доход</p>
                  <p className="text-2xl font-bold text-green-600">+45 000 ₸</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Расход</p>
                  <p className="text-2xl font-bold text-red-600">-15 000 ₸</p>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная статистика */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold mb-4">Статистика</h2>
            {/* Здесь можно добавить графики или дополнительную статистику */}
          </div>

          {/* История операций */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">История операций</h2>
              <div className="flex gap-4">
                <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <Calendar size={16} />
                  Фильтр по дате
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <Trash size={16} />
                  Очистить
                </button>
              </div>
            </div>
            
            {transactions.map(transaction => (
              <div key={transaction.id} className="p-6 border-b hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className={`flex items-center ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUp size={18} className="mr-2" />
                      ) : (
                        <ArrowDown size={18} className="mr-2" />
                      )}
                      <span className="text-lg font-medium">
                        {transaction.type === 'income' ? '+' : '-'}
                        {transaction.amount.toLocaleString()} ₸
                      </span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">{transaction.category}</span>
                      {transaction.description && (
                        <span className="text-gray-500"> • {transaction.description}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-sm text-gray-400">
                      {new Date(transaction.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {transaction.paymentMethod && (
                      <div className="flex items-center justify-end mt-2 gap-2">
                        {transaction.paymentMethod === 'kaspi' && 
                          <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">Kaspi</span>
                        }
                        {transaction.paymentMethod === 'cash' && 
                          <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Наличные</span>
                        }
                        {transaction.paymentMethod === 'card' && 
                          <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full">Карта</span>
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <div className="mr-6">Оператор: {transaction.operator}</div>
                  {transaction.receipt && 
                    <div className="flex items-center text-blue-500 cursor-pointer hover:text-blue-600">
                      <Receipt size={14} className="mr-1" />
                      Посмотреть чек
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;