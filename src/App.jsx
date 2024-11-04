import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import SidebarMenu from './components/layout/SidebarMenu/SidebarMenu';
import TopBar from './components/layout/TopBar/TopBar';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import OrderProcessing from './pages/Orders/OrderProcessing/OrderProcessing';
import ProductManagement from './pages/Products/ProductManagement';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import ClientsPage from './pages/ClientsPage/ClientsPage';
import ShopManagement from './pages/Settings/ShopManagement';
import DashboardPage from './pages/Dashboard/DashboardPage';
import { Home, ShoppingBag, Package, Warehouse, Settings } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarMenu />
        <div className="flex-1">
          <TopBar />
          <main className="p-6 mb-16 sm:mb-0">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderProcessing />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/settings/shops" element={<ShopManagement />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/" element={<DashboardPage />} />
            </Routes>
          </main>

          {/* Мобильный таб-бар */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
            <div className="flex justify-around py-2">
              <NavLink to="/dashboard" className="tab-link">
                <Home size={24} />
              </NavLink>
              <NavLink to="/orders" className="tab-link">
                <ShoppingBag size={24} />
              </NavLink>
              <NavLink to="/products" className="tab-link">
                <Package size={24} />
              </NavLink>
              <NavLink to="/inventory" className="tab-link">
                <Warehouse size={24} />
              </NavLink>
              <NavLink to="/settings/shops" className="tab-link">
                <Settings size={24} />
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </Router>
  );
};

export default App; 