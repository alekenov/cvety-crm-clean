import React, { 
  useState, 
  useEffect, 
  useCallback 
} from 'react';
import { Flower, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { logger } from '../../services/logging/loggingService';

const BouquetCompositionEditor = ({ 
  initialComposition = [], 
  onCompositionChange, 
  maxItems = 10 
}) => {
  const [composition, setComposition] = useState(initialComposition);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);

  React.useEffect(() => {
    logger.log('BouquetCompositionEditor', 'Компонент редактора букета инициализирован', {
      initialCompositionCount: initialComposition.length,
      maxItems
    });
  }, []);

  const handleAddFlower = useCallback(async (flower) => {
    try {
      if (composition.length >= maxItems) {
        logger.warn('BouquetCompositionEditor', 'Превышено максимальное количество товаров', { 
          currentCount: composition.length, 
          maxItems 
        });
        // toast.error(`Максимальное количество товаров: ${maxItems}`);
        return;
      }

      const newComposition = [...composition, flower];
      setComposition(newComposition);
      
      logger.log('BouquetCompositionEditor', 'Товар добавлен в композицию', { 
        productName: flower.name 
      });

      if (onCompositionChange) {
        onCompositionChange(newComposition);
      }
    } catch (error) {
      logger.error('BouquetCompositionEditor', 'Ошибка при добавлении товара', { 
        productName: flower.name 
      }, error);
      // toast.error('Не удалось добавить товар');
    }
  }, [composition, maxItems, onCompositionChange]);

  const handleRemoveFlower = useCallback((index) => {
    try {
      const removedFlower = composition.find((_, i) => i === index);
      
      const newComposition = composition.filter((_, i) => i !== index);
      setComposition(newComposition);

      logger.log('BouquetCompositionEditor', 'Товар удален из композиции', { 
        productName: removedFlower?.name 
      });

      if (onCompositionChange) {
        onCompositionChange(newComposition);
      }
    } catch (error) {
      logger.error('BouquetCompositionEditor', 'Ошибка при удалении товара', {}, error);
      // toast.error('Не удалось удалить товар');
    }
  }, [composition, onCompositionChange]);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Состав букета</Card.Title>
      </Card.Header>
      
      {composition.length === 0 && (
        <div className="text-center text-neutral-500 py-4">
          Добавьте цветы в букет
        </div>
      )}

      <CardContent>
        <div className="space-y-2">
          {composition.map((flower, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between bg-neutral-50 rounded-lg p-2"
            >
              <div className="flex items-center space-x-3">
                <Flower size={20} className="text-neutral-500" />
                <span className="text-neutral-700">{flower.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveFlower(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BouquetCompositionEditor;
