import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TokenListPage } from './pages/TokenListPage';
import { Layout } from './components/layout/Layout';
import { UserLayout } from './components/layout/UserLayout';
import { GenesisProvider } from './context/GenesisContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import PortfolioPage from './components/Portfolio/PortfolioPage';
import TokenDetailsPage from './pages/TokenDetailsPage';
import Tokenpage from './pages/Tokenpage';
import { TokenPage } from './components/TokenList/TokenPage';

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
    <UserLayout>
      <Routes>
        <Route path="/" element={<Tokenpage />} />
        <Route path="/test" element={<TokenPage/>}/>
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
        <GenesisProvider>
          <AppRoutes />
        </GenesisProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;