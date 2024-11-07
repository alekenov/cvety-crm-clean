import React, { useState } from 'react';
import { Plus, Minus, X, Search, ArrowLeft, Upload, Video, Truck, Percent, Calendar } from 'lucide-react';

const AddProductForm = ({ onClose }) => {
  // Весь код формы, который я показывал ранее
  // ...
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Весь JSX формы */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Добавить новый букет</h1>
        {/* Остальная часть формы */}
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default AddProductForm; 