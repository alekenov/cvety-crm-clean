import React, { useState } from 'react';
import PageLayout, { PageHeader, PageSection } from '../../components/layout/PageLayout/PageLayout';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import { Calendar, ChevronDown, ChevronRight, Clock, AlertCircle, Package, Truck } from 'lucide-react';
import Badge from '../../components/ui/Badge/Badge';

function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [expandedGroups, setExpandedGroups] = useState(['active', 'completed', 'alerts']);

  // Добавим уведомления
  const alerts = [
    { id: 1, type: 'urgent', message: 'Срочный заказ №103800 требует подтверждения', time: '5 мин назад' },
    { id: 2, type: 'stock', message: 'Заканчиваются розы Red Naomi (осталось 20 шт)', time: '30 мин назад' },
    { id: 3, type: 'delivery', message: 'Ожидается поставка в 16:00', time: '2 часа назад' }
  ];

  // Добавим иконки для типов уведомлений
  const alertTypeIcons = {
    urgent: <AlertCircle className="text-red-500" size={20} />,
    stock: <Package className="text-orange-500" size={20} />,
    delivery: <Truck className="text-blue-500" size={20} />
  };

  // Добавим функцию переключения групп
  const toggleGroup = (group) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  // Добавим заголовок страницы
  const header = (
    <PageHeader title="Главная">
      <div className="flex items-center space-x-3">
        <div className="flex rounded-lg border overflow-hidden">
          <button 
            onClick={() => setSelectedPeriod('today')}
            className={`px-4 py-2 ${selectedPeriod === 'today' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Сегодня
          </button>
          <button 
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 ${selectedPeriod === 'week' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Неделя
          </button>
          <button 
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 ${selectedPeriod === 'month' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Месяц
          </button>
        </div>
        <Button variant="secondary" icon={<Calendar size={20} />} />
      </div>
    </PageHeader>
  );

  // Добавим данные заказов
  const orders = {
    active: [
      {
        id: '103800',
        time: '15:00-16:00',
        status: 'Новый',
        statusColor: 'text-red-500',
        client: 'Айым',
        phone: '+7 (777) 123-45-67',
        address: 'ул. Абая 1, кв. 23',
        items: 'Букет из 15 белых роз',
        price: 15000,
        urgent: true
      },
      {
        id: '103799',
        time: '14:30-15:30',
        status: 'В работе',
        statusColor: 'text-yellow-500',
        client: 'Мария',
        phone: '+7 (777) 234-56-78',
        address: 'пр. Достык 5, офис 301',
        items: 'Букет "Весеннее настроение"',
        price: 12500
      }
    ],
    completed: [
      {
        id: '103798',
        time: '12:00-13:00',
        status: 'Доставлен',
        statusColor: 'text-green-500',
        client: 'Елена',
        phone: '+7 (777) 345-67-89',
        address: 'ул. Жандосова 58А, кв. 12',
        items: 'Букет из 25 красных роз',
        price: 25000
      }
    ]
  };

  const stats = {
    today: {
      revenue: 126500,
      orders: 8,
      completed: 5,
      average: 15800
    }
  };

  // Мобильная версия
  const MobileView = () => (
    <div className="sm:hidden bg-gray-100 min-h-screen">
      {/* Заголовок */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Главная</h1>
          <button className="p-2 bg-gray-100 rounded-lg">
            <Calendar size={20} />
          </button>
        </div>

        {/* Переключатель периода */}
        <div className="flex rounded-lg border overflow-x-auto">
          <button 
            onClick={() => setSelectedPeriod('today')}
            className={`flex-1 py-2 whitespace-nowrap px-4 ${
              selectedPeriod === 'today' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Сегодня
          </button>
          <button 
            onClick={() => setSelectedPeriod('week')}
            className={`flex-1 py-2 whitespace-nowrap px-4 ${
              selectedPeriod === 'week' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Неделя
          </button>
          <button 
            onClick={() => setSelectedPeriod('month')}
            className={`flex-1 py-2 whitespace-nowrap px-4 ${
              selectedPeriod === 'month' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Месяц
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Продажи</div>
          <div className="text-xl font-bold">{stats.today.revenue.toLocaleString()} ₸</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Заказы</div>
          <div className="text-xl font-bold">{stats.today.orders}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Выполнено</div>
          <div className="text-xl font-bold">{stats.today.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Средний чек</div>
          <div className="text-xl font-bold">{stats.today.average.toLocaleString()} ₸</div>
        </div>
      </div>

      {/* Активные заказы */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow mb-4">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleGroup('active')}
          >
            <div className="flex items-center">
              <Clock size={20} className="mr-2" />
              <span className="font-medium">Активные заказы</span>
              <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-sm">
                {orders.active.length}
              </span>
            </div>
            {expandedGroups.includes('active') ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          
          {expandedGroups.includes('active') && (
            <div className="border-t">
              {orders.active.map(order => (
                <div key={order.id} className="p-4 border-b last:border-b-0">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">№{order.id}</span>
                      {order.urgent && (
                        <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">
                          Срочно
                        </span>
                      )}
                    </div>
                    <span className={order.statusColor}>{order.status}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium">{order.client}</div>
                      <div className="text-sm text-gray-600">{order.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm">{order.items}</div>
                      <div className="text-sm text-gray-600">{order.time}</div>
                    </div>
                    <div className="text-right font-medium">
                      {order.price.toLocaleString()} ₸
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Уведомления */}
        <div className="bg-white rounded-lg shadow">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleGroup('alerts')}
          >
            <span className="font-medium">Уведомления</span>
            {expandedGroups.includes('alerts') ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          
          {expandedGroups.includes('alerts') && (
            <div className="border-t">
              {alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className="p-4 border-b last:border-b-0 flex items-start"
                >
                  <div className="mr-3 mt-0.5">
                    {alertTypeIcons[alert.type]}
                  </div>
                  <div>
                    <div className="text-sm">{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout header={header}>
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Продажи</div>
          <div className="text-2xl font-bold">{stats.today.revenue.toLocaleString()} ₸</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Всего заказов</div>
          <div className="text-2xl font-bold">{stats.today.orders}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Выполнено</div>
          <div className="text-2xl font-bold">{stats.today.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Средний чек</div>
          <div className="text-2xl font-bold">{stats.today.average.toLocaleString()} ₸</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <PageSection 
            title="Активные заказы" 
            actions={<Badge variant="primary">{orders.active.length}</Badge>}
          >
            {orders.active.map(order => (
              <div key={order.id} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">№{order.id}</span>
                    {order.urgent && (
                      <Badge variant="danger" className="ml-2">Срочно</Badge>
                    )}
                  </div>
                  <Badge variant={order.status === 'Новый' ? 'danger' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="font-medium">{order.client}</div>
                    <div className="text-sm text-gray-600">{order.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm">{order.items}</div>
                    <div className="text-sm text-gray-600">{order.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{order.price.toLocaleString()} ₸</div>
                  </div>
                </div>
              </div>
            ))}
          </PageSection>
          
          <PageSection title="Выполненные заказы">
            {orders.completed.map(order => (
              <div key={order.id} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">№{order.id}</span>
                  <Badge variant="success">{order.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="font-medium">{order.client}</div>
                    <div className="text-sm text-gray-600">{order.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm">{order.items}</div>
                    <div className="text-sm text-gray-600">{order.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{order.price.toLocaleString()} ₸</div>
                  </div>
                </div>
              </div>
            ))}
          </PageSection>
        </div>
        
        <PageSection title="Важные уведомления">
          {/* ... уведомления ... */}
        </PageSection>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;