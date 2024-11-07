import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Package, Warehouse, Settings, Truck } from 'lucide-react';

const MobileNavigation = () => {
  return (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 px-6 max-w-md mx-auto">
        <NavLink 
          to="/" 
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-16
            ${isActive ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <ShoppingBag size={24} />
          <span className="text-xs mt-1">Заказы</span>
        </NavLink>

        <NavLink 
          to="/products" 
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-16
            ${isActive ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <Package size={24} />
          <span className="text-xs mt-1">Букеты</span>
        </NavLink>

        <NavLink 
          to="/inventory" 
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-16
            ${isActive ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <Warehouse size={24} />
          <span className="text-xs mt-1">Склад</span>
        </NavLink>

        <NavLink 
          to="/delivery" 
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-16
            ${isActive ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <Truck size={24} />
          <span className="text-xs mt-1">Доставка</span>
        </NavLink>

        <NavLink 
          to="/settings/shops" 
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-16
            ${isActive ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Настройки</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNavigation; 