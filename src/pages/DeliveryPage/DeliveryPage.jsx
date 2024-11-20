import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Phone, 
  User, 
  AlertTriangle, 
  Bell, 
  Truck, 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react';
import PageLayout, { 
  PageHeader, 
  PageSection 
} from '../../components/layout/PageLayout/PageLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import toast from 'react-hot-toast';

export default function DeliveryPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);
  const [groupedDeliveries, setGroupedDeliveries] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [showOnlyUrgent, setShowOnlyUrgent] = useState(false);

  const deliveries = [
    {
      id: 1,
      orderNumber: '103800',
      status: 'pending',
      timeWindow: '14:00-15:00',
      address: 'ул. Абая 1, кв. 23',
      area: 'Центр',
      client: { name: 'Айым', phone: '+7 (777) 123-45-67' },
      items: [{ name: 'Букет "Весенний"', quantity: 1 }],
      deliveryCost: 2500,
      distance: '3.2 км',
      isUrgent: true
    },
    {
      id: 2,
      orderNumber: '103801',
      status: 'processing',
      timeWindow: '15:00-16:00',
      address: 'ул. Достык 89, офис 41',
      area: 'Достык',
      client: { name: 'Мария', phone: '+7 (777) 234-56-78' },
      items: [{ name: 'Букет "25 роз"', quantity: 1 }],
      deliveryCost: 3000,
      distance: '5.1 км',
      isUrgent: false
    },
    {
      id: 3,
      orderNumber: '103802',
      status: 'in_transit',
      timeWindow: '15:00-16:00',
      address: 'ул. Самал-2, дом 33',
      area: 'Самал',
      client: { name: 'Елена', phone: '+7 (777) 345-67-89' },
      items: [{ name: 'Букет "Нежность"', quantity: 1 }],
      deliveryCost: 2700,
      distance: '4.2 км',
      isUrgent: true
    },
  ];

  const statusFilters = [
    { id: 'all', label: 'Все статусы' },
    { id: 'pending', label: 'Ожидает' },
    { id: 'processing', label: 'Обработка' },
    { id: 'in_transit', label: 'В пути' },
    { id: 'delivered', label: 'Доставлен' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    pending: 'Ожидает',
    processing: 'Обработка',
    in_transit: 'В пути',
    delivered: 'Доставлен',
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (activeStatus !== 'all' && delivery.status !== activeStatus) return false;
    return true;
  });

  const handleDeliverySelect = (delivery) => {
    setSelectedDeliveries(prev => {
      const isSelected = prev.some(d => d.id === delivery.id);
      if (isSelected) {
        return prev.filter(d => d.id !== delivery.id);
      } else {
        return [...prev, delivery];
      }
    });
  };

  const calculateGroupDeliveryCost = (orders) => {
    if (orders.length <= 1) return orders[0]?.deliveryCost || 0;
    let cost = 2000;
    orders.slice(1).forEach(order => {
      const additionalCost = order.area === 'Центр' ? 700 : 800;
      cost += additionalCost;
    });
    return cost;
  };

  const handleGroupDeliveries = () => {
    if (selectedDeliveries.length >= 2) {
      navigate('/delivery/group', { 
        state: { 
          selectedDeliveries,
          totalCost: calculateGroupDeliveryCost(selectedDeliveries)
        } 
      });
    }
  };

  const handleConfirmGrouping = () => {
    setView('groupingConfirmed');
  };

  const renderDeliveryList = () => (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(status => (
            <button
              key={status.id}
              onClick={() => setActiveStatus(status.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeStatus === status.id 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-20">
        {filteredDeliveries.map(delivery => (
          <div 
            key={delivery.id}
            onClick={() => handleDeliverySelect(delivery)}
            className={`
              bg-white p-4 rounded-lg cursor-pointer transition-all
              ${selectedDeliveries.some(d => d.id === delivery.id) 
                ? 'ring-2 ring-blue-500 bg-blue-50 transform scale-[1.02]' 
                : 'hover:shadow-md hover:transform hover:scale-[1.01]'
              }
            `}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-medium">№{delivery.orderNumber}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusColors[delivery.status]}`}>
                  {statusLabels[delivery.status]}
                </span>
              </div>
              <span className="font-medium">{delivery.deliveryCost} ₸</span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-gray-400" />
                {delivery.timeWindow}
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-gray-400" />
                {delivery.address}
                <span className="ml-1 text-xs text-gray-500">({delivery.distance})</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-400" />
                {delivery.client.name}
              </div>
              <div className="mt-2 text-sm font-medium">
                {delivery.items.map((item, index) => (
                  <span key={index} className="block text-gray-700">
                    {item.name} × {item.quantity}
                  </span>
                ))}
              </div>
            </div>

            {selectedDeliveries.some(d => d.id === delivery.id) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDeliveries.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:bottom-0 bottom-16">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Выбрано заказов: <span className="font-medium">{selectedDeliveries.length}</span>
            </div>
            <button 
              onClick={handleGroupDeliveries}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium hover:bg-blue-600 transition-colors"
            >
              <Truck size={20} className="mr-2" />
              Объединить заказы
              <span className="ml-2 bg-blue-600 px-2 py-1 rounded text-sm">
                {calculateGroupDeliveryCost(selectedDeliveries)} ₸
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );

  const renderGrouping = () => {
    const group = groupedDeliveries[groupedDeliveries.length - 1];
    const totalRegularCost = group.orders.reduce((sum, delivery) => sum + delivery.deliveryCost, 0);
    const groupCost = calculateGroupDeliveryCost(group.orders);
    const savings = totalRegularCost - groupCost;

    return (
      <>
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="font-semibold mb-2">Расчет стоимости</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Обычная стоимость:</span>
              <span className="line-through">{totalRegularCost} ₸</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Групповая доставка:</span>
              <span className="text-primary">{groupCost} ₸</span>
            </div>
            <div className="flex justify-between text-primary">
              <span>Экономия:</span>
              <span>{savings} ₸</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertTriangle size={20} className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium mb-1">Обратите внимание</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Доставки будут объединены в один маршрут</li>
                <li>Курьер заберет все заказы одновременно</li>
                <li>Время доставки может измениться</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {group.orders.map((delivery, index) => (
            <div key={delivery.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-medium mr-2">
                  {index + 1}
                </div>
                <span className="font-medium">Заказ #{delivery.orderNumber}</span>
                {delivery.isUrgent && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Срочно</span>
                )}
              </div>
              <div className="text-sm space-y-1 text-gray-600">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  Примерное время доставки: {delivery.estimatedDeliveryTime}
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {delivery.address}
                </div>
                <div className="flex items-center">
                  <User size={14} className="mr-1" />
                  {delivery.client.name}
                </div>
                <div>{delivery.items[0].name}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirmGrouping}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center"
        >
          <Truck size={20} className="mr-2" />
          Подтвердить объединение
        </button>
      </>
    );
  };

  const renderGroupingConfirmed = () => {
    const group = groupedDeliveries[groupedDeliveries.length - 1];
    const updatedOrders = group.orders.map((order, index) => ({
      ...order,
      status: index === 0 ? 'delivered' : 'in_transit'
    }));

    return (
      <div>
        <div className="bg-green-100 rounded-lg p-4 mb-6">
          <CheckCircle size={24} className="text-green-500 mb-2" />
          <h2 className="text-xl font-bold mb-2">Доставки объединены</h2>
          <p className="text-gray-600">Заказы успешно сгруппированы для доставки</p>
        </div>

        <h3 className="text-lg font-semibold mb-4">Статус заказов:</h3>
        <div className="space-y-4 mb-6">
          {updatedOrders.map((order, index) => (
            <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">Заказ #{order.orderNumber}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                {order.status === 'in_transit' && (
                  <span className="text-sm font-medium">
                    Ожидаемое время: {order.estimatedDeliveryTime}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <div><MapPin size={14} className="inline mr-1" /> {order.address}</div>
                <div><User size={14} className="inline mr-1" /> {order.client.name}</div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setView('list')}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium"
        >
          Вернуться к доставкам
        </button>
      </div>
    );
  };

  const header = (
    <PageHeader title="Доставка">
      <div className="flex items-center space-x-3">
        <Button variant="secondary" icon={<Calendar size={20} />}>
          Расписание
        </Button>
        {selectedDeliveries.length >= 2 && (
          <Button 
            variant="primary" 
            icon={<Truck size={20} />}
            onClick={handleGroupDeliveries}
          >
            Объединить заказы ({selectedDeliveries.length})
          </Button>
        )}
      </div>
    </PageHeader>
  );

  return (
    <PageLayout header={header}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600">Активных доставок</div>
            <div className="text-2xl font-bold">{deliveries.length}</div>
          </div>
        </div>

        {view === 'list' && renderDeliveryList()}
        {view === 'grouping' && renderGrouping()}
        {view === 'groupingConfirmed' && renderGroupingConfirmed()}
      </div>
    </PageLayout>
  );
}