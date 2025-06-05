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

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [virtualTokens, setVirtualTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { decodedToken } = useAuth();


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
        const balances = await getAccountBalance(walletAddress);
        console.log("Balances", balances)
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

  const renderContent = () => {
    if (isLoading) return <div className="text-center py-4">Loading tokens...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    switch (activeTab) {
      case 'all':
        return <TokenList tokens={allTokens} />;
      case 'virtual':
        return <TokenList tokens={virtualTokens} isVirtual />;
      case 'genesis':
        return (
          <div className="bg-dark-400 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary-400 mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-white mb-2">Genesis Launches Coming Soon</h2>
              <p className="text-gray-400 text-center">New token launches will be available here soon.</p>
            </div>
          </div>
        );
      case 'unlock':
        return (
          <div className="bg-dark-400 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary-400 mb-4">⏰</div>
              <h2 className="text-2xl font-bold text-white mb-2">Token Unlock Schedule</h2>
              <p className="text-gray-400 text-center">Token unlock information will be displayed here.</p>
            </div>
          </div>
        );
      default:
        return <TokenList tokens={allTokens} />;
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

        {isLoading ? (
          <div className="bg-dark-400 rounded-xl p-6 sm:p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-primary-400/10 rounded w-32 mb-4"></div>
              <div className="h-4 bg-primary-400/10 rounded w-24"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;




const getAccountBalance = async (address: string) => {
  try {
    const options = {
      headers: {
        accept: "application/json",
        "X-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjNlMzg0NWE0LTdiOWYtNGRmMy04NTY2LTZjOTA1M2UxMjFkMiIsIm9yZ0lkIjoiNDI5OTUxIiwidXNlcklkIjoiNDQyMjYyIiwidHlwZUlkIjoiMTJhMzMwYzctYzE5Ni00NzA3LWEwOWEtOTc0ZmVjYjQ3MTE2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzg5MTA4OTcsImV4cCI6NDg5NDY3MDg5N30._kXK5NXDT78q3RLCYVRfbqhIOPDNwVBEBknmnZgFWng",
      },
    };
    const moralisApi = "https://deep-index.moralis.io/api/v2.2/wallets/";
    const url = moralisApi + address + "/tokens?chain=" + "base";
    const data = (await axios.get(url, options)).data;
    console.log("data for base chain-->", data);
    const result = data;
    // console.log("balances-->", balances);
    return result;
  } catch (e) {
    console.error("error in getting account balance base", e);
    return null;
  }
};
