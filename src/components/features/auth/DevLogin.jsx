import React from 'react';

const DevLogin = () => {
  const testCredentials = {
    email: 'admin@cvety-crm.kz',
    password: 'Admin123!'
  };

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600 mb-2">Тестовые данные для входа:</p>
      <div className="bg-gray-50 rounded p-4 text-left inline-block">
        <p className="font-mono text-sm">
          Email: <span className="text-blue-600">{testCredentials.email}</span>
        </p>
        <p className="font-mono text-sm">
          Пароль: <span className="text-blue-600">{testCredentials.password}</span>
        </p>
      </div>
    </div>
  );
};

export default DevLogin;
