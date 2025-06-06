import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ethers } from 'ethers';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Define types
interface ApiContextType {
    getToken: (chainId: string | number) => Promise<any>;
    getBalance: (tokenAddress: string, walletAddress: string) => Promise<any>,
    virtualBalance: string;
    isLoadingBalance: boolean;
    errorBalance: string | null;
    refreshBalance: () => Promise<void>;
    swap: (params: SwapParams) => Promise<any>;
    balances: any;
}

// Add the swap parameters interface
interface SwapParams {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    slippage: number;
    walletAddress: string;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const BaseUrl = import.meta.env.VITE_BACKEND_URL;
const VIRTUAL_TOKEN_ADDRESS = '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b';

export function ApiProvider({ children }: { children: React.ReactNode }) {
    const { decodedToken, isAuthenticated } = useAuth();
    const [virtualBalance, setVirtualBalance] = useState<string>('0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [errorBalance, setErrorBalance] = useState<string | null>(null);
    const [balances, setallTokens] = useState([]);

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

    const getAllBalance = useCallback(async (address: string) => {
        try {
            const options = {
                headers: {
                    accept: "application/json",
                    "X-API-KEY": `${import.meta.env.VITE_MORALIS_KEY}`,
                },
            };
            const moralisApi = "https://deep-index.moralis.io/api/v2.2/wallets/";
            const url = moralisApi + address + "/tokens?chain=" + "base";
            const data = (await axios.get(url, options)).data;
            const result = data.result;

            setallTokens(result);
            return result;
        } catch (e) {
            console.error("error in getting account balance base", e);
            return null;
        }

    }, [])

    const swap = useCallback(async ({
        fromTokenAddress,
        toTokenAddress,
        amount,
        slippage,
        walletAddress
    }: SwapParams): Promise<any> => {
        const authToken = Cookies.get('auth_token');
        if (!authToken) {
            throw new Error('Authentication token not found');
        }

        try {
            const response = await fetch(`${BaseUrl}/api/v1/swap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    fromTokenAddress,
                    toTokenAddress,
                    amount,
                    slippage,
                    walletAddress
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Swap error:', error);
            throw error;
        }
    }, []);

    // Fetch balance on mount and when auth state changes
    useEffect(() => {
        fetchBalance();
        getAllBalance(decodedToken.wallets.base);
    }, []);

    return (
        <ApiContext.Provider value={{
            getToken,
            getBalance,
            virtualBalance,
            isLoadingBalance,
            errorBalance,
            refreshBalance: fetchBalance,
            swap,
            balances
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