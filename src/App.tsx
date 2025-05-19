import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TokenListPage } from './pages/TokenListPage';
import { TokenDetailPage } from './pages/TokenDetailPage';
import { Layout } from './components/layout/Layout';
import { GenesisProvider } from './context/GenesisContext';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <Router>
        <GenesisProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tokens" element={<TokenListPage />} />
              <Route path="/tokens/:id" element={<TokenDetailPage />} />
            </Routes>
          </Layout>
        </GenesisProvider>
      </Router>
    </WalletProvider>
  );
}

export default App;