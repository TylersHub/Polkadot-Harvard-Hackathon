import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSWR from 'swr';
import { Loan } from '../types';
import { fetchListings } from '../api/listings';
import { MOCK_ENABLED } from '../config';
import { getMockListings } from '../utils/mockData';

interface ListingsContextType {
  listings: Loan[];
  isLoading: boolean;
  error: any;
  refreshListings: () => void;
  categorizedListings: Record<string, Loan[]>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const ListingsContext = createContext<ListingsContextType>({} as ListingsContextType);

export const useListings = () => useContext(ListingsContext);

export const ListingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data, error, isLoading, mutate } = useSWR<Loan[]>(
    'listings',
    MOCK_ENABLED ? getMockListings : fetchListings,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  const listings = data || [];

  // Group listings by category
  const categorizedListings = listings.reduce<Record<string, Loan[]>>((acc, loan) => {
    const category = loan.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(loan);
    return acc;
  }, { all: listings });

  return (
    <ListingsContext.Provider
      value={{
        listings,
        isLoading,
        error,
        refreshListings: mutate,
        categorizedListings,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};