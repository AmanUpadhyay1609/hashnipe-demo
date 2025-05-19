import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const { setJwt } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            setJwt(token);
            // Redirect to the page they tried to visit or home
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [searchParams, setJwt, navigate, location]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p>Please wait while we process your authentication...</p>
            </div>
        </div>
    );
} 