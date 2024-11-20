import React from 'react';

function ClientAnalytics({ clientId }) {
  const mockData = {
    purchaseTrends: [
      { month: 'Jan', amount: 45000 },
      { month: 'Feb', amount: 52000 },
      { month: 'Mar', amount: 48000 },
      { month: 'Apr', amount: 51000 },
      { month: 'May', amount: 55000 },
    ],
    topItems: [
      { name: 'Rose Bouquet', count: 5, total: 75000 },
      { name: 'Spring Mix', count: 3, total: 36000 },
      { name: 'Tulip Arrangement', count: 2, total: 36000 }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Purchase Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Purchase Trends</h2>
          <select className="p-2 border rounded-lg">
            <option>Last 12 months</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div className="h-64">
          <div className="flex items-end h-48 space-x-4">
            {mockData.purchaseTrends.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(item.amount / 55000) * 100}%` }}
                ></div>
                <p className="text-sm text-gray-600 mt-2">{item.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Purchased Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Most Purchased Items</h2>
        <div className="space-y-4">
          {mockData.topItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Purchased {item.count} times</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">{item.total.toLocaleString()} ₸</p>
                <p className="text-sm text-gray-500">{Math.round(item.count * 100 / 10)}% of orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientAnalytics;
