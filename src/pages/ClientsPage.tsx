import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export const ClientsPage = () => {
  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      return [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' },
      ];
    },
  });

  if (error) {
    return <div className="p-4 text-red-500">Ошибка загрузки данных</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-4">
          {clients?.map(client => (
            <div 
              key={client.id}
              className="p-4 bg-white rounded-lg shadow"
            >
              <h3 className="font-medium">{client.name}</h3>
              <p className="text-gray-600">{client.email}</p>
              <p className="text-gray-600">{client.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
