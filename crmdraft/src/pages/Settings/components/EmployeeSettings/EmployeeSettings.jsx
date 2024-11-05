import React from 'react';
import Button from '../../../../components/ui/Button/Button';

const EmployeeSettings = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Сотрудники</h2>
      <div className="space-y-4">
        {/* Список сотрудников будет здесь */}
        <Button>Добавить сотрудника</Button>
      </div>
    </div>
  );
};

export default EmployeeSettings; 