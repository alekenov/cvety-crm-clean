import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import InventoryPage from './pages/Inventory';
import SettingsPage from './pages/Settings';
import ClientsPage from './pages/ClientsPage/ClientsPage';
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
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/" element={<OrdersPage />} />
          </Routes>
        </main>

        {/* Мобильный таб-бар */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
          <div className="flex justify-around">
            <NavLink to="/orders" className="tab-link">
              <ShoppingCart size={24} />
              <span>Заказы</span>
            </NavLink>
            <NavLink to="/products" className="tab-link">
              <Package size={24} />
              <span>Товары</span>
            </NavLink>
            <NavLink to="/inventory" className="tab-link">
              <Warehouse size={24} />
              <span>Склад</span>
            </NavLink>
            <NavLink to="/clients" className="tab-link">
              <Users size={24} />
              <span>Клиенты</span>
            </NavLink>
            <NavLink to="/settings" className="tab-link">
              <Settings size={24} />
              <span>Настройки</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </Router>
  );
};

export default App; 