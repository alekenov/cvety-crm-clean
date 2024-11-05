import React from 'react';
import { Bell } from 'lucide-react';

function TopBar() {
  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center">
        <span className="text-lg font-medium">Магазин на Абая</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* Уведомления */}
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={24} className="text-gray-600" />
          </button>
        </div>
        {/* Профиль */}
        <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <span className="font-medium">Анна И.</span>
        </button>
      </div>
    </div>
  );
}

export default TopBar; 