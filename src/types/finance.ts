
export type ContractType = 'PS' | 'LS' | 'DELA' | 'BL';
export type FTTier = 'FT1' | 'FT2' | 'FT3';

export interface Document {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  type: string;
}

export interface Contract {
  id: string;
  type: ContractType;
  amount: number;
  eenheden: number;
  startDate: Date;
  documents: Document[];
}

export interface Client {
  id: string;
  name: string;
  description: string;
  isPinned: boolean;
  contracts: Contract[];
  createdAt: Date;
}

export interface Stats {
  totalClients: number;
  totalContracts: number;
  totalEenheden: number;
  totalRevenue: number;
  currentFTTier: FTTier;
}
