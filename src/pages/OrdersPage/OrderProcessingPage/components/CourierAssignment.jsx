import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CourierAssignment({ 
  isOpen, 
  onClose, 
  onAssign,
  deliveryAddress,
  deliveryTime 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourier, setSelectedCourier] = useState(null);

  // Моковые данные курьеров (в реальном приложении будут загружаться с сервера)
  const couriers = [
    { id: 1, name: 'Асхат Маратов', phone: '+7 777 123 45 67', status: 'available' },
    { id: 2, name: 'Бауыржан Сатов', phone: '+7 707 234 56 78', status: 'busy' },
    { id: 3, name: 'Айдос Жумабаев', phone: '+7 747 345 67 89', status: 'available' },
  ];

  const filteredCouriers = couriers.filter(courier => 
    courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    courier.phone.includes(searchQuery)
  );

  const handleAssign = () => {
    if (selectedCourier) {
      onAssign(selectedCourier);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Назначить курьера</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Информация о доставке */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="font-medium">{deliveryAddress}</p>
            <p className="text-sm text-muted-foreground">{deliveryTime}</p>
          </div>

          {/* Поиск курьера */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени или телефону"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Список курьеров */}
          <div className="space-y-2 max-h-[300px] overflow-auto">
            {filteredCouriers.map((courier) => (
              <div
                key={courier.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedCourier?.id === courier.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-muted-foreground/20'
                }`}
                onClick={() => setSelectedCourier(courier)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{courier.name}</p>
                    <p className="text-sm text-muted-foreground">{courier.phone}</p>
                  </div>
                  <Badge variant={courier.status === 'available' ? 'success' : 'secondary'}>
                    {courier.status === 'available' ? 'Свободен' : 'Занят'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedCourier || selectedCourier.status !== 'available'}
            >
              Назначить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}