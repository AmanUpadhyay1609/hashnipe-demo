import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    chatId?: string;
    wallets?: { base: string, solana: string };
    exp: number;
    iat: number;
}

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

    const verifyAuthentication = async (token: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/`, {
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

    const logout = () => {
        Cookies.remove('auth_token');
        setJwtState(null);
        setDecodedToken(null);
    };

    const isAuthenticated = authStatus === 'authenticated';

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            jwt,
            decodedToken,
            setJwt,
            logout,
            authStatus
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