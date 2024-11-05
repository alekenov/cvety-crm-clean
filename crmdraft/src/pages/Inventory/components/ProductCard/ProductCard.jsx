import React from 'react';
import Button from '../../../../components/ui/Button/Button';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg">{product?.name}</h3>
      <p className="text-gray-600 mt-1">В наличии: {product?.quantity} шт.</p>
      <p className="font-medium mt-2">{product?.price} ₸</p>
      <div className="mt-4">
        <Button variant="outline" size="sm">
          Редактировать
        </Button>
      </div>
    </div>
  );
};

export default ProductCard; 