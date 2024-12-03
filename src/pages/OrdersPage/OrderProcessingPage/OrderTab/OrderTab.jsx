import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { Input } from "@/components/ui/Input/Input";
import { getStatusLabel } from '@/constants/orderStatuses';
import StatusChangeModal from '../components/StatusChangeModal';

const OrderTab = ({ 
  order,
  onStatusChange,
  onCommentChange,
  onCardTextChange
}) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Статус заказа */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Статус заказа</h3>
              <Badge variant="outline">
                {getStatusLabel(order?.status)}
              </Badge>
            </div>
            <Button 
              variant="outline"
              onClick={() => setIsStatusModalOpen(true)}
            >
              Изменить статус
            </Button>
          </div>
        </CardContent>
      </Card>

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={order?.status}
        onStatusChange={onStatusChange}
      />

      {/* Комментарий к заказу */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Комментарий к заказу</h3>
              <Textarea
                value={order?.comment || ''}
                onChange={(e) => onCommentChange(e.target.value)}
                placeholder="Добавьте комментарий к заказу..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Текст открытки */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Текст открытки</h3>
              <Input
                value={order?.card_text || ''}
                onChange={(e) => onCardTextChange(e.target.value)}
                placeholder="Введите текст для открытки..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTab;