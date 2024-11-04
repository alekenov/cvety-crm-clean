import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Search, Filter, Plus, 
  Edit2, MessageCircle, Phone, Clock, Calendar, MapPin 
} from 'lucide-react';

function OrdersPage() {
  const [expandedGroups, setExpandedGroups] = useState(['today', 'tomorrow']);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Пример данных заказов
  const orders = {
    today: [
      {
        id: 1,
        number: "2311-001",
        client: {
          name: "Айгуль",
          phone: "+7 (777) 123-45-67"
        },
        items: [
          { name: "Букет 'Нежность'", price: 15000 },
          { name: "Открытка", price: 500 }
        ],
        total: 15500,
        delivery: {
          time: "14:00-16:00",
          address: "ул. Абая 150, кв 25",
          status: "pending"
        },
        status: "new",
        payment: "paid"
      },
      {
        id: 2,
        number: "2311-002",
        client: {
          name: "Мария",
          phone: "+7 (777) 234-56-78"
        },
        items: [
          { name: "25 красных роз", price: 22500 }
        ],
        total: 22500,
        delivery: {
          time: "16:00-18:00",
          address: "пр. Достык 89",
          status: "delivering"
        },
        status: "processing",
        payment: "pending"
      }
    ],
    tomorrow: [
      {
        id: 3,
        number: "2311-003",
        client: {
          name: "Анара",
          phone: "+7 (777) 345-67-89"
        },
        items: [
          { name: "Букет 'Летнее настроение'", price: 12000 }
        ],
        total: 12000,
        delivery: {
          time: "10:00-12:00",
          address: "ул. Жандосова 58",
          status: "scheduled"
        },
        status: "confirmed",
        payment: "paid"
      }
    ],
    later: [
      {
        id: 4,
        number: "2311-004",
        client: {
          name: "Динара",
          phone: "+7 (777) 456-78-90"
        },
        items: [
          { name: "Композиция 'Рассвет'", price: 35000 }
        ],
        total: 35000,
        delivery: {
          date: "2023-11-10",
          time: "12:00-14:00",
          address: "ул. Тимирязева 42",
          status: "scheduled"
        },
        status: "confirmed",
        payment: "paid"
      }
    ]
  };

  const groupTitles = {
    today: 'Сегодня, 2 ноября',
    tomorrow: 'Завтра, 3 ноября',
    later: 'Будущие заказы'
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusNames = {
    new: 'Новый',
    processing: 'В обработке',
    confirmed: 'Подтвержден',
    completed: 'Выполнен',
    cancelled: 'Отменен'
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  // Мобильная версия
  const MobileView = () => (
    <div className="sm:hidden bg-gray-100 min-h-screen">
      {/* Заголовок */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Заказы</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Search size={20} />
            </button>
            <button className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск заказов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button className="p-2 bg-gray-100 rounded-lg">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Список заказов */}
      <div className="p-4">
        {Object.entries(orders).map(([group, groupOrders]) => (
          <div key={group} className="mb-4">
            <div 
              className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-2 cursor-pointer"
              onClick={() => toggleGroup(group)}
            >
              {expandedGroups.includes(group) ? (
                <ChevronDown size={20} className="mr-2" />
              ) : (
                <ChevronRight size={20} className="mr-2" />
              )}
              <span className="font-medium">{groupTitles[group]}</span>
              <span className="ml-2 text-gray-500">({groupOrders.length})</span>
            </div>

            {expandedGroups.includes(group) && groupOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 mb-2">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">№{order.number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[order.status]}`}>
                        {statusNames[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.client.name}</p>
                  </div>
                  <span className="font-medium">{order.total.toLocaleString()} ₸</span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    {order.delivery.time}
                  </div>
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-2 mt-1" />
                    {order.delivery.address}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => window.location.href = `tel:${order.client.phone}`}
                    className="flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex-1 mr-2"
                  >
                    <Phone size={16} className="mr-1" />
                    Позвонить
                  </button>
                  <button
                    onClick={() => window.open(`https://wa.me/${order.client.phone.replace(/[^0-9]/g, '')}`)}
                    className="flex items-center justify-center py-2 px-4 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex-1"
                  >
                    <MessageCircle size={16} className="mr-1" />
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Десктопная версия
  const DesktopView = () => (
    <div className="hidden sm:block min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Верхняя панель */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">Заказы</div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск заказов"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button className="p-2 bg-gray-100 rounded-lg">
              <Calendar size={20} />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg">
              <Filter size={20} />
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center">
              <Plus size={20} className="mr-2" />
              Новый заказ
            </button>
          </div>
        </div>

        {/* Таблица заказов */}
        <div className="bg-white rounded-lg shadow">
          {/* Заголовок таблицы */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium">
            <div className="col-span-2">Номер</div>
            <div className="col-span-3">Клиент</div>
            <div className="col-span-3">Доставка</div>
            <div className="col-span-2 text-right">Сумма</div>
            <div className="col-span-2 text-right">Действия</div>
          </div>

          {/* Группы заказов */}
          {Object.entries(orders).map(([group, groupOrders]) => (
            <div key={group}>
              <div 
                className="p-4 bg-gray-100 border-b flex items-center cursor-pointer"
                onClick={() => toggleGroup(group)}
              >
                {expandedGroups.includes(group) ? (
                  <ChevronDown size={20} className="mr-2" />
                ) : (
                  <ChevronRight size={20} className="mr-2" />
                )}
                <span className="font-medium">{groupTitles[group]}</span>
                <span className="ml-2 text-gray-500">({groupOrders.length})</span>
              </div>

              {expandedGroups.includes(group) && groupOrders.map(order => (
                <div 
                  key={order.id} 
                  className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50"
                >
                  <div className="col-span-2">
                    <div className="font-medium">№{order.number}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${statusColors[order.status]}`}>
                      {statusNames[order.status]}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div className="font-medium">{order.client.name}</div>
                    <div className="text-sm text-gray-500">{order.client.phone}</div>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2" />
                      {order.delivery.time}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{order.delivery.address}</div>
                  </div>
                  <div className="col-span-2 text-right font-medium">
                    {order.total.toLocaleString()} ₸
                  </div>
                  <div className="col-span-2 text-right">
                    <button 
                      onClick={() => window.location.href = `tel:${order.client.phone}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Позвонить"
                    >
                      <Phone size={20} />
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/${order.client.phone.replace(/[^0-9]/g, '')}`)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="WhatsApp"
                    >
                      <MessageCircle size={20} />
                    </button>
                    <button 
                      onClick={() => setEditingOrder(order)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      title="Редактировать"
                    >
                      <Edit2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}

export default OrdersPage; 