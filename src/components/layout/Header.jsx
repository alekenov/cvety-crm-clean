import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          {/* Page title will be added dynamically */}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
          </button>

          {/* User menu */}
          <div className="flex items-center">
            <button className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Администратор</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
