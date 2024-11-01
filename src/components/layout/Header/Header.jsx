import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600">
              Цветы CRM
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/orders" className="text-gray-600 hover:text-primary-600">
              Заказы
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600">
              Товары
            </Link>
            <Link to="/inventory" className="text-gray-600 hover:text-primary-600">
              Склад
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-primary-600">
              Настройки
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 