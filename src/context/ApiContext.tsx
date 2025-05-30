import React, { createContext, useContext, useCallback } from 'react';
import Cookies from 'js-cookie';

// Define types
interface ApiContextType {
    getToken: (chainId: string | number) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const BaseUrl = import.meta.env.VITE_BACKEND_URL;

export function ApiProvider({ children }: { children: React.ReactNode }) {
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

    return (
        <ApiContext.Provider value={{
            getToken
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