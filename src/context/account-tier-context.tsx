"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AccountTier = 'basic' | 'adventurer';

interface AccountTierContextType {
  accountTier: AccountTier;
  setAccountTier: (tier: AccountTier) => void;
  getThemeColors: () => {
    primary: string;
    primaryHover: string;
    accent: string;
    accentHover: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

const AccountTierContext = createContext<AccountTierContextType | undefined>(undefined);

export function AccountTierProvider({ children }: { children: ReactNode }) {
  const [accountTier, setAccountTier] = useState<AccountTier>('basic');

  const getThemeColors = () => {
    if (accountTier === 'adventurer') {
      return {
        primary: 'bg-purple-600',
        primaryHover: 'hover:bg-purple-700',
        accent: 'text-purple-400',
        accentHover: 'hover:text-purple-300',
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-purple-600',
      };
    }
    
    return {
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      accent: 'text-blue-400',
      accentHover: 'hover:text-blue-300',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
    };
  };

  return (
    <AccountTierContext.Provider value={{ accountTier, setAccountTier, getThemeColors }}>
      {children}
    </AccountTierContext.Provider>
  );
}

export function useAccountTier() {
  const context = useContext(AccountTierContext);
  if (context === undefined) {
    throw new Error('useAccountTier must be used within an AccountTierProvider');
  }
  return context;
}
