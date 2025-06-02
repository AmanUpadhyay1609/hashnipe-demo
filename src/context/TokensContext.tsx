import React, { createContext, useContext, useEffect, useState } from 'react';

interface Token {
  decimals: string;
  tokenContractAddress: string;
  tokenLogoUrl: string;
  tokenName: string;
  tokenSymbol: string;
}

interface TokensContextType {
  tokens: Token[];
  loading: boolean;
  error: string | null;
}

const TokensContext = createContext<TokensContextType>({
  tokens: [],
  loading: false,
  error: null,
});

export const useTokens = () => {
  const context = useContext(TokensContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokensProvider');
  }
  return context;
};

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<Token[]>(() => {
    const cached = localStorage.getItem('supportedTokens');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/supported-tokens/8453`, {
          headers: {
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGF0SWQiOiI2NDY5MDUwMjI1Iiwid2FsbGV0cyI6eyJiYXNlIjoiMHgzQjM1QzA0MkFlMjVGRTNkMjYyMTU4ZWM4ODVDRjdlMDQyQzU4QzQyIiwic29sYW5hIjoiOXg1a1liSmdKNldvSFFheUFEbVRZR2g5NFNiTGRibmVjS1A4YlJyN3g5dU0ifSwiaWF0IjoxNzQ4ODQ2NjE0LCJleHAiOjE3NDk0NTE0MTR9.1l21I1-EEkgOYyh-P36xPli--3K7OSy6O9RmHCSHSIo'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }

        const data = await response.json();
        console.log(data.data, 'data of supported tokens');
        setTokens(data.data || []);
        localStorage.setItem('supportedTokens', JSON.stringify(data.data || []));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return (
    <TokensContext.Provider value={{ tokens, loading, error }}>
      {children}
    </TokensContext.Provider>
  );
};