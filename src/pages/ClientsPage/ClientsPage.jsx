import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import ClientForm from './components/ClientForm';
import { Heading, Text, Label } from '@/components/ui/Typography/Typography';
import { clientsService } from '@/services/clientsService';

function ClientsPage() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Загрузка клиентов
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const response = await clientsService.getClients({
          search: searchQuery,
          page: currentPage,
          limit: 10
        });
        setClients(response.clients);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [searchQuery, currentPage]);

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

  const handleAddTag = async (clientId) => {
    if (newTag.trim()) {
      try {
        const updatedClient = await clientsService.addClientTag(clientId, newTag.trim());
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === clientId ? updatedClient : client
          )
        );
        setNewTag('');
        setShowTagInput(false);
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
  };

  const handleRemoveTag = async (clientId, tagToRemove) => {
    try {
      const updatedClient = await clientsService.removeClientTag(clientId, tagToRemove);
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId ? updatedClient : client
        )
      );
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => client.tags.includes(tag));

    return matchesTags;
  });

  const ClientCard = ({ client }) => {
    return (
      <div 
        key={client.id}
        className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/clients/${client.id}`)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <Text className="font-medium">{client.name}</Text>
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
    );
  };

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
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No clients found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {/* Add Client Form Modal */}
      {showForm && (
        <ClientForm
          onClose={() => setShowForm(false)}
          onSubmit={async (data) => {
            // Handle client creation
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

export default ClientsPage;
