import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import OrderProcessing from './pages/OrdersPage/components/OrderProcessing';
import CreateOrderPage from './pages/OrdersPage/CreateOrderPage';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import DeliveryPage from './pages/DeliveryPage/DeliveryPage';
import { ClientsPage, ClientProfile } from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';
import FinancePage from './pages/FinancePage/FinancePage';
import SettingsPage from './pages/Settings';
import { ShopManagement } from './pages/Settings';
import LoginPage from './pages/LoginPage/LoginPage';
import { ProtectedRoute } from './components/features/auth/ProtectedRoute';

// Компонент для 404 страницы
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600">Страница не найдена</p>
    </div>
  );
}

// Компонент для отображения ошибок
function ErrorBoundary({ error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Ошибка</h1>
      <p className="text-gray-600">{error?.message || 'Что-то пошло не так'}</p>
    </div>
  );
}

// Configure all future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
};

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <OrdersPage />,
        },
        {
          path: 'orders',
          children: [
            {
              index: true,
              element: <OrdersPage />,
            },
            {
              path: ':id',
              element: <OrderProcessing />,
            },
            {
              path: 'create',
              element: <CreateOrderPage />,
            },
          ],
        },
        {
          path: 'inventory',
          element: <InventoryPage />,
        },
        {
          path: 'delivery',
          element: <DeliveryPage />,
        },
        {
          path: 'clients',
          children: [
            {
              index: true,
              element: <ClientsPage />,
            },
            {
              path: ':id',
              element: <ClientProfile />,
            },
          ],
        },
        {
          path: 'products',
          element: <ProductsPage />,
        },
        {
          path: 'analytics',
          element: <AnalyticsPage />,
        },
        {
          path: 'finance',
          element: <FinancePage />,
        },
        {
          path: 'settings',
          element: <ShopManagement />,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  routerConfig
);