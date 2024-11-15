import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import TopBar from '../TopBar/TopBar';
import MobileNavigation from '../MobileNavigation/MobileNavigation';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarMenu />
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <TopBar />
        
        {/* Page Content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
}

export default MainLayout; 