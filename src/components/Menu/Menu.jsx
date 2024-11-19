import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  Users,
  Package,
  Settings,
  LogOut
} from 'lucide-react';

const MenuItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </Link>
);

const Menu = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Cvety CRM</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <MenuItem
          to="/orders"
          icon={ClipboardList}
          label="Заказы"
          active={isActive('/orders')}
        />
        <MenuItem
          to="/clients"
          icon={Users}
          label="Клиенты"
          active={isActive('/clients')}
        />
        <MenuItem
          to="/products"
          icon={Package}
          label="Товары"
          active={isActive('/products')}
        />
        <MenuItem
          to="/settings"
          icon={Settings}
          label="Настройки"
          active={isActive('/settings')}
        />
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => {/* TODO: Add logout handler */}}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Menu;
