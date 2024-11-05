import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, ShoppingBag, Package, Users, Settings, 
  BarChart2, FileText, Truck, LayoutGrid 
} from 'lucide-react';

function SidebarMenu() {
  // Основные разделы
  const mainMenu = [
    { id: 'home', path: '/', icon: Home, label: 'Главная' },
    { id: 'orders', path: '/orders', icon: ShoppingBag, label: 'Заказы' },
    { id: 'catalog', path: '/products', icon: LayoutGrid, label: 'Мои букеты' },
    { id: 'stock', path: '/inventory', icon: Package, label: 'Склад' },
    { id: 'clients', path: '/clients', icon: Users, label: 'Клиенты' },
  ];

  // Дополнительные разделы
  const secondaryMenu = [
    { id: 'delivery', path: '/delivery', icon: Truck, label: 'Доставка' },
    { id: 'analytics', path: '/analytics', icon: BarChart2, label: 'Аналитика' },
    { id: 'reports', path: '/reports', icon: FileText, label: 'Отчеты' },
    { id: 'settings', path: '/settings/shops', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="hidden lg:flex w-64 min-h-screen bg-white border-r flex-col">
      {/* Логотип */}
      <div className="h-16 border-b flex items-center px-6">
        <h1 className="text-xl font-bold">Cvety.kz</h1>
      </div>

      {/* Основное меню */}
      <div className="flex-1 py-4">
        <div className="mb-8">
          {mainMenu.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50
                ${isActive ? 'bg-gray-100 text-blue-600 font-medium' : ''}
              `}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
              {item.id === 'orders' && (
                <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  12
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Разделитель */}
        <div className="mb-4 px-6">
          <div className="border-t"></div>
        </div>

        {/* Дополнительное меню */}
        <div>
          {secondaryMenu.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50
                ${isActive ? 'bg-gray-100 text-blue-600 font-medium' : ''}
              `}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Информация о магазине */}
      <div className="p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="font-medium">Магазин на Абая</div>
          <div className="text-sm text-gray-500">Сегодня: 09:00-20:00</div>
        </div>
      </div>
    </div>
  );
}

export default SidebarMenu; 