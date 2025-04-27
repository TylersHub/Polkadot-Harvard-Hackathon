export interface Loan {
  _id: string;
  loanId: number;
  borrower: string;
  principal: string;
  startBps: number;
  minBps: number;
  maturity: number;
  funded: string;
  category?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  __v: number;
}

export interface User {
  address: string;
  investments: Investment[];
  loans: number[];
}

export interface Investment {
  loanId: number;
  amount: string;
  useUSDC: boolean;
  timestamp: number;
}

export type WalletStatus = 'connecting' | 'connected' | 'disconnected';

export interface TransactionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  txHash: string | null;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface FundPayload {
  loanId: number;
  investor: string;
  amount: string;
  useUSDC: boolean;
}

export interface WithdrawPayload {
  loanId: number;
  investor: string;
}

export interface CreateLoanPayload {
  loanId: number;
  borrower: string;
  principal: string;
  startBps: number;
  minBps: number;
  maturity: number;
  category?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export type CategoryType = 'car' | 'bakery' | 'real-estate' | 'other';