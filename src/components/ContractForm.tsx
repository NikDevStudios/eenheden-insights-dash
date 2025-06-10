
import React, { useState } from 'react';
import { Contract, ContractType } from '../types/finance';

interface ContractFormProps {
  onSubmit: (contract: Omit<Contract, 'id'>) => void;
  onCancel: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState<ContractType>('PS');
  const [amount, setAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const calculateEenheden = (contractType: ContractType, contractAmount: number): number => {
    switch (contractType) {
      case 'PS':
        return Math.min(contractAmount * 0.96, 87.50);
      case 'LS':
        return Math.min(contractAmount * 0.96, 210.83);
      case 'DELA':
        return 60;
      case 'BL':
        return contractAmount * 0.73;
      default:
        return 0;
    }
  };

  const currentAmount = parseFloat(amount) || 0;
  const calculatedEenheden = calculateEenheden(type, currentAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentAmount <= 0 && type !== 'DELA') {
      alert('Please enter a valid amount');
      return;
    }

    const contract: Omit<Contract, 'id'> = {
      type,
      amount: type === 'DELA' ? 0 : currentAmount,
      eenheden: calculatedEenheden,
      startDate: new Date(startDate),
      documents: []
    };

    onSubmit(contract);
  };

  const contractTypeInfo = {
    PS: {
      name: 'PS Contract',
      description: 'Amount × 0.96 = Eenheden (max €87.50)',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    LS: {
      name: 'LS Contract',
      description: 'Amount × 0.96 = Eenheden (max €210.83)',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    DELA: {
      name: 'DELA Contract',
      description: 'Fixed at 60 Eenheden',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    BL: {
      name: 'BL Contract',
      description: 'Amount × 0.73 = Eenheden',
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Contract</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Contract Type</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(contractTypeInfo).map(([typeKey, info]) => (
              <button
                key={typeKey}
                type="button"
                onClick={() => setType(typeKey as ContractType)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  type === typeKey
                    ? `${info.color} border-current`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{info.name}</div>
                <div className="text-xs mt-1 opacity-75">{info.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        {type !== 'DELA' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Amount (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter contract amount"
            />
            {currentAmount > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Calculated Eenheden: <span className="font-semibold">{calculatedEenheden.toFixed(2)}</span>
              </p>
            )}
          </div>
        )}

        {/* DELA Information */}
        {type === 'DELA' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              <strong>DELA Contract:</strong> Fixed at 60 Eenheden (no amount required)
            </p>
          </div>
        )}

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Contract Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Contract Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Type:</strong> {contractTypeInfo[type].name}</p>
            {type !== 'DELA' && <p><strong>Amount:</strong> €{currentAmount.toFixed(2)}</p>}
            <p><strong>Eenheden:</strong> {calculatedEenheden.toFixed(2)}</p>
            <p><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Add Contract
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
