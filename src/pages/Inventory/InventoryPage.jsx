import React from 'react';
import ProductCard from './components/ProductCard';

const InventoryPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Склад</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Здесь будет список товаров */}
      </div>
    </div>
  );
};

export default InventoryPage; 