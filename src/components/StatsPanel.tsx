
import React from 'react';
import { Stats } from '../types/finance';

interface StatsPanelProps {
  stats: Stats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const getFTTierColor = (tier: string) => {
    switch (tier) {
      case 'FT1': return 'from-blue-500 to-blue-600';
      case 'FT2': return 'from-purple-500 to-purple-600';
      case 'FT3': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getFTTierProgress = (eenheden: number) => {
    if (eenheden >= 3000) return 100;
    if (eenheden >= 1001) return ((eenheden - 1001) / 1999) * 100;
    return (eenheden / 1000) * 100;
  };

  const getNextTierTarget = (eenheden: number) => {
    if (eenheden < 1000) return 1000;
    if (eenheden < 3000) return 3000;
    return null;
  };

  const progress = getFTTierProgress(stats.totalEenheden);
  const nextTarget = getNextTierTarget(stats.totalEenheden);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Clients */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClients}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Contracts */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Contracts</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalContracts}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Eenheden */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Eenheden</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEenheden.toFixed(0)}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{stats.currentFTTier}</span>
                {nextTarget && <span>Target: {nextTarget}</span>}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${getFTTierColor(stats.currentFTTier)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-r ${getFTTierColor(stats.currentFTTier)} rounded-lg flex items-center justify-center`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">€{stats.totalRevenue.toFixed(0)}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
