import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

function OrderHistory({ clientId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock orders data
  const orders = [
    {
      id: '1001',
      date: '2024-01-15',
      status: 'delivered',
      items: [{ name: 'Rose Bouquet', quantity: 1 }],
      total: '15,000 ₸'
    },
    {
      id: '1002',
      date: '2024-01-10',
      status: 'delivered',
      items: [{ name: 'Spring Mix', quantity: 1 }],
      total: '12,000 ₸'
    },
    {
      id: '1003',
      date: '2024-01-05',
      status: 'cancelled',
      items: [{ name: 'Tulip Arrangement', quantity: 1 }],
      total: '18,000 ₸'
    }
  ];

  const statusColors = {
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search and Filters */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y">
        {orders.map((order) => (
          <div key={order.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium">Order #{order.id}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <span className="font-medium text-green-600">{order.total}</span>
            </div>
            
            <div className="text-sm text-gray-600">
              {order.items.map((item, index) => (
                <div key={index}>
                  {item.name} × {item.quantity}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              {new Date(order.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
