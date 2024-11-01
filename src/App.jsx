import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import SettingsPage from './pages/Settings';
import ClientsPage from './pages/ClientsPage/ClientsPage';
import ShopManagement from './pages/Settings/ShopManagement';
import ProductManagement from './pages/Products/ProductManagement';
import { Users, ShoppingCart, Package, Warehouse, Settings } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 sm:mb-0">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/settings/shops" element={<ShopManagement />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/" element={<OrdersPage />} />
          </Routes>
        </main>

        {/* Мобильный таб-бар */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
          <div className="flex justify-around py-2">
            <NavLink to="/orders" className="tab-link">
              <ShoppingCart size={24} />
            </NavLink>
            <NavLink to="/products" className="tab-link">
              <Package size={24} />
            </NavLink>
            <NavLink to="/inventory" className="tab-link">
              <Warehouse size={24} />
            </NavLink>
            <NavLink to="/clients" className="tab-link">
              <Users size={24} />
            </NavLink>
            <NavLink to="/settings/shops" className="tab-link">
              <Settings size={24} />
            </NavLink>
          </div>
        </nav>
      </div>
    </Router>
  );
};

export default App; 