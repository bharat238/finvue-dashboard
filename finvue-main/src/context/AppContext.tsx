import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Transaction, mockTransactions } from '@/data/mockTransactions';

export type SectionType = 'dashboard' | 'transactions' | 'insights' | 'settings';
export type RoleType = 'admin' | 'viewer';
export type ToastType = { message: string; type: 'success' | 'error' | 'info' } | null;

interface Filters {
  search: string;
  category: string;
  type: 'all' | 'income' | 'expense';
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

interface AppState {
  transactions: Transaction[];
  filters: Filters;
  currentPage: number;
  activeSection: SectionType;
  activeRole: RoleType;
  modalOpen: boolean;
  editingTransaction: Transaction | null;
  toast: ToastType;
}

type Action =
  | { type: 'SET_SECTION'; payload: SectionType }
  | { type: 'SET_ROLE'; payload: RoleType }
  | { type: 'SET_FILTER'; payload: Partial<Filters> }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_EDITING'; payload: Transaction | null }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' };

function loadTransactions(): Transaction[] {
  try {
    const saved = localStorage.getItem('vault_transactions');
    if (saved) return JSON.parse(saved);
  } catch {}
  return mockTransactions;
}

function loadRole(): RoleType {
  try {
    const saved = localStorage.getItem('vault_role');
    if (saved === 'admin' || saved === 'viewer') return saved;
  } catch {}
  return 'admin';
}

const initialState: AppState = {
  transactions: loadTransactions(),
  filters: { search: '', category: 'All', type: 'all', sortBy: 'date-desc' },
  currentPage: 1,
  activeSection: 'dashboard',
  activeRole: loadRole(),
  modalOpen: false,
  editingTransaction: null,
  toast: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SECTION': return { ...state, activeSection: action.payload };
    case 'SET_ROLE': return { ...state, activeRole: action.payload };
    case 'SET_FILTER': return { ...state, filters: { ...state.filters, ...action.payload }, currentPage: 1 };
    case 'SET_PAGE': return { ...state, currentPage: action.payload };
    case 'ADD_TRANSACTION': return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION': return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRANSACTION': return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'OPEN_MODAL': return { ...state, modalOpen: true };
    case 'CLOSE_MODAL': return { ...state, modalOpen: false, editingTransaction: null };
    case 'SET_EDITING': return { ...state, editingTransaction: action.payload, modalOpen: true };
    case 'SHOW_TOAST': return { ...state, toast: action.payload };
    case 'HIDE_TOAST': return { ...state, toast: null };
    default: return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('vault_transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('vault_role', state.activeRole);
  }, [state.activeRole]);

  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function formatINR(amount: number): string {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
}
