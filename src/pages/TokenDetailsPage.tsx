import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TokenInfo from '../components/TokenDetails/TokenInfo';
import DetailsTabs from '../components/TokenDetails/DetailsTabs';
import LaunchedToken from '../components/TokenDetails/LaunchedToken';
import UnlaunchedToken from '../components/TokenDetails/UnlaunchedToken';
import SwapCard from '../components/TokenDetails/SwapCard';

// Sample data - in real app, you'd fetch this based on the token ID
import { sampleLaunchedTokenData } from '../data/sampleLaunchedToken';
import { sampleUnlaunchedTokenData } from '../data/sampleUnlaunchedToken';

const TokenDetailsPage: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  // This would be determined by your routing or data fetching
  // For demo, let's assume we get this from a prop or context
  const isLaunched = tokenId === 'VIRTUAL'; // Example logic
  
  const tokenData = isLaunched ? sampleLaunchedTokenData : sampleUnlaunchedTokenData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <TokenInfo 
              tokenData={tokenData} 
              isLaunched={isLaunched} 
            />
            
            {/* Conditional rendering based on token launch status */}
            {isLaunched ? (
              <LaunchedToken tokenData={tokenData} />
            ) : (
              <UnlaunchedToken tokenData={tokenData} />
            )}
            
            {/* Tabs for additional information */}
            <DetailsTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              tokenData={tokenData}
            />
          </div>
          
          {/* Right column - 1/3 width on large screens */}
          <div className="space-y-6">
            <SwapCard 
              tokenData={tokenData}
              isLaunched={isLaunched}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailsPage;