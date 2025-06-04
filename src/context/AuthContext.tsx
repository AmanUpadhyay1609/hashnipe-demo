import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Add provider type to DecodedToken interface
interface DecodedToken {
    chatId?: string;
    wallets?: { base: string, solana: string };
    exp: number;
    iat: number;
    provider?: boolean;
}

// Add provider status to context
interface AuthContextType {
    isAuthenticated: boolean;
    jwt: string | null;
    decodedToken: DecodedToken | null;
    setJwt: (token: string) => void;
    logout: () => void;
    authStatus: 'loading' | 'authenticated' | 'unauthenticated';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [jwt, setJwtState] = useState<string | null>(() => {
        return Cookies.get('auth_token') || null;
    });

    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(() => {
        const token = Cookies.get('auth_token');
        if (!token) return null;
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    });

    const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    // Add provider state
    const [Provider, setProvider] = useState('');

    const verifyAuthentication = async (token: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setAuthStatus('authenticated');
                return true;
            } else if (response.status === 401) {
                setAuthStatus('unauthenticated');
                logout();
                return false;
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            setAuthStatus('unauthenticated');
            logout();
            return false;
        }
    };

    useEffect(() => {
        if (jwt) {
            verifyAuthentication(jwt);
        } else {
            setAuthStatus('unauthenticated');
        }
    }, [jwt]);

    const setJwt = (token: string) => {
        Cookies.set('auth_token', token, { expires: 7 }); // Expires in 7 days
        setJwtState(token);
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            setDecodedToken(decoded);
        } catch (error) {
            console.error('Error decoding token:', error);
            setDecodedToken(null);
        }
    };

    // Modify logout to clear provider status
    const logout = () => {
        Cookies.remove('auth_token');
        setJwtState(null);
        setDecodedToken(null);
    };

    const isAuthenticated = authStatus === 'authenticated';

    // Update context provider value
    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            jwt,
            decodedToken,
            setJwt,
            logout,
            authStatus,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}