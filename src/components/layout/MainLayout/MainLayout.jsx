import React from 'react';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import TopBar from '../TopBar/TopBar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarMenu />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 