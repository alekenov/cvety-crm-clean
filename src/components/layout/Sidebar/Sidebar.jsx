import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Settings, ShoppingBag } from 'lucide-react';

function Sidebar() {
  const navigation = [
    { name: 'Заказы', href: '/orders', icon: ShoppingBag },
    { name: 'Товары', href: '/products', icon: Package },
    { name: 'Настройки', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Cvety CRM</h1>
      </div>
      
      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar; 