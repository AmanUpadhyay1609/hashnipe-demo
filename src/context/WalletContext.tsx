import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createConfig, http, createStorage } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { createPublicClient } from 'viem';

interface WalletContextType {
  address: string | null;
  points: number;
  successRate: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

// Configure wagmi client
const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  storage: createStorage({ storage: window.localStorage }),
})

interface WalletProviderProps {
  children: ReactNode;
}

// Define ethereum window interface
declare global {
  interface Window {
    ethereum?: {
      request: (args: any) => Promise<any>;
      on: (event: string, listener: (...args: any[]) => void) => void;
      removeAllListeners: () => void;
    };
  }
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [successRate, setSuccessRate] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org')
  });

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        
        // Request accounts
        // @ts-ignore - Ignoring type issues with window.ethereum
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        // Request chain switch to Base
        try {
          // @ts-ignore - Ignoring type issues with window.ethereum
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${base.id.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              // @ts-ignore - Ignoring type issues with window.ethereum
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${base.id.toString(16)}`,
                    chainName: 'Base',
                    nativeCurrency: {
                      name: 'Ethereum',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org'],
                  },
                ],
              });
            } catch (addError) {
              console.error('Error adding Base chain to wallet', addError);
            }
          }
        }
        
        setAddress(accounts[0]);
        
        // Fetch user points and success rate from backend
        // This is a placeholder - implement actual API call
        setPoints(0);
        setSuccessRate(0);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      console.error('Please install MetaMask');
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setPoints(0);
    setSuccessRate(0);
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window.ethereum !== 'undefined') {
      // @ts-ignore - Ignoring type issues with window.ethereum
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: any) => {
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
          }
        });
        
      // Handle account changes
      const handleAccountsChanged = (accounts: any) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
        }
      };
      
      // Handle chain changes
      const handleChainChanged = () => {
        window.location.reload();
      };
      
      // Add event listeners
      // @ts-ignore - Ignoring type issues with window.ethereum
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // @ts-ignore - Ignoring type issues with window.ethereum
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        // Remove event listeners if possible
        if (window.ethereum) {
          try {
            // @ts-ignore - Ignoring type issues with window.ethereum
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            // @ts-ignore - Ignoring type issues with window.ethereum
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          } catch (err) {
            console.error('Error removing event listeners:', err);
          }
        }
      };
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      address,
      points,
      successRate,
      connect,
      disconnect,
      isConnecting
    }}>
      {children}
    </WalletContext.Provider>
  );
};