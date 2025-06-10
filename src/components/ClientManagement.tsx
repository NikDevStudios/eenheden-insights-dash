
import React, { useState } from 'react';
import { Client, Contract, ContractType, Stats } from '../types/finance';
import { ContractForm } from './ContractForm';

interface ClientManagementProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  stats: Stats;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ clients, setClients, stats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'pinned'>('name-asc');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showContractForm, setShowContractForm] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  // Filter and sort clients
  const filteredAndSortedClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'pinned') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });

  const addClient = (name: string, description: string) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name,
      description,
      isPinned: false,
      contracts: [],
      createdAt: new Date()
    };
    setClients([...clients, newClient]);
    setShowNewClientForm(false);
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, ...updates } : client
    ));
  };

  const deleteClient = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  const togglePin = (clientId: string) => {
    updateClient(clientId, { 
      isPinned: !clients.find(c => c.id === clientId)?.isPinned 
    });
  };

  const addContract = (clientId: string, contract: Omit<Contract, 'id'>) => {
    const newContract: Contract = {
      ...contract,
      id: Date.now().toString()
    };
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      updateClient(clientId, {
        contracts: [...client.contracts, newContract]
      });
    }
    setShowContractForm(null);
  };

  const deleteContract = (clientId: string, contractId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      updateClient(clientId, {
        contracts: client.contracts.filter(c => c.id !== contractId)
      });
    }
  };

  const getContractTypeBadge = (type: ContractType) => {
    const styles = {
      PS: 'bg-blue-100 text-blue-800 border-blue-200',
      LS: 'bg-purple-100 text-purple-800 border-purple-200',
      DELA: 'bg-green-100 text-green-800 border-green-200',
      BL: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return styles[type];
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-1">Manage your clients and their contracts</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="pinned">Pinned First</option>
            </select>
            
            <button
              onClick={() => setShowNewClientForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Client Form */}
      {showNewClientForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Client</h2>
          <NewClientForm onSubmit={addClient} onCancel={() => setShowNewClientForm(false)} />
        </div>
      )}

      {/* Client List */}
      <div className="space-y-4">
        {filteredAndSortedClients.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first client</p>
            <button
              onClick={() => setShowNewClientForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Your First Client
            </button>
          </div>
        ) : (
          filteredAndSortedClients.map((client) => (
            <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {client.contracts.length} contracts • {client.contracts.reduce((sum, c) => sum + c.eenheden, 0).toFixed(0)} Eenheden
                        </span>
                        {client.isPinned && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>Pinned</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePin(client.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        client.isPinned 
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => setEditingClient(client)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <svg className={`w-5 h-5 transform transition-transform duration-200 ${expandedClient === client.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{client.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {client.contracts.map((contract) => (
                    <span key={contract.id} className={`text-xs px-3 py-1 rounded-full border ${getContractTypeBadge(contract.type)}`}>
                      {contract.type} • €{contract.amount} • {contract.eenheden.toFixed(0)} E
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Expanded Contract Details */}
              {expandedClient === client.id && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Contracts</h4>
                    <button
                      onClick={() => setShowContractForm(client.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Contract</span>
                    </button>
                  </div>
                  
                  {showContractForm === client.id && (
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                      <ContractForm
                        onSubmit={(contract) => addContract(client.id, contract)}
                        onCancel={() => setShowContractForm(null)}
                      />
                    </div>
                  )}
                  
                  {client.contracts.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">No contracts yet</p>
                      <button
                        onClick={() => setShowContractForm(client.id)}
                        className="mt-2 text-blue-600 hover:text-blue-700"
                      >
                        Add the first contract
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {client.contracts.map((contract) => (
                        <div key={contract.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getContractTypeBadge(contract.type)}`}>
                                {contract.type}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">€{contract.amount.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{contract.eenheden.toFixed(2)} Eenheden</p>
                              </div>
                              <div className="text-sm text-gray-500">
                                <p>Start: {contract.startDate.toLocaleDateString()}</p>
                                <p>{contract.documents.length} documents</p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteContract(client.id, contract.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Client Modal */}
      {editingClient && (
        <EditClientModal
          client={editingClient}
          onSave={(updates) => {
            updateClient(editingClient.id, updates);
            setEditingClient(null);
          }}
          onCancel={() => setEditingClient(null)}
        />
      )}
    </div>
  );
};

// New Client Form Component
const NewClientForm: React.FC<{
  onSubmit: (name: string, description: string) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter client name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter client description"
        />
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Add Client
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Edit Client Modal Component
const EditClientModal: React.FC<{
  client: Client;
  onSave: (updates: Partial<Client>) => void;
  onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
  const [name, setName] = useState(client.name);
  const [description, setDescription] = useState(client.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Client</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
