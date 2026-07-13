import React, { createContext, useContext } from 'react';

const ApiBaseContext = createContext<string | null>(null);

export function ApiBaseProvider({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <ApiBaseContext.Provider value={value}>{children}</ApiBaseContext.Provider>;
}

export function useApiBase(): string {
  const value = useContext(ApiBaseContext);
  if (!value) {
    throw new Error('useApiBase must be used within an ApiBaseProvider');
  }
  return value;
}
