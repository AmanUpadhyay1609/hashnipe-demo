import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ethers } from 'ethers';
import { useAuth } from './AuthContext';

// Define types
interface ApiContextType {
    getToken: (chainId: string | number) => Promise<any>;
    getBalance: (tokenAddress: string, walletAddress: string) => Promise<any>,
    virtualBalance: string;
    isLoadingBalance: boolean;
    errorBalance: string | null;
    refreshBalance: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const BaseUrl = import.meta.env.VITE_BACKEND_URL;
const VIRTUAL_TOKEN_ADDRESS = '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b';

export function ApiProvider({ children }: { children: React.ReactNode }) {
    const { decodedToken, isAuthenticated } = useAuth();
    const [virtualBalance, setVirtualBalance] = useState<string>('0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [errorBalance, setErrorBalance] = useState<string | null>(null);

    const getToken = useCallback(async (chainId: string | number) => {
        const authToken = Cookies.get('auth_token');

        if (!authToken) {
            throw new Error('Authentication token not found');
        }

        try {
            const response = await fetch(`${BaseUrl}/api/v1/supported-tokens/${chainId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    }, []);

    const getBalance = useCallback(async (
        tokenAddress: string,
        walletAddress: string
    ): Promise<any> => {
        const authToken = Cookies.get('auth_token');
        if (!authToken) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(
            `${BaseUrl}/getBalance?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.data.formattedBalance;
    }, []);

    const fetchBalance = useCallback(async () => {
        if (!isAuthenticated || !decodedToken?.wallets?.base) return;

        setIsLoadingBalance(true);
        setErrorBalance(null);

        try {
            const response = await getBalance(
                VIRTUAL_TOKEN_ADDRESS,
                decodedToken.wallets.base
            );


            setVirtualBalance(response);
        } catch (err) {
            setErrorBalance('Failed to fetch balance');
            console.error('Balance fetch error:', err);
        } finally {
            setIsLoadingBalance(false);
        }
    }, [isAuthenticated, decodedToken?.wallets?.base, getBalance]);

    // Fetch balance on mount and when auth state changes
    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return (
        <ApiContext.Provider value={{
            getToken,
            getBalance,
            virtualBalance,
            isLoadingBalance,
            errorBalance,
            refreshBalance: fetchBalance
        }}>
            {children}
        </ApiContext.Provider>
    );
}

export function useApi() {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
}