import React, { useState, useCallback, useEffect } from 'react';
import { logger } from '../../../../services/logging/loggingService';
import { ArrowLeft, Camera, Gift, Calendar, Clock, Phone, MessageCircle, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { H2, H3, Body, Caption } from '@/components/ui/Typography';

export default function OrderProcessing() {
  const [activeTab, setActiveTab] = useState('info');
  const [orderStatus, setOrderStatus] = useState('new');

  const order = {
    id: '105747',
    items: [
      { 
        id: 1,
        name: 'Букет "Нежное облако"',
        description: '25 розовых роз + гипсофила',
        price: 15000,
        image: '/api/placeholder/100/100',
        quantity: 1
      },
      {
        id: 2,
        name: 'Открытка поздравительная',
        price: 500,
        image: '/api/placeholder/100/100',
        quantity: 1
      }
    ],
    customer: {
      name: 'Михаил',
      phone: '+7 701 555 44 33',
      isRegular: true, // постоянный клиент
      previousOrders: 5
    },
    recipient: {
      name: 'Айка',
      phone: '+7 777 562 69 93'
    },
    delivery: {
      date: '17 марта',
      timeSlot: '12:00 - 15:00',
      type: 'Срочная доставка'
    },
    message: 'Добрый день! Большая просьба собрать букет из нежно-розовых оттенков ',
    cardText: 'Aika, с днем рождения! Misha',
    totalAmount: 15500,
    paymentStatus: 'Оплачен онлайн'
  };

  useEffect(() => {
    logger.log('OrderProcessing', 'Инициализация страницы заказа', {
      orderId: order.id,
      currentStatus: orderStatus
    });
  }, [order.id, orderStatus]);

  const handleStatusChange = useCallback((newStatus) => {
    try {
      logger.log('OrderProcessing', 'Изменение статуса заказа', {
        orderId: order.id,
        oldStatus: orderStatus,
        newStatus
      });

      setOrderStatus(newStatus);
    } catch (error) {
      logger.error('OrderProcessing', 'Ошибка при изменении статуса заказа', {
        orderId: order.id,
        newStatus
      }, error);
    }
  }, [order.id, orderStatus]);

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen flex flex-col">
      {/* Шапка */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <ArrowLeft className="mr-2" />
          <div className="flex-1">
            <H2 className="font-bold">Заказ №{order.id}</H2>
            <Body size="sm" className="text-gray-500">Новый заказ • {order.paymentStatus}</Body>
          </div>
        </div>

        {/* Табы */}
        <div className="flex mt-4 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'info', label: 'Заказ' },
            { id: 'photo', label: 'Фото' },
            { id: 'delivery', label: 'Доставка' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                activeTab === tab.id ? 'bg-white text-blue-600' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Контент заказа */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {/* Время доставки */}
          <div className="bg-orange-50 p-3 rounded-lg flex items-center">
            <Clock className="text-orange-500 mr-2" size={20} />
            <div>
              <Body className="font-medium">{order.delivery.type}</Body>
              <Body size="sm">
                {order.delivery.date} • {order.delivery.timeSlot}
              </Body>
            </div>
          </div>

          {/* Товары */}
          <div className="bg-white rounded-lg p-4">
            <H3 className="font-medium mb-3">Состав заказа:</H3>
            {order.items.map((item, index) => (
              <div key={item.id} className={`flex items-start ${index > 0 ? 'mt-4 pt-4 border-t' : ''}`}>
                {item.image && (
                  <img src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                )}
                <div className="ml-3 flex-1">
                  <Body className="font-medium">{item.name}</Body>
                  {item.description && (
                    <Body size="sm" className="text-gray-500">{item.description}</Body>
                  )}
                  <Body className="text-green-600 font-bold mt-1">
                    {item.price.toLocaleString()} ₸
                  </Body>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t flex justify-between">
              <Body className="font-medium">Итого:</Body>
              <Body className="font-bold">{order.totalAmount.toLocaleString()} ₸</Body>
            </div>
          </div>

          {/* Заказчик */}
          <div className="bg-white rounded-lg p-4">
            <H3 className="font-medium mb-3">Заказчик:</H3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium flex items-center">
                  <Body>{order.customer.name}</Body>
                  {order.customer.isRegular && (
                    <Caption className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Постоянный клиент
                    </Caption>
                  )}
                </div>
                <Body size="sm" className="text-gray-500">{order.customer.phone}</Body>
                <Body size="sm" className="text-gray-500 mt-1">
                  {order.customer.previousOrders} заказов ранее
                </Body>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Phone size={20} />
                </button>
                <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Получатель */}
          <div className="bg-white rounded-lg p-4">
            <H3 className="font-medium mb-3">Получатель:</H3>
            <div className="flex items-center justify-between">
              <div>
                <Body className="font-medium">{order.recipient.name}</Body>
                <Body size="sm" className="text-gray-500">{order.recipient.phone}</Body>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Phone size={20} />
                </button>
                <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Комментарий и открытка */}
          {order.message && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <Body size="sm">{order.message}</Body>
            </div>
          )}
          
          {order.cardText && (
            <div className="bg-pink-50 p-4 rounded-lg flex items-start">
              <Gift className="text-pink-500 mr-2 flex-shrink-0" size={18} />
              <div>
                <Body size="sm" className="font-medium mb-1">Текст открытки:</Body>
                <Body size="sm" className="italic">"{order.cardText}"</Body>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-100 py-3 rounded-lg font-medium">
            Отклонить
          </button>
          <button className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium">
            Принять заказ
          </button>
        </div>
      </div>
    </div>
  );
}