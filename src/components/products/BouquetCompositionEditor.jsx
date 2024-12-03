import React, { 
  useState, 
  useEffect, 
  useCallback 
} from 'react';
import { Flower, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { logger } from '../../services/logging/loggingService';

const BouquetCompositionEditor = ({ 
  initialComposition = [], 
  onCompositionChange, 
  maxItems = 10 
}) => {
  const [composition, setComposition] = useState(initialComposition);

  // Обновляем состав при изменении initialComposition
  useEffect(() => {
    setComposition(initialComposition);
  }, [initialComposition]);

  const handleQuantityChange = useCallback((inventoryItemId, delta) => {
    try {
      const newComposition = composition.map(item => {
        if (item.inventory_item_id === inventoryItemId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setComposition(newComposition);
      onCompositionChange(newComposition);

      logger.log('BouquetCompositionEditor', 'Количество товара изменено', {
        inventoryItemId,
        delta
      });
    } catch (error) {
      logger.error('BouquetCompositionEditor', 'Ошибка при изменении количества', {
        inventoryItemId,
        delta
      }, error);
    }
  }, [composition, onCompositionChange]);

  const handleRemoveFlower = useCallback((inventoryItemId) => {
    try {
      const removedFlower = composition.find(item => item.inventory_item_id === inventoryItemId);
      
      const newComposition = composition.filter(item => item.inventory_item_id !== inventoryItemId);
      setComposition(newComposition);

      logger.log('BouquetCompositionEditor', 'Товар удален из композиции', { 
        productName: removedFlower?.name 
      });

      onCompositionChange(newComposition);
    } catch (error) {
      logger.error('BouquetCompositionEditor', 'Ошибка при удалении товара', {}, error);
    }
  }, [composition, onCompositionChange]);

  return (
    <Card>
      <CardContent className="p-4">
        {composition.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            Добавьте цветы в состав букета
          </div>
        ) : (
          <div className="space-y-3">
            {composition.map(item => (
              <div
                key={item.inventory_item_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-grow">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.price} ₸ / {item.unit} • Сумма: {(item.price * item.quantity).toLocaleString()} ₸
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.inventory_item_id, -1)}
                    className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.inventory_item_id, 1)}
                    className="p-1 text-gray-400 hover:text-blue-500"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveFlower(item.inventory_item_id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BouquetCompositionEditor;
