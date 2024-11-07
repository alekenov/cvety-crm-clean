import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import MobileNavigation from './components/layout/MobileNavigation/MobileNavigation';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import OrderProcessing from './pages/OrdersPage/components/OrderProcessing';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import ShopManagement from './pages/Settings/ShopManagement';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import DeliveryPage from './pages/DeliveryPage/DeliveryPage';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';
import ClientsPage from './pages/ClientsPage/ClientsPage';

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen">
        <MainLayout>
          <Routes>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderProcessing />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/settings/shops" element={<ShopManagement />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </MainLayout>
        <MobileNavigation />
      </div>
    </Router>
  );
};

export default App; 