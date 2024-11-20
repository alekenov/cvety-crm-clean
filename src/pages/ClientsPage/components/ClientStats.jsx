import React from 'react';

function ClientStats({ client }) {
  const stats = [
    {
      label: 'Total Orders',
      value: client.totalOrders
    },
    {
      label: 'Total Spent',
      value: `${client.totalSpent.toLocaleString()} ₸`
    },
    {
      label: 'Average Order',
      value: `${client.averageOrder.toLocaleString()} ₸`
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default ClientStats;
