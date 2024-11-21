import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Phone, Star, MapPin, MessageCircle, CheckCircle, User, AlertCircle } from 'lucide-react';
import PageLayout, { PageHeader } from '@/components/layout/PageLayout/PageLayout';
import { Button } from '@/components/ui/button';

function DeliveryGrouping({ group, totalRegularCost, groupCost, savings, handleConfirmGrouping }) {
  const navigate = useNavigate();
  const [deliveryStatus, setDeliveryStatus] = useState('searching');

  const statuses = {
    searching: {
      title: "Поиск курьера",
      description: "Ищем ближайшего курьера Яндекс.Доставка",
      color: "bg-yellow-500"
    },
    confirmed: {
      title: "Курьер найден",
      description: "Курьер скоро приедет за заказами",
      color: "bg-blue-500"
    },
    picked: {
      title: "Заказы у курьера",
      description: "Курьер получил все заказы",
      color: "bg-purple-500"
    },
    delivering: {
      title: "Доставка заказов",
      description: "Курьер развозит заказы",
      color: "bg-green-500"
    },
    completed: {
      title: "Доставка завершена",
      description: "Все заказы доставлены",
      color: "bg-gray-500"
    }
  };

  const courier = {
    name: "Азамат",
    phone: "+7 (707) 123-45-67",
    rating: 4.8,
    photo: "/api/placeholder/40/40",
    arrivalTime: "15:45",
  };

  const simulateDelivery = () => {
    const sequence = ['searching', 'confirmed', 'picked', 'delivering', 'completed'];
    const currentIndex = sequence.indexOf(deliveryStatus);
    if (currentIndex < sequence.length - 1) {
      setDeliveryStatus(sequence[currentIndex + 1]);
    }
  };

  return (
    <PageLayout
      header={
        <PageHeader title="Отслеживание доставки">
          <Button variant="secondary" onClick={() => navigate('/delivery')}>
            Закрыть
          </Button>
        </PageHeader>
      }
    >
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Статус доставки */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="font-bold">Групповая доставка</h2>
                <p className="text-sm text-gray-600">Создана в {new Date().toLocaleTimeString()}</p>
              </div>
              <span className="font-bold">{groupCost} ₸</span>
            </div>

            <div className={`p-3 rounded-lg ${statuses[deliveryStatus].color} bg-opacity-10 mb-4`}>
              <div className="font-medium">{statuses[deliveryStatus].title}</div>
              <div className="text-sm text-gray-600">{statuses[deliveryStatus].description}</div>
            </div>
          </div>

          {/* Информация о курьере */}
          {deliveryStatus !== 'searching' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={courier.photo} 
                    alt={courier.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">{courier.name}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star size={14} className="text-yellow-400 fill-current mr-1" />
                      {courier.rating}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-green-100 text-green-600 rounded-full">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
              
              {deliveryStatus === 'confirmed' && (
                <div className="mt-2 bg-blue-50 p-2 rounded-lg text-sm">
                  <Clock size={14} className="inline-block mr-1" />
                  Приедет в {courier.arrivalTime}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Список заказов */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-bold mb-4">Заказы в доставке</h3>
          <div className="space-y-4">
            {group.orders.map((order, index) => (
              <div key={order.id} className="flex items-start">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Заказ #{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">{order.items[0].name}</div>
                    </div>
                    {deliveryStatus === 'delivering' && (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                        В пути
                      </span>
                    )}
                    {deliveryStatus === 'completed' && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        Доставлен
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <User size={14} className="mr-1" /> {order.client.name}
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin size={14} className="mr-1" /> {order.address}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Нижняя панель с действиями */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:bottom-0 bottom-16">
          <div className="max-w-4xl mx-auto">
            {deliveryStatus === 'searching' && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => simulateDelivery()} 
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-medium"
                >
                  Найти другого курьера
                </button>
                <button 
                  onClick={() => navigate('/delivery')}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium"
                >
                  Отменить
                </button>
              </div>
            )}

            {deliveryStatus !== 'searching' && deliveryStatus !== 'completed' && (
              <button 
                onClick={() => simulateDelivery()}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
              >
                Отследить на карте
              </button>
            )}

            {deliveryStatus === 'completed' && (
              <button 
                onClick={() => navigate('/delivery')}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium"
              >
                Завершить
              </button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default DeliveryGrouping;