import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { ordersService } from '@/services/ordersService';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function OrderHistory({ clientId }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        // Преобразуем clientId в число
        const data = await ordersService.fetchClientOrders(Number(clientId));
        setOrders(data || []);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadOrders();
    }
  }, [clientId]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchQuery || 
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      order.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search and Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-500">Order #{order.id}</div>
                  <div className="font-medium">
                    {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {order.delivery_address}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {order.items?.length || 'Нет'} товаров
                </div>
                <div className="font-medium text-green-600">
                  {order.total_price?.toLocaleString()} ₸
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
