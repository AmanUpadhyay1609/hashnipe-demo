import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TokenListPage } from './pages/TokenListPage';
import { TokenDetailPage } from './pages/TokenDetailPage';
import { Layout } from './components/layout/Layout';
import { UserLayout } from './components/layout/UserLayout';
import { GenesisProvider } from './context/GenesisContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

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
        <Route path="/" element={<TokenListPage />} />
        <Route path="/tokens" element={<TokenListPage />} />
        <Route path="/tokens/:id" element={<TokenDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
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