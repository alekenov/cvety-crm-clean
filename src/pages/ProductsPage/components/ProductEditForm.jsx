import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';

const ProductEditForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    type: product?.type || 'букет',
    composition: product?.composition || [],
    images: product?.images || [],
  });

  const [newFlower, setNewFlower] = useState({ name: '', quantity: '' });

  const handleAddFlower = () => {
    if (newFlower.name && newFlower.quantity) {
      setFormData({
        ...formData,
        composition: [...formData.composition, newFlower],
      });
      setNewFlower({ name: '', quantity: '' });
    }
  };

  const handleRemoveFlower = (index) => {
    setFormData({
      ...formData,
      composition: formData.composition.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {product ? 'Редактирование букета' : 'Новый букет'}
            </h2>
            <button onClick={onClose} className="p-2">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}>
            {/* Основная информация */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Цена</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Состав букета */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Состав букета</h3>
              <div className="space-y-2 mb-4">
                {formData.composition.map((flower, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-grow">
                      {flower.name} - {flower.quantity} шт.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFlower(index)}
                      className="p-1 text-red-500"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Название цветка"
                  value={newFlower.name}
                  onChange={(e) => setNewFlower({...newFlower, name: e.target.value})}
                  className="flex-grow p-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Кол-во"
                  value={newFlower.quantity}
                  onChange={(e) => setNewFlower({...newFlower, quantity: e.target.value})}
                  className="w-24 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddFlower}
                  className="p-2 bg-green-500 text-white rounded-lg"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Фотографии */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Фотографии</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Фото ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
            </div>

            {/* Кнопки действий */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditForm; 