import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Heading, Text, Label } from '@/components/ui/Typography/Typography';
import { Button } from '@/components/ui/button';

// Создаем объект для уведомлений
const showToast = {
  success: (message) => toast.success(message, { duration: 3000 }),
  error: (message) => toast.error(message, { duration: 3000 }),
  loading: (message) => toast.loading(message),
};

function ClientForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    tags: client?.tags || []
  });

  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = showToast.loading('Сохранение данных клиента...');
    try {
      await onSave(formData);
      showToast.success('Данные клиента успешно сохранены');
    } catch (error) {
      console.error('Error saving client:', error);
      showToast.error('Ошибка при сохранении данных клиента');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
      setShowTagInput(false);
      showToast.success('Тег успешно добавлен');
    } else if (formData.tags.includes(newTag.trim())) {
      showToast.error('Этот тег уже существует');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="block mb-1">
          Имя
        </Label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone" className="block mb-1">
          Телефон
        </Label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <Label htmlFor="email" className="block mb-1">
          Email
        </Label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <Label className="block mb-1">Теги</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full"
            >
              <Text size="sm">{tag}</Text>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 p-1 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        {showTagInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="Введите тег"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              size="sm"
            >
              <Text>Добавить</Text>
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => setShowTagInput(true)}
            variant="outline"
            size="sm"
          >
            <Plus size={16} className="mr-1" />
            <Text>Добавить тег</Text>
          </Button>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
        >
          <Text>Отмена</Text>
        </Button>
        <Button
          type="submit"
          variant="default"
        >
          <Text>Сохранить</Text>
        </Button>
      </div>
    </form>
  );
}

export default ClientForm;
