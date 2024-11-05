import React, { useState } from 'react';
import PageLayout, { PageHeader, PageSection } from '../../components/layout/PageLayout/PageLayout';
import { Truck, MapPin, Clock, Calendar, Phone, User, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';

export default function DeliveryPage() {
  const [activeTab, setActiveTab] = useState('current');
  
  // Данные курьеров и доставок
  const deliveries = {
    current: [
      {
        id: 1,
        orderNumber: '103800',
        status: 'В пути',
        timeWindow: '14:00-15:00',
        address: 'ул. Абая 1, кв. 23',
        client: {
          name: 'Айым',
          phone: '+7 (777) 123-45-67'
        },
        courier: {
          name: 'Азамат',
          phone: '+7 (777) 999-88-77',
          status: 'active'
        },
        items: [
          { name: 'Букет "Весенний"', quantity: 1 }
        ]
      }
    ],
    planned: [
      {
        id: 2,
        orderNumber: '103801',
        status: 'Ожидает курьера',
        timeWindow: '16:00-17:00',
        address: 'пр. Достык 5, офис 301',
        client: {
          name: 'Мария',
          phone: '+7 (777) 234-56-78'
        }
      }
    ]
  };

  const couriers = [
    {
      id: 1,
      name: 'Азамат',
      phone: '+7 (777) 999-88-77',
      status: 'active',
      currentDeliveries: 2,
      totalToday: 5
    },
    {
      id: 2,
      name: 'Бауржан',
      phone: '+7 (777) 888-77-66',
      status: 'break',
      currentDeliveries: 0,
      totalToday: 3
    }
  ];

  const header = (
    <PageHeader title="Доставка">
      <div className="flex items-center space-x-3">
        <Button variant="secondary" icon={<Calendar size={20} />}>
          Расписание
        </Button>
        <Button variant="primary" icon={<Truck size={20} />}>
          Назначить курьера
        </Button>
      </div>
    </PageHeader>
  );

  return (
    <PageLayout header={header}>
      {/* Статистика */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Активных доставок</div>
          <div className="text-2xl font-bold">8</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Курьеров на линии</div>
          <div className="text-2xl font-bold">4</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Среднее время</div>
          <div className="text-2xl font-bold">23 мин</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Выполнено сегодня</div>
          <div className="text-2xl font-bold">12</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Текущие доставки */}
        <div className="col-span-2 space-y-6">
          <PageSection title="Текущие доставки">
            {deliveries.current.map(delivery => (
              <div key={delivery.id} className="bg-white p-4 rounded-lg mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">№{delivery.orderNumber}</span>
                      <Badge variant="info" className="ml-2">{delivery.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <Clock size={16} className="inline mr-1" />
                      {delivery.timeWindow}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={<Phone size={16} />}>
                    Позвонить
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Клиент</div>
                    <div className="font-medium">{delivery.client.name}</div>
                    <div className="text-sm">{delivery.client.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Адрес</div>
                    <div className="flex items-start">
                      <MapPin size={16} className="mr-1 mt-1 flex-shrink-0" />
                      <span>{delivery.address}</span>
                    </div>
                  </div>
                </div>

                {delivery.courier && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Курьер</div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{delivery.courier.name}</div>
                        <div className="text-sm">{delivery.courier.phone}</div>
                      </div>
                      <Badge variant="success">В пути</Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </PageSection>

          <PageSection title="Запланированные доставки">
            {deliveries.planned.map(delivery => (
              <div key={delivery.id} className="bg-white p-4 rounded-lg mb-4">
                {/* Аналогичная структура */}
              </div>
            ))}
          </PageSection>
        </div>

        {/* Курьеры */}
        <PageSection title="Курьеры">
          {couriers.map(courier => (
            <div key={courier.id} className="bg-white p-4 rounded-lg mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">{courier.name}</div>
                  <div className="text-sm text-gray-600">{courier.phone}</div>
                </div>
                <Badge 
                  variant={courier.status === 'active' ? 'success' : 'warning'}
                >
                  {courier.status === 'active' ? 'На линии' : 'Перерыв'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <div className="text-gray-600">Активных доставок</div>
                  <div className="font-medium">{courier.currentDeliveries}</div>
                </div>
                <div>
                  <div className="text-gray-600">Выполнено сегодня</div>
                  <div className="font-medium">{courier.totalToday}</div>
                </div>
              </div>
            </div>
          ))}
        </PageSection>
      </div>
    </PageLayout>
  );
} 