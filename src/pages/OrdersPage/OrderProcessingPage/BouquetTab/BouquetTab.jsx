import React, { useState } from 'react';
import { Plus, Minus, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input/Input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import PhotoGallery from '../components/PhotoGallery';
import { ordersService } from '@/services/ordersService';
import { toast } from 'react-hot-toast';

export default function BouquetTab({ order }) {
  const [photos, setPhotos] = useState([]);
  const [showFlowerPicker, setShowFlowerPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Моковые данные цветов (в реальном приложении будут загружаться с сервера)
  const flowers = [
    { id: 1, name: 'Розы красные', price: 1000, stock: 150 },
    { id: 2, name: 'Тюльпаны белые', price: 500, stock: 200 },
    { id: 3, name: 'Хризантемы розовые', price: 700, stock: 100 },
  ];

  const filteredFlowers = flowers.filter(flower =>
    flower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePhotoUpload = async (files) => {
    try {
      const uploadedPhotos = await ordersService.uploadPhotos(order.id, files);
      setPhotos([...photos, ...uploadedPhotos]);
      return uploadedPhotos;
    } catch (error) {
      toast.error('Ошибка при загрузке фотографий');
      throw error;
    }
  };

  const handlePhotoDelete = async (photoId) => {
    try {
      await ordersService.deletePhoto(order.id, photoId);
      setPhotos(photos.filter(p => p.id !== photoId));
    } catch (error) {
      toast.error('Ошибка при удалении фотографии');
      throw error;
    }
  };

  const handlePhotoSend = async (photoId) => {
    try {
      await ordersService.sendPhotoToClient(order.id, photoId);
    } catch (error) {
      toast.error('Ошибка при отправке фотографии');
      throw error;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Фотографии букета */}
      <Card className="p-6">
        <PhotoGallery
          orderId={order.id}
          onUpload={handlePhotoUpload}
          onDelete={handlePhotoDelete}
          onSend={handlePhotoSend}
        />
      </Card>

      {/* Состав букета */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Состав букета</h3>
          <Button onClick={() => setShowFlowerPicker(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить цветы
          </Button>
        </div>

        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.price} ₸ × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Модальное окно выбора цветов */}
      <Dialog open={showFlowerPicker} onOpenChange={setShowFlowerPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить цветы</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск цветов"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-auto">
              {filteredFlowers.map((flower) => (
                <div
                  key={flower.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{flower.name}</p>
                    <p className="text-sm text-muted-foreground">{flower.price} ₸</p>
                  </div>
                  <Badge variant="secondary">
                    В наличии: {flower.stock}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}