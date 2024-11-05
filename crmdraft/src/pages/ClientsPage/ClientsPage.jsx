import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setClients } from '../../store/slices/clientsSlice';

export default function ClientsPage() {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients?.items) || [];

  useEffect(() => {
    // Инициализация тестовыми данными
    const initialClients = [
      { id: 1, name: 'Клиент 1', phone: '+7 777 777 77 77' },
      { id: 2, name: 'Клиент 2', phone: '+7 777 777 77 78' },
    ];
    dispatch(setClients(initialClients));
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Клиенты</h1>
      <div className="space-y-2">
        {clients.map(client => (
          <div key={client.id} className="p-4 border rounded-lg">
            <div className="font-medium">{client.name}</div>
            <div className="text-gray-600">{client.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}