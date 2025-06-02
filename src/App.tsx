import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Layout } from './components/layout/Layout';
import { UserLayout } from './components/layout/UserLayout';
import { GenesisProvider } from './context/GenesisContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import PortfolioPage from './components/Portfolio/PortfolioPage';
import TokenDetailsPage from './pages/TokenDetailsPage';
import Tokenpage from './pages/Tokenpage';
import { TokenPage } from './components/TokenList/TokenPage';
import { ApiProvider } from './context/ApiContext';
import { TokensProvider } from './context/TokensContext';

// App Routes Component
const AppRoutes = () => {
  const { authStatus, isAuthenticated } = useAuth();

  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

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
    <UserLayout>
      <Routes>
        <Route path="/" element={<Tokenpage />} />
        <Route path="/test" element={<TokenPage />} />
        <Route path="/tokens/:id" element={<TokenDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </UserLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ApiProvider>
          <GenesisProvider>
            <TokensProvider>
              <AppRoutes />
            </TokensProvider>
          </GenesisProvider>
        </ApiProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;