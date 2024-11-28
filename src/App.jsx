import { Outlet, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { ToastProvider } from './components/ui/toast';
import { LogViewer } from './components/debug/LogViewer';
import { ArchivedOrdersPage } from './pages/ArchivedOrdersPage/ArchivedOrdersPage';
import { OrdersPage } from './pages/OrdersPage/OrdersPage';
import { CreateOrderPage } from './pages/CreateOrderPage/CreateOrderPage';

function App() {
  return (
    <>
      <ToastProvider />
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <Routes>
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/archive" element={<ArchivedOrdersPage />} />
              <Route path="/orders/create" element={<CreateOrderPage />} />
              <Route path="*" element={<Outlet />} />
            </Routes>
          </main>
        </div>
      </div>
      <LogViewer />
    </>
  );
}

export default App;