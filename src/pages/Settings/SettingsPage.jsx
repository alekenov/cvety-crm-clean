import React from 'react';
import ShopSettings from './components/ShopSettings';
import EmployeeSettings from './components/EmployeeSettings';

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <ShopSettings />
      <EmployeeSettings />
    </div>
  );
};

export default SettingsPage; 