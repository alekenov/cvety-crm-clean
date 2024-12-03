import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import PhotoGallery from '../components/PhotoGallery';
import { ordersService } from '@/services/ordersService';
import { productsService } from '@/services/productsService';
import { toast } from 'react-hot-toast';

export default function BouquetTab({ order, onOrderUpdate }) {
  const [photos, setPhotos] = useState([]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productsService.getProducts();
      setProducts(productsData);
    } catch (error) {
      toast.error('Ошибка при загрузке товаров');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleAddProduct = async (product) => {
    try {
      await ordersService.addProductToOrder(order.id, product.id, 1);
      toast.success(`Товар "${product.name}" добавлен в заказ`);
      setShowProductPicker(false);
      
      // Обновляем данные заказа после добавления товара
      const { data: updatedOrder } = await ordersService.getById(order.id);
      if (updatedOrder) {
        onOrderUpdate(updatedOrder);
      }
    } catch (error) {
      toast.error('Ошибка при добавлении товара');
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateQuantity = async (orderItemId, currentQuantity, increment) => {
    try {
      const newQuantity = currentQuantity + increment;
      if (newQuantity < 1) {
        await ordersService.removeOrderItem(orderItemId);
      } else {
        await ordersService.updateOrderItem(orderItemId, { quantity: newQuantity });
      }
      
      // Обновляем данные заказа после изменения количества
      const { data: updatedOrder } = await ordersService.getById(order.id);
      if (updatedOrder) {
        onOrderUpdate(updatedOrder);
      }
    } catch (error) {
      toast.error('Ошибка при изменении количества');
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (orderItemId) => {
    try {
      await ordersService.removeOrderItem(orderItemId);
      toast.success('Товар удален из заказа');
      // Обновляем данные заказа после удаления товара
      const { data: updatedOrder } = await ordersService.getById(order.id);
      if (updatedOrder) {
        onOrderUpdate(updatedOrder);
      }
    } catch (error) {
      toast.error('Ошибка при удалении товара');
      console.error('Error removing item:', error);
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
          <Button onClick={() => setShowProductPicker(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Button>
        </div>

        <div className="space-y-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">{item.price} ₸ × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {!order.items?.length && (
            <div className="text-center py-8 text-muted-foreground">
              В заказе пока нет товаров
            </div>
          )}
        </div>
      </Card>

      {/* Модальное окно выбора товара */}
      <Dialog open={showProductPicker} onOpenChange={setShowProductPicker}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Выбор товара</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Поиск товара..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="mb-4"
            />
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">Загрузка товаров...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-4">Товары не найдены</div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleAddProduct(product)}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.price} ₸
                      </p>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}