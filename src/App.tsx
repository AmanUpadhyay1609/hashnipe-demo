import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TokenListPage } from './pages/TokenListPage';
import { TokenDetailPage } from './pages/TokenDetailPage';
import { Layout } from './components/layout/Layout';
import { GenesisProvider } from './context/GenesisContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HeroSection } from './components/sections/HeroSection';
import { useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';

// Public Layout (for unauthenticated users)
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        {children}
      </motion.main>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tokens" element={<TokenListPage />} />
        <Route path="/tokens/:id" element={<TokenDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <GenesisProvider>
          <AppRoutes />
        </GenesisProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;