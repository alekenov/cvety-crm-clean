import React, { useState } from 'react';
import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import MediaUpload from '@/components/MediaUpload';
import { Card } from '@/components/ui/card';

const NewOperationModal = ({ isOpen, onClose, onSave }) => {
  const [operation, setOperation] = useState({
    type: 'income',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    files: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(operation);
    onClose();
  };

  const handleChange = (field) => (e) => {
    setOperation(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleFileUpload = (files) => {
    setOperation(prev => ({
      ...prev,
      files: files
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новая операция" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Тип операции */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={operation.type === 'income' ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => setOperation(prev => ({ ...prev, type: 'income' }))}
          >
            Доход
          </Button>
          <Button
            type="button"
            variant={operation.type === 'expense' ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => setOperation(prev => ({ ...prev, type: 'expense' }))}
          >
            Расход
          </Button>
        </div>

        {/* Основные поля */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Категория</label>
            <Select
              value={operation.category}
              onChange={handleChange('category')}
              className="mt-1"
            >
              <option value="">Выберите категорию</option>
              {operation.type === 'income' ? (
                <>
                  <option value="sales">Продажи</option>
                  <option value="investments">Инвестиции</option>
                  <option value="other_income">Другое</option>
                </>
              ) : (
                <>
                  <option value="inventory">Закуп товара</option>
                  <option value="salary">Зарплата</option>
                  <option value="rent">Аренда</option>
                  <option value="utilities">Коммунальные услуги</option>
                  <option value="other_expense">Другое</option>
                </>
              )}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Сумма</label>
            <Input
              type="number"
              value={operation.amount}
              onChange={handleChange('amount')}
              className="mt-1"
              placeholder="Введите сумму"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <Input
              type="text"
              value={operation.description}
              onChange={handleChange('description')}
              className="mt-1"
              placeholder="Введите описание"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Дата</label>
            <Input
              type="date"
              value={operation.date}
              onChange={handleChange('date')}
              className="mt-1"
            />
          </div>
        </div>

        {/* Загрузка файлов */}
        <div>
          <MediaUpload onUpload={handleFileUpload} maxFiles={5} accept="image/*" />
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewOperationModal;
