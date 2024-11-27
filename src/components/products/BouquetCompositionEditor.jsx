import React, { useState } from 'react';
import { Flower, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BouquetCompositionEditor = ({ onCompositionChange }) => {
  const [composition, setComposition] = useState([]);

  const handleAddFlower = (flower) => {
    const newComposition = [...composition, flower];
    setComposition(newComposition);
    onCompositionChange(newComposition);
  };

  const handleRemoveFlower = (index) => {
    const newComposition = composition.filter((_, i) => i !== index);
    setComposition(newComposition);
    onCompositionChange(newComposition);
  };

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
