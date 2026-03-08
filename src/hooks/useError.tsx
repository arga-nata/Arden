'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorContextType {
  message: string | null;
  showError: (msg: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  const showError = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  const clearError = () => setMessage(null);

  return (
    <ErrorContext.Provider value={{ message, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used inside ErrorProvider');
  }
  return context;
};
