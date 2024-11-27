import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import ClientForm from './components/ClientForm';
import { Heading, Text, Label } from '@/components/ui/Typography/Typography';

function ClientsPage() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  // Mock clients data
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Anna Smith",
      phone: "+7 (777) 123-45-67",
      totalOrders: 5,
      totalSpent: 125000,
      lastOrder: "2024-01-15",
      tags: ['Regular', 'Prefers roses']
    },
    {
      id: 2,
      name: "John Doe",
      phone: "+7 (777) 234-56-78",
      totalOrders: 3,
      totalSpent: 75000,
      lastOrder: "2024-01-10",
      tags: ['New']
    },
    {
      id: 3,
      name: "Maria Johnson",
      phone: "+7 (777) 345-67-89",
      totalOrders: 7,
      totalSpent: 180000,
      lastOrder: "2024-01-05",
      tags: ['Regular', 'Birthday: March 15']
    }
  ]);

  const allTags = Array.from(
    new Set(clients.flatMap(client => client.tags))
  );

  const handleTagSelect = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddTag = (clientId) => {
    if (newTag.trim()) {
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId
            ? { ...client, tags: [...client.tags, newTag.trim()] }
            : client
        )
      );
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (clientId, tagToRemove) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId
          ? { ...client, tags: client.tags.filter(tag => tag !== tagToRemove) }
          : client
      )
    );
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchQuery || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => client.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Heading as="h1" className="text-2xl font-bold">Clients</Heading>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowSearch(!showSearch)}
            variant="ghost"
            size="icon"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            size="md"
          >
            <Plus className="w-5 h-5 mr-2" />
            <Text>Add Client</Text>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {showSearch && (
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                size="sm"
              >
                <Text>{tag}</Text>
                {selectedTags.includes(tag) && (
                  <X className="w-4 h-4 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <Text size="sm" className="font-medium text-gray-500 uppercase tracking-wider">Client</Text>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <Text size="sm" className="font-medium text-gray-500 uppercase tracking-wider">Tags</Text>
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                <Text size="sm" className="font-medium text-gray-500 uppercase tracking-wider">Orders</Text>
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                <Text size="sm" className="font-medium text-gray-500 uppercase tracking-wider">Total Spent</Text>
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                <Text size="sm" className="font-medium text-gray-500 uppercase tracking-wider">Last Order</Text>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClients.map(client => (
              <tr 
                key={client.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <td className="px-6 py-4">
                  <div>
                    <Text className="font-medium text-gray-900">{client.name}</Text>
                    <Text size="sm" className="text-gray-500">{client.phone}</Text>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        <Text size="sm">{tag}</Text>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Text>{client.totalOrders}</Text>
                </td>
                <td className="px-6 py-4 text-right">
                  <Text className="font-medium text-green-600">{client.totalSpent.toLocaleString()} ₸</Text>
                </td>
                <td className="px-6 py-4 text-right">
                  <Text size="sm" className="text-gray-500">
                    {new Date(client.lastOrder).toLocaleDateString()}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredClients.map(client => (
          <div 
            key={client.id}
            className="bg-white p-4 rounded-lg shadow-sm"
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <Heading as="h3" className="font-medium">{client.name}</Heading>
                <Text size="sm" className="text-gray-500">{client.phone}</Text>
              </div>
              <Text size="sm" className="font-medium text-green-600">
                {client.totalSpent.toLocaleString()} ₸
              </Text>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {client.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  <Text size="sm">{tag}</Text>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Client Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Heading as="h2" className="text-xl font-bold mb-4">Add New Client</Heading>
            <ClientForm
              client={selectedClient}
              onSave={(data) => {
                console.log('Save client:', data);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
