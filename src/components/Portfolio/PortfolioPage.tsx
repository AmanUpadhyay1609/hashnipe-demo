import React, { useState, useEffect } from 'react';
import ToggleButtonGroup from './ToggleButtonGroup';
import TokenList from './TokenList';
import EmptyState from './EmptyState';
import { Wallet } from 'lucide-react';
// import { getAccountBalance } from '../../utils/api'; // Import your existing function
import axios from 'axios';
import { virtualTokensData } from '../../data/tokenData';

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [virtualTokens, setVirtualTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletAddress = localStorage.getItem('walletAddress')?.replace(/"/g, '');

        console.log('Wallet Address:', walletAddress);
        if (!walletAddress) {
          throw new Error('Wallet address not found in localStorage');
        }

        setIsLoading(true);
        setError(null);

        // Fetch real tokens using your existing function
        const balances = await getAccountBalance(walletAddress);
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
        return <EmptyState 
          title="Genesis Launches Coming Soon" 
          description="New token launches will be available here soon." 
        />;
      case 'unlock':
        return <EmptyState 
          title="Token Unlock Schedule" 
          description="Token unlock information will be displayed here." 
        />;
      default:
        return <TokenList tokens={allTokens} />;
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center mb-4 sm:mb-6">
          <Wallet className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-primary-400">Portfolio</h1>
        </div>
        
        <div className="mb-4 sm:mb-8">
          <ToggleButtonGroup 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>

        {renderContent()}
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
