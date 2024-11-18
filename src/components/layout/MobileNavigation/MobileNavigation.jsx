import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShoppingBag,
  Store,
  Package,
  Wallet,
  Settings,
  Users,
  ShoppingCart,
  BarChart2,
  Truck
} from 'lucide-react';

const MobileNavigation = () => {
  const [showServices, setShowServices] = useState(false);

  const tabItems = [
    { id: 'orders', path: '/orders', icon: ShoppingBag, label: 'Заказы' },
    { id: 'products', path: '/products', icon: Store, label: 'Товары' },
    { id: 'warehouse', path: '/warehouse', icon: Package, label: 'Склад' },
    { id: 'finances', path: '/finances', icon: Wallet, label: 'Финансы' },
  ];

  const serviceItems = [
    { 
      id: 'clients', 
      path: '/clients', 
      icon: Users, 
      label: 'Клиенты',
      description: 'База клиентов'
    },
    { 
      id: 'purchases', 
      path: '/purchases', 
      icon: ShoppingCart, 
      label: 'Закуп',
      description: 'Управление закупками'
    },
    { 
      id: 'settings', 
      path: '/settings', 
      icon: Settings, 
      label: 'Настройка',
      description: 'Настройки магазина'
    },
    { 
      id: 'delivery', 
      path: '/delivery', 
      icon: Truck, 
      label: 'Доставка',
      description: 'Управление доставкой'
    },
    { 
      id: 'analytics', 
      path: '/analytics', 
      icon: BarChart2, 
      label: 'Аналитика',
      description: 'Статистика и отчеты'
    }
  ];

  return (
    <>
      {/* Выпадающее меню сервисов */}
      {showServices && (
        <div className="block lg:hidden fixed inset-0 bg-white z-40">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Сервисы</h1>
            </div>
            <div className="space-y-3">
              {serviceItems.map(item => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setShowServices(false)}
                  className="w-full bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
                >
                  <div className="bg-green-50 p-2 rounded-lg">
                    <item.icon className="text-green-500" size={24} />
                  </div>
                  <div className="ml-4 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Нижняя навигация */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-between px-2">
          {tabItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center py-2 px-3
                ${isActive ? 'text-green-500' : 'text-gray-500'}
              `}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setShowServices(!showServices)}
            className={`flex flex-col items-center py-2 px-3 ${showServices ? 'text-green-500' : 'text-gray-500'}`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Сервисы</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation; 