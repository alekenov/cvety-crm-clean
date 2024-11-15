import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import OrderProcessing from './pages/OrdersPage/components/OrderProcessing';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import DeliveryPage from './pages/DeliveryPage/DeliveryPage';
import ClientsPage from './pages/ClientsPage/ClientsPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';
import FinancePage from './pages/FinancePage/FinancePage';
import SettingsPage from './pages/Settings';
import { ShopManagement } from './pages/Settings';

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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <OrdersPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />,
      },
      {
        path: '/order/:id',
        element: <OrderProcessing />,
      },
      {
        path: '/order/create',
        element: <OrderProcessing />,
      },
      {
        path: '/inventory',
        element: <InventoryPage />,
      },
      {
        path: '/delivery',
        element: <DeliveryPage />,
      },
      {
        path: '/clients',
        element: <ClientsPage />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '/finance',
        element: <FinancePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
        children: [
          {
            path: '',
            element: <ShopManagement />,
          },
          {
            path: 'shops',
            element: <ShopManagement />,
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ],
  },
]); 