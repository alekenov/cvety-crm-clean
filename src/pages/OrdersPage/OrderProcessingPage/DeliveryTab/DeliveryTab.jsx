import React, { useState } from 'react';
import { MapPin, Clock, AlertTriangle, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CourierAssignment from '../components/CourierAssignment';

export default function DeliveryTab({ order }) {
  const [showCourierAssignment, setShowCourierAssignment] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const delivery = {
    address: "ул. Абая 150, кв 10",
    time: "14:00 - 17:00",
    details: {
      entrance: "2",
      floor: "3",
      intercom: "100",
      comment: "Домофон работает. Позвонить за 1 час."
    },
    recipient: {
      name: "Айжан",
      phone: "+7 777 123 45 67"
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Статус доставки */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Статус доставки</h2>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
            <span>Ожидает курьера</span>
          </div>
          <Button 
            size="lg"
            onClick={() => setShowCourierAssignment(true)}
          >
            Назначить курьера
          </Button>
        </div>
      </Card>

      {/* Адрес доставки */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Адрес доставки</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowMap(true)}
          >
            <Map className="h-4 w-4 mr-2" />
            Карта
          </Button>
        </div>

        <div className="space-y-6">
          {/* Адрес и время */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium text-lg">{delivery.address}</p>
              <p className="text-muted-foreground">{delivery.time}</p>
            </div>
          </div>

          {/* Детали доставки */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Подъезд</p>
              <p className="font-medium text-lg">{delivery.details.entrance}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Этаж</p>
              <p className="font-medium text-lg">{delivery.details.floor}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Домофон</p>
              <p className="font-medium text-lg">{delivery.details.intercom}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Получатель</p>
              <p className="font-medium">{delivery.recipient.name}</p>
              <p className="text-sm text-muted-foreground">{delivery.recipient.phone}</p>
            </div>
          </div>

          {/* Комментарий */}
          {delivery.details.comment && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
              {delivery.details.comment}
            </div>
          )}
        </div>
      </Card>

      {/* Модальное окно назначения курьера */}
      <CourierAssignment 
        isOpen={showCourierAssignment}
        onClose={() => setShowCourierAssignment(false)}
        onAssign={(courier) => {
          console.log('Назначен курьер:', courier);
          // TODO: Здесь будет логика назначения курьера
          setShowCourierAssignment(false);
        }}
        deliveryAddress={delivery.address}
        deliveryTime={delivery.time}
      />
    </div>
  );
}