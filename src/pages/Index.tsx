
import React, { useState, useEffect } from 'react';
import { ClientManagement } from '../components/ClientManagement';
import { Dashboard } from '../components/Dashboard';
import { Calculator } from '../components/Calculator';
import { StatsPanel } from '../components/StatsPanel';
import { mockClients } from '../data/mockData';
import { Client, Contract, FTTier } from '../types/finance';

const Index = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [activeView, setActiveView] = useState<'dashboard' | 'clients' | 'calculator'>('dashboard');

  // Calculate total stats
  const totalClients = clients.length;
  const totalContracts = clients.reduce((sum, client) => sum + client.contracts.length, 0);
  const totalEenheden = clients.reduce((sum, client) => 
    sum + client.contracts.reduce((contractSum, contract) => contractSum + contract.eenheden, 0), 0
  );

  // Calculate FT tier and revenue
  const calculateFTTier = (eenheden: number): FTTier => {
    if (eenheden >= 3000) return 'FT3';
    if (eenheden >= 1001) return 'FT2';
    return 'FT1';
  };

  const calculateTotalRevenue = (eenheden: number): number => {
    let revenue = 0;
    
    if (eenheden > 0) {
      // FT1: First 1000 Eenheden × 1.5
      const ft1Amount = Math.min(eenheden, 1000);
      revenue += ft1Amount * 1.5;
    }
    
    if (eenheden > 1000) {
      // FT2: Next 2000 Eenheden × 2
      const ft2Amount = Math.min(eenheden - 1000, 2000);
      revenue += ft2Amount * 2;
    }
    
    if (eenheden > 3000) {
      // FT3: Remaining Eenheden × 2.5
      const ft3Amount = eenheden - 3000;
      revenue += ft3Amount * 2.5;
    }
    
    return revenue;
  };

  const currentFTTier = calculateFTTier(totalEenheden);
  const totalRevenue = calculateTotalRevenue(totalEenheden);

  const stats = {
    totalClients,
    totalContracts,
    totalEenheden,
    totalRevenue,
    currentFTTier
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">FinancePro</h1>
            </div>
            
            <div className="flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
                { id: 'clients', label: 'Clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
                { id: 'calculator', label: 'Calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            <StatsPanel stats={stats} />
            <Dashboard clients={clients} />
          </div>
        )}
        
        {activeView === 'clients' && (
          <ClientManagement 
            clients={clients} 
            setClients={setClients}
            stats={stats}
          />
        )}
        
        {activeView === 'calculator' && (
          <Calculator stats={stats} />
        )}
      </div>
    </div>
  );
};

export default Index;
