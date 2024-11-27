import React from 'react';
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
  Truck,
  Palette
} from 'lucide-react';

function SidebarMenu() {
  const mainMenu = [
    { id: 'orders', path: '/', icon: ShoppingBag, label: 'Заказы' },
    { id: 'products', path: '/products', icon: Store, label: 'Товары' },
    { id: 'stock', path: '/inventory', icon: Package, label: 'Склад' },
    { id: 'finance', path: '/finance', icon: Wallet, label: 'Финансы' },
  ];

  const serviceMenu = [
    { id: 'clients', path: '/clients', icon: Users, label: 'Клиенты' },
    { id: 'purchase', path: '/purchase', icon: ShoppingCart, label: 'Закуп' },
    { id: 'delivery', path: '/delivery', icon: Truck, label: 'Доставка' },
    { id: 'analytics', path: '/analytics', icon: BarChart2, label: 'Аналитика' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Настройки' },
  ];

  const designSystem = [
    { id: 'typography', path: '/design/typography', icon: Palette, label: 'Типографика' },
  ];

  function getLinkClass(isActive) {
    return isActive 
      ? "w-full flex items-center px-6 py-3 bg-gray-100 text-green-500 font-medium"
      : "w-full flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50";
  }

  return (
    <div className="hidden lg:flex w-64 min-h-screen bg-white border-r flex-col">
      <div className="h-16 border-b flex items-center px-6">
        <h1 className="text-xl font-bold">Cvety.kz</h1>
      </div>

      <div className="flex-1 py-4">
        <div className="mb-8">
          {mainMenu.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="mb-8">
          {serviceMenu.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="px-6 mb-2 text-xs font-medium text-gray-400 uppercase">
            Дизайн система
          </div>
          {designSystem.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

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