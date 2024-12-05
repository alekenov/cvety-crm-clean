import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Calendar, MapPin, Phone, User, MessageCircle, 
  Camera, CreditCard, Package, Clock, AlertTriangle, Store, ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heading, Text, Label, Caption } from '@/components/ui/Typography/Typography';

const OrderCard = ({ order, onStatusChange, onUploadPhoto, onRespondToClientReaction, onClick }) => {
  const formatDeliveryDate = (date) => {
    // Если дата не указана, используем текущую дату
    const deliveryDate = date ? new Date(date) : new Date();
    
    try {
      // Проверка на валидность даты
      if (isNaN(deliveryDate.getTime())) {
        console.warn('Invalid date:', date);
        return format(new Date(), 'd MMMM yyyy, HH:mm', { locale: ru });
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Сброс времени для корректного сравнения дат
      today.setHours(0, 0, 0, 0);
      tomorrow.setHours(0, 0, 0, 0);
      const compareDate = new Date(deliveryDate);
      compareDate.setHours(0, 0, 0, 0);

      if (compareDate.getTime() === today.getTime()) {
        return `Сегодня, ${format(deliveryDate, 'HH:mm')}`;
      } else if (compareDate.getTime() === tomorrow.getTime()) {
        return `Завтра, ${format(deliveryDate, 'HH:mm')}`;
      } else {
        return format(deliveryDate, 'd MMMM yyyy, HH:mm', { locale: ru });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return format(new Date(), 'd MMMM yyyy, HH:mm', { locale: ru });
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Не оплачен':
        return 'error';
      case 'Оплачен':
        return 'success';
      case 'В работе':
        return 'warning';
      case 'Собран':
        return 'info';
      case 'В пути':
        return 'purple';
      case 'Готов к самовывозу':
        return 'secondary';
      case 'Доставлен':
        return 'outline';
      case 'Архив':
        return 'gray';
      default:
        return 'default';
    }
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
    <Card 
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <Heading as="h3" className="font-bold">{order.number}</Heading>
          <Badge variant={getStatusBadgeVariant(order.status)}>
            <Caption className="text-white">{order.status}</Caption>
          </Badge>
          <Heading as="h4" className="font-semibold text-green-600 w-full sm:w-auto mt-2 sm:mt-0">{order.totalPrice}</Heading>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Дата доставки</div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDeliveryDate(order.delivery_date)}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Тип доставки</div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span>{order.deliveryType || 'Не указан'}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-500 mb-2">Состав заказа</div>
            {order.products && order.products.length > 0 ? (
              <div className="space-y-1">
                {order.products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>{product.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{product.quantity} шт.</span>
                      <span className="text-gray-600">×</span>
                      <span className="font-medium">{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-400">Нет товаров в заказе</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <Text className="text-gray-600">
              {formatDeliveryDate(order.delivery_date)}{order.time ? `, ${order.time}` : ''}
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
