import React, { useState } from 'react';
import { Phone, MessageCircle, Map, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

export default function DeliveryTab() {
  const [status, setStatus] = useState('pending'); // pending, assigned, delivering, delivered
  const [showMap, setShowMap] = useState(false);

  const delivery = {
    address: "ул. Абая 150, кв 10",
    time: "14:00 - 17:00",
    recipient: {
      name: "Айжан",
      phone: "+7 777 123 45 67"
    },
    details: {
      entrance: "2",
      floor: "3",
      intercom: "100",
      comment: "Домофон работает. Позвонить за 1 час."
    },
    courier: {
      name: "Асхат",
      phone: "+7 705 999 88 77",
      eta: "15:30"
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Основная информация */}
      <div className="p-4 space-y-4">
        {/* Статус доставки */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Статус доставки</h3>
            <Clock size={20} className="text-blue-500" />
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              {status === 'pending' && (
                <div className="flex-1 bg-yellow-50 text-yellow-700 p-3 rounded-lg flex items-center">
                  <AlertTriangle size={20} className="mr-2" />
                  <span>Ожидает курьера</span>
                </div>
              )}
              {status === 'assigned' && (
                <div className="flex-1 bg-blue-50 text-blue-700 p-3 rounded-lg">
                  <p className="font-medium">Курьер назначен</p>
                  <p className="text-sm mt-1">Прибудет в {delivery.courier.eta}</p>
                </div>
              )}
              {status === 'delivering' && (
                <div className="flex-1 bg-purple-50 text-purple-700 p-3 rounded-lg">
                  <p className="font-medium">Курьер в пути</p>
                  <p className="text-sm mt-1">Прибытие ~ {delivery.courier.eta}</p>
                </div>
              )}
              {status === 'delivered' && (
                <div className="flex-1 bg-green-50 text-green-700 p-3 rounded-lg flex items-center">
                  <CheckCircle2 size={20} className="mr-2" />
                  <span>Доставлен</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Адрес доставки */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Адрес доставки</h3>
            <button 
              onClick={() => setShowMap(true)}
              className="text-blue-500 flex items-center text-sm font-medium"
            >
              <Map size={18} className="mr-1" />
              Карта
            </button>
          </div>

          <p className="text-lg mb-2">{delivery.address}</p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-500">Подъезд</p>
              <p className="font-medium">{delivery.details.entrance}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-500">Этаж</p>
              <p className="font-medium">{delivery.details.floor}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-500">Домофон</p>
              <p className="font-medium">{delivery.details.intercom}</p>
            </div>
          </div>

          {delivery.details.comment && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">{delivery.details.comment}</p>
            </div>
          )}
        </div>

        {/* Получатель */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-medium mb-3">Получатель</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{delivery.recipient.name}</p>
              <p className="text-gray-600">{delivery.recipient.phone}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Phone size={20} />
              </button>
              <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Курьер (если назначен) */}
        {status !== 'pending' && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium mb-3">Курьер</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{delivery.courier.name}</p>
                <p className="text-gray-600">{delivery.courier.phone}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Phone size={20} />
                </button>
                <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="mt-auto p-4 bg-white border-t">
        {status === 'pending' && (
          <button 
            onClick={() => setStatus('assigned')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
          >
            Вызвать курьера
          </button>
        )}
        {status === 'assigned' && (
          <button 
            onClick={() => setStatus('delivering')}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium"
          >
            Курьер забрал заказ
          </button>
        )}
        {status === 'delivering' && (
          <button 
            onClick={() => setStatus('delivered')}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium"
          >
            Заказ доставлен
          </button>
        )}
      </div>
    </div>
  );
}