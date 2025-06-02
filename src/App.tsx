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

// Add LoadingScreen component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-500">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
  </div>
);

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated, authStatus } = useAuth();
  console.log("is authenticated",isAuthenticated)

  // Show loading screen while checking authentication
  if (authStatus === 'loading') {
    return <LoadingScreen />;
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
            <AppRoutes />
          </GenesisProvider>
        </ApiProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;