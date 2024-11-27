import React from 'react';
import { MessageCircle, Camera, AlertTriangle, MapPin, Phone, User, Store, Clock, ThumbsUp, ThumbsDown, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heading, Text, Label, Caption } from '@/components/ui/Typography/Typography';

const OrderCard = ({ order, onStatusChange, onUploadPhoto, onRespondToClientReaction, onClick }) => {
  const getDateText = (dateString) => {
    const today = new Date();
    const orderDate = new Date(dateString);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (orderDate.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (orderDate.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return orderDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  const statusColors = {
    'Не оплачен': 'bg-red-500',
    'Оплачен': 'bg-blue-500',
    'В работе': 'bg-yellow-500',
    'Собран': 'bg-purple-500',
    'Ожидает курьера': 'bg-orange-500',
    'В пути': 'bg-indigo-500',
    'Доставлен': 'bg-green-500',
    'Проблема с доставкой': 'bg-red-700',
    'Готов к самовывозу': 'bg-teal-500'
  };

  const nextStatus = {
    'Не оплачен': 'Оплачен',
    'Оплачен': 'В работе',
    'В работе': 'Собран',
    'Собран': 'Ожидает курьера',
    'Ожидает курьера': 'В пути',
    'В пути': 'Доставлен',
    'Готов к самовывозу': 'Доставлен'
  };

  return (
    <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <Heading as="h3" className="font-bold">{order.number}</Heading>
          <Badge className={`${statusColors[order.status]} text-white`}>
            <Caption className="text-white">{order.status}</Caption>
          </Badge>
          <Heading as="h4" className="font-semibold text-green-600 w-full sm:w-auto mt-2 sm:mt-0">{order.totalPrice}</Heading>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <Text className="text-gray-600">
              {getDateText(order.date)}, {order.time}
            </Text>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} />
            <Text className="text-gray-600">
              {order.client}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-0 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${order.client}`;
              }}
            >
              <Phone size={16} className="text-blue-500" />
              <span className="sr-only">Call client</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/${order.client.replace(/[^0-9]/g, '')}`);
              }}
            >
              <MessageCircle size={16} className="text-green-500" />
              <span className="sr-only">WhatsApp client</span>
            </Button>
          </div>

          <div className="space-y-1">
            <p className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              {order.deliveryType === 'pickup' 
                ? `${order.shop} (Самовывоз)` 
                : order.address}
              {order.addressNeedsClarification && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle size={16} className="ml-1 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Требуется уточнение адреса</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </p>
          </div>

          {order.shop && order.deliveryType !== 'pickup' && (
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="flex items-center text-gray-700">
                <Store size={16} className="mr-1" />
                Магазин: {order.shop}
              </p>
              {order.florist && order.status !== 'Оплачен' && (
                <p className="flex items-center text-gray-700 mt-1">
                  <User size={16} className="mr-1" />
                  Флорист: {order.florist}
                </p>
              )}
            </div>
          )}

          <div>
            <Heading as="h4" className="font-medium mb-2">Состав заказа:</Heading>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.description} 
                      className="w-12 h-12 object-cover rounded-md mr-2"
                    />
                    <Text>
                      {item.description}
                    </Text>
                  </div>
                  <Text className="font-medium">
                    {item.price}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {order.clientComment && (
            <div className="bg-yellow-50 p-2 rounded-lg">
              <Heading as="h4" className="font-medium mb-1 flex items-center">
                <MessageCircle size={16} className="mr-1 text-yellow-500" />
                Комментарий клиента:
              </Heading>
              <Text>
                {order.clientComment}
              </Text>
            </div>
          )}

          {order.clientReaction && (
            <div className={`p-2 rounded-lg ${
              order.clientReaction === 'positive' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <Heading as="h4" className="font-medium mb-1 flex items-center">
                {order.clientReaction === 'positive' ? (
                  <ThumbsUp size={16} className="mr-1 text-green-500" />
                ) : (
                  <ThumbsDown size={16} className="mr-1 text-red-500" />
                )}
                Реакция клиента:
              </Heading>
              <Text>
                {order.clientReactionComment}
              </Text>
              {order.clientReaction === 'negative' && !order.reassemblyRequested && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRespondToClientReaction(order.number, 'reassemble');
                  }}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Пересобрать букет
                </Button>
              )}
            </div>
          )}

          {order.deliveryProblem && (
            <div className="bg-red-50 p-2 rounded-lg">
              <Heading as="h4" className="font-medium mb-1 flex items-center text-red-700">
                <AlertTriangle size={16} className="mr-1" />
                Проблема с доставкой:
              </Heading>
              <Text className="text-red-700">
                {order.deliveryProblem}
              </Text>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            {order.status === 'Оплачен' && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadPhoto(order.number);
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Camera size={16} className="mr-1" />
                Загрузить фото
              </Button>
            )}
            {nextStatus[order.status] && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(order.number, nextStatus[order.status]);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <ArrowRight size={16} className="mr-1" />
                {nextStatus[order.status]}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
