import React, { useState, useEffect } from 'react';
import ToggleButtonGroup from './ToggleButtonGroup';
import TokenList from './TokenList';
import EmptyState from './EmptyState';
import { Wallet } from 'lucide-react';
// import { getAccountBalance } from '../../utils/api'; // Import your existing function
import axios from 'axios';
import { virtualTokensData } from '../../data/tokenData';
import { useGenesis } from '../../context/GenesisContext';
import { useAuth } from '../../context/AuthContext';
import GenesisList from './SnipeStatus';
import { useApi } from '../../context/ApiContext';
import {SwapForm} from './../SwapForm';
import { Suportedtokens } from '../../data/supportedTokens';

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [virtualTokens, setVirtualTokens] = useState<any[]>([]);
  const [genesisLaunches, setGenesisLaunches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { decodedToken, jwt } = useAuth();
  const { balances } = useApi();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletAddress = decodedToken?.wallets?.base || localStorage.getItem('walletAddress');
        if (!walletAddress) {
          console.warn('No wallet address found in decodedToken or localStorage');
        }

        if (!walletAddress) {
          throw new Error('Wallet address not found in localStorage');
        }

        setIsLoading(true);
        setError(null);

        // Fetch real tokens using your existing function

        if (!balances) throw new Error('Failed to fetch token balances');
        const filteredToken = balances.result.filter((token: any) => {
          return token.usd_price > 0;
        });

        setAllTokens(filteredToken ? filteredToken : []);

        // Fetch virtual tokens
        const virtualResponse = await fetch(
          `https://api.virtuals.io/api/wallets/${walletAddress}/holdings`
        );
        console.log('Virtual Tokens Response:', virtualResponse);
        if (!virtualResponse.ok) throw new Error('Virtual tokens fetch failed');
        const virtualData = await virtualResponse.json();
        setVirtualTokens(virtualData.data ? virtualData.data : virtualTokensData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGenesisLaunches = async () => {
      try {
        const response = await fetch(
          `https://dexter-backend-ucdt5.ondigitalocean.app/api/user-transactions/${decodedToken.wallets.base}/agents`,
          {
            headers: {
              'Authorization': `Bearer ${jwt}`,
            }
          }
        );
        const data = await response.json();
        setGenesisLaunches(data.data.agents || []);
      } catch (err) {
        console.error('Failed to fetch genesis launches:', err);
      }
    };

    if (activeTab === 'genesis') {
      fetchGenesisLaunches();
    }
  }, [activeTab]);

  const renderMainContent = () => {
    if (isLoading) return <div className="text-center py-4">Loading tokens...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    switch (activeTab) {
      case 'all':
        return <TokenList tokens={allTokens} />;
      case 'virtual':
        return <TokenList tokens={virtualTokens} isVirtual />;
      case 'genesis':
        return genesisLaunches.length > 0 ? (
          <GenesisList launches={genesisLaunches} />
        ) : (
          <div className="bg-dark-400 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary-400 mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Genesis Launches Yet</h2>
              <p className="text-gray-400 text-center">You haven't participated in any genesis launches yet.</p>
            </div>
          </div>
        );
      // ...other cases
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center mb-8">
          <Wallet className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-primary-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-400">Portfolio</h1>
        </div>

        <div className="mb-8">
          <ToggleButtonGroup
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="border-b border-dark-300"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {isLoading ? (
              <div className="bg-dark-400 rounded-xl p-6 sm:p-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-primary-400/10 rounded w-32 mb-4"></div>
                  <div className="h-4 bg-primary-400/10 rounded w-24"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {renderMainContent()}
              </div>
            )}
          </div>

          {/* Swap Form Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-6">
              <SwapForm
                userBalances={allTokens}
                supportedTokens={Suportedtokens}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;





