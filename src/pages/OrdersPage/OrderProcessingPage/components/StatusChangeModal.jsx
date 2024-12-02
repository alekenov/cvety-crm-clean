import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStatusLabel, getNextStatuses } from '@/constants/orderStatuses';

const StatusChangeModal = ({ 
  isOpen, 
  onClose, 
  currentStatus, 
  onStatusChange,
  statusHistory = []
}) => {
  const nextStatuses = getNextStatuses(currentStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить статус заказа</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Текущий статус</h4>
            <div className="px-3 py-2 bg-secondary rounded-md">
              {getStatusLabel(currentStatus)}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Доступные статусы</h4>
            <div className="grid gap-2">
              {nextStatuses.map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onStatusChange(status)}
                >
                  {getStatusLabel(status)}
                </Button>
              ))}
            </div>
          </div>

          {statusHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">История изменений</h4>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {statusHistory.map((record, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-start py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">
                        {getStatusLabel(record.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {record.user}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeModal;
