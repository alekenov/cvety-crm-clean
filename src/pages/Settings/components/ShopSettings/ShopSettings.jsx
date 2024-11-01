import React from 'react';
import Input from '../../../../components/ui/Input/Input';
import Button from '../../../../components/ui/Button/Button';

const ShopSettings = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Настройки магазина</h2>
      <form className="space-y-4">
        <Input
          label="Название магазина"
          name="shopName"
          placeholder="Введите название магазина"
        />
        <Input
          label="Адрес"
          name="address"
          placeholder="Введите адрес магазина"
        />
        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  );
};

export default ShopSettings; 