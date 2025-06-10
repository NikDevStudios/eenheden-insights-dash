
import React, { useState, useEffect } from 'react';
import { Stats, FTTier } from '../types/finance';

interface CalculatorProps {
  stats: Stats;
}

export const Calculator: React.FC<CalculatorProps> = ({ stats }) => {
  const [targetEenheden, setTargetEenheden] = useState<string>('');
  const [currentEenheden, setCurrentEenheden] = useState<string>(stats.totalEenheden.toString());
  const [timeframe, setTimeframe] = useState<'1year' | '6months' | '3months' | '1month' | '1week' | '3days' | '1day'>('1year');

  useEffect(() => {
    setCurrentEenheden(stats.totalEenheden.toString());
  }, [stats.totalEenheden]);

  const calculateRevenue = (eenheden: number): { total: number; breakdown: { ft1: number; ft2: number; ft3: number } } => {
    let ft1 = 0, ft2 = 0, ft3 = 0;
    
    if (eenheden > 0) {
      // FT1: First 1000 Eenheden × 1.5
      ft1 = Math.min(eenheden, 1000) * 1.5;
    }
    
    if (eenheden > 1000) {
      // FT2: Next 2000 Eenheden × 2
      ft2 = Math.min(eenheden - 1000, 2000) * 2;
    }
    
    if (eenheden > 3000) {
      // FT3: Remaining Eenheden × 2.5
      ft3 = (eenheden - 3000) * 2.5;
    }
    
    return {
      total: ft1 + ft2 + ft3,
      breakdown: { ft1, ft2, ft3 }
    };
  };

  const getFTTier = (eenheden: number): FTTier => {
    if (eenheden >= 3000) return 'FT3';
    if (eenheden >= 1001) return 'FT2';
    return 'FT1';
  };

  const getNextTierInfo = (eenheden: number) => {
    if (eenheden < 1000) {
      return { nextTier: 'FT2', needed: 1000 - eenheden };
    }
    if (eenheden < 3000) {
      return { nextTier: 'FT3', needed: 3000 - eenheden };
    }
    return null;
  };

  const currentEenhedenNum = parseFloat(currentEenheden) || 0;
  const targetEenhedenNum = parseFloat(targetEenheden) || 0;
  
  const currentRevenue = calculateRevenue(currentEenhedenNum);
  const targetRevenue = targetEenheden ? calculateRevenue(targetEenhedenNum) : null;
  
  const currentTier = getFTTier(currentEenhedenNum);
  const targetTier = targetEenheden ? getFTTier(targetEenhedenNum) : null;
  
  const nextTierInfo = getNextTierInfo(currentEenhedenNum);
  
  const revenueDifference = targetRevenue ? targetRevenue.total - currentRevenue.total : 0;
  const eenhedenDifference = targetEenhedenNum - currentEenhedenNum;

  const getTierColor = (tier: FTTier) => {
    switch (tier) {
      case 'FT1': return 'from-blue-500 to-blue-600';
      case 'FT2': return 'from-purple-500 to-purple-600';
      case 'FT3': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Mock historical data for different timeframes
  const getHistoricalData = (timeframe: string) => {
    const baseEenheden = stats.totalEenheden;
    const baseRevenue = stats.totalRevenue;
    const baseClients = stats.totalClients;
    const baseContracts = stats.totalContracts;

    const multipliers = {
      '1year': 0.2,
      '6months': 0.4,
      '3months': 0.6,
      '1month': 0.8,
      '1week': 0.9,
      '3days': 0.95,
      '1day': 0.98
    };

    const multiplier = multipliers[timeframe as keyof typeof multipliers];
    
    return {
      eenheden: Math.round(baseEenheden * multiplier),
      revenue: Math.round(baseRevenue * multiplier),
      clients: Math.round(baseClients * multiplier),
      contracts: Math.round(baseContracts * multiplier)
    };
  };

  const historicalData = getHistoricalData(timeframe);
  const growth = {
    eenheden: ((stats.totalEenheden - historicalData.eenheden) / historicalData.eenheden * 100).toFixed(1),
    revenue: ((stats.totalRevenue - historicalData.revenue) / historicalData.revenue * 100).toFixed(1),
    clients: ((stats.totalClients - historicalData.clients) / historicalData.clients * 100).toFixed(1),
    contracts: ((stats.totalContracts - historicalData.contracts) / historicalData.contracts * 100).toFixed(1)
  };

  return (
    <div className="space-y-8">
      {/* Calculator Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revenue Calculator</h1>
            <p className="text-gray-600">Calculate earnings and track progress toward FT tiers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Current Status</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Eenheden</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={currentEenheden}
                  onChange={(e) => setCurrentEenheden(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Current Tier</p>
                  <p className={`text-lg font-bold bg-gradient-to-r ${getTierColor(currentTier)} bg-clip-text text-transparent`}>
                    {currentTier}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-lg font-bold text-gray-900">€{currentRevenue.total.toFixed(0)}</p>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Revenue Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">FT1 (1000 × €1.5):</span>
                    <span className="font-medium">€{currentRevenue.breakdown.ft1.toFixed(0)}</span>
                  </div>
                  {currentRevenue.breakdown.ft2 > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-600">FT2 (2000 × €2):</span>
                      <span className="font-medium">€{currentRevenue.breakdown.ft2.toFixed(0)}</span>
                    </div>
                  )}
                  {currentRevenue.breakdown.ft3 > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">FT3 ({(currentEenhedenNum - 3000).toFixed(0)} × €2.5):</span>
                      <span className="font-medium">€{currentRevenue.breakdown.ft3.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Tier Progress */}
              {nextTierInfo && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-2">Progress to {nextTierInfo.nextTier}</p>
                  <p className="text-lg font-bold text-blue-900">
                    {nextTierInfo.needed.toFixed(0)} more Eenheden needed
                  </p>
                  <div className="mt-3 bg-white/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((currentEenhedenNum / (nextTierInfo.nextTier === 'FT2' ? 1000 : 3000)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Goal Calculator */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Goal Calculator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Eenheden</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter your target"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={targetEenheden}
                  onChange={(e) => setTargetEenheden(e.target.value)}
                />
              </div>

              {targetRevenue && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Target Tier</p>
                      <p className={`text-lg font-bold bg-gradient-to-r ${getTierColor(targetTier!)} bg-clip-text text-transparent`}>
                        {targetTier}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Target Revenue</p>
                      <p className="text-lg font-bold text-gray-900">€{targetRevenue.total.toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-green-700">Additional Eenheden Needed</p>
                        <p className="text-xl font-bold text-green-900">
                          {eenhedenDifference > 0 ? `+${eenhedenDifference.toFixed(0)}` : 'Goal Reached! ✅'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700">Additional Revenue</p>
                        <p className="text-xl font-bold text-green-900">
                          {revenueDifference > 0 ? `+€${revenueDifference.toFixed(0)}` : 'Goal Reached! ✅'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Target Revenue Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-3">Target Revenue Breakdown</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-600">FT1 (1000 × €1.5):</span>
                        <span className="font-medium">€{targetRevenue.breakdown.ft1.toFixed(0)}</span>
                      </div>
                      {targetRevenue.breakdown.ft2 > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-600">FT2 (2000 × €2):</span>
                          <span className="font-medium">€{targetRevenue.breakdown.ft2.toFixed(0)}</span>
                        </div>
                      )}
                      {targetRevenue.breakdown.ft3 > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">FT3 ({(targetEenhedenNum - 3000).toFixed(0)} × €2.5):</span>
                          <span className="font-medium">€{targetRevenue.breakdown.ft3.toFixed(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Performance */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Performance Tracking</h2>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
          >
            <option value="1day">Last 24 Hours</option>
            <option value="3days">Last 3 Days</option>
            <option value="1week">Last Week</option>
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">Eenheden</p>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalEenheden.toFixed(0)}</p>
            <p className="text-sm text-blue-700 mt-1">
              +{growth.eenheden}% <span className="text-blue-600">({historicalData.eenheden} → {stats.totalEenheden.toFixed(0)})</span>
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-700">Revenue</p>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-green-900">€{stats.totalRevenue.toFixed(0)}</p>
            <p className="text-sm text-green-700 mt-1">
              +{growth.revenue}% <span className="text-green-600">(€{historicalData.revenue} → €{stats.totalRevenue.toFixed(0)})</span>
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-700">Clients</p>
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.totalClients}</p>
            <p className="text-sm text-purple-700 mt-1">
              +{growth.clients}% <span className="text-purple-600">({historicalData.clients} → {stats.totalClients})</span>
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-orange-700">Contracts</p>
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-orange-900">{stats.totalContracts}</p>
            <p className="text-sm text-orange-700 mt-1">
              +{growth.contracts}% <span className="text-orange-600">({historicalData.contracts} → {stats.totalContracts})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
