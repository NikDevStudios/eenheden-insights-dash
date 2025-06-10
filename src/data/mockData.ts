
import { Client, Contract, ContractType } from '../types/finance';

const calculateEenheden = (type: ContractType, amount: number): number => {
  switch (type) {
    case 'PS':
      return Math.min(amount * 0.96, 87.50);
    case 'LS':
      return Math.min(amount * 0.96, 210.83);
    case 'DELA':
      return 60;
    case 'BL':
      return amount * 0.73;
    default:
      return 0;
  }
};

const createMockContract = (id: string, type: ContractType, amount: number, startDate: Date): Contract => ({
  id,
  type,
  amount,
  eenheden: calculateEenheden(type, amount),
  startDate,
  documents: []
});

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    description: 'Leading technology company specializing in enterprise software solutions.',
    isPinned: true,
    contracts: [
      createMockContract('c1', 'PS', 100, new Date('2024-01-15')),
      createMockContract('c2', 'DELA', 0, new Date('2024-02-01')),
    ],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Global Innovations Ltd',
    description: 'International consulting firm providing strategic business solutions.',
    isPinned: false,
    contracts: [
      createMockContract('c3', 'BL', 150, new Date('2024-03-10')),
    ],
    createdAt: new Date('2024-02-15')
  },
  {
    id: '3',
    name: 'TechStart Solutions',
    description: 'Innovative startup focused on digital transformation and cloud services.',
    isPinned: true,
    contracts: [
      createMockContract('c4', 'LS', 200, new Date('2024-04-05')),
      createMockContract('c5', 'PS', 75, new Date('2024-04-20')),
    ],
    createdAt: new Date('2024-03-01')
  },
  {
    id: '4',
    name: 'Enterprise Systems Inc',
    description: 'Large-scale system integrator specializing in financial software implementations.',
    isPinned: false,
    contracts: [
      createMockContract('c6', 'BL', 300, new Date('2024-05-01')),
      createMockContract('c7', 'DELA', 0, new Date('2024-05-15')),
      createMockContract('c8', 'PS', 120, new Date('2024-06-01')),
    ],
    createdAt: new Date('2024-04-10')
  }
];
