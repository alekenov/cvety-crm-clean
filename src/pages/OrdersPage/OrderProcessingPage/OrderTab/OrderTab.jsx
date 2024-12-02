import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusLabel } from '@/constants/orderStatuses';
import StatusChangeModal from '../components/StatusChangeModal';

const OrderTab = ({ 
  order, 
  orderStatus,
  onStatusChange,
  statusHistory
}) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Статус заказа */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
        <div className="space-y-1">
          <div className="text-sm font-medium">Статус заказа</div>
          <Badge variant="outline">
            {getStatusLabel(orderStatus)}
          </Badge>
        </div>
        <Button 
          variant="outline"
          onClick={() => setIsStatusModalOpen(true)}
        >
          Изменить статус
        </Button>
      </div>

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={orderStatus}
        onStatusChange={onStatusChange}
        statusHistory={statusHistory}
      />

      {/* Информация о заказе */}
      <div className="grid gap-4 p-4 bg-card rounded-lg border">
        <div>
          <h3 className="text-lg font-medium">Детали заказа</h3>
          <p className="text-sm text-muted-foreground">
            {order?.comment || 'Комментарий отсутствует'}
          </p>
        </div>
        
        {order?.items?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Состав заказа</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order?.details?.recipient && (
          <div>
            <h4 className="font-medium mb-2">Получатель</h4>
            <div className="space-y-1 text-sm">
              <p>{order.details.recipient.name}</p>
              <p>{order.details.recipient.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTab;