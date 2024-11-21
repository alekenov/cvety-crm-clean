import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import ClientForm from './components/ClientForm';

function ClientsPage() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

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

  // Desktop view client row
  const ClientRow = ({ client }) => (
    <tr 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(`/clients/${client.id}`)}
    >
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900">{client.name}</div>
          <div className="text-sm text-gray-500">{client.phone}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag, index) => (
            <span
              key={index}
              className="group inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(client.id, tag);
              }}
            >
              {tag}
              <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100" />
            </span>
          ))}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowTagInput(client.id);
            }}
            variant="ghost"
            size="sm"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Tag
          </Button>
          {showTagInput === client.id && (
            <div 
              className="absolute bg-white shadow-lg rounded-lg p-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="New tag"
                  autoFocus
                />
                <Button
                  onClick={() => handleAddTag(client.id)}
                  variant="primary"
                  size="sm"
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">{client.totalOrders}</td>
      <td className="px-6 py-4 text-right font-medium text-green-600">
        {client.totalSpent.toLocaleString()} ₸
      </td>
      <td className="px-6 py-4 text-right text-sm text-gray-500">
        {new Date(client.lastOrder).toLocaleDateString()}
      </td>
    </tr>
  );

  // Mobile view client card
  const ClientCard = ({ client }) => (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm"
      onClick={() => navigate(`/clients/${client.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{client.name}</h3>
          <p className="text-sm text-gray-500">{client.phone}</p>
        </div>
        <span className="text-sm font-medium text-green-600">
          {client.totalSpent.toLocaleString()} ₸
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {client.tags.map((tag, index) => (
          <span
            key={index}
            className="group inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveTag(client.id, tag);
            }}
          >
            {tag}
            <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100" />
          </span>
        ))}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setShowTagInput(client.id);
          }}
          variant="ghost"
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Tag
        </Button>
        {showTagInput === client.id && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
              e.stopPropagation();
              setShowTagInput(false);
            }}
          >
            <div 
              className="bg-white p-4 rounded-lg w-80"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-medium mb-4">Add New Tag</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Enter tag name"
                  autoFocus
                />
                <Button
                  onClick={() => handleAddTag(client.id)}
                  variant="primary"
                  size="md"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
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
            Add Client
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
                {tag}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Order
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClients.map(client => (
              <ClientRow key={client.id} client={client} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredClients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Add/Edit Client Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Client</h2>
            <ClientForm
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
