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
    <div className="min-h-screen py-4">
      <div className="container mx-auto px-1">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left column - 2/3 width on large screens */}
          <div className="flex-1">
            <div className="space-y-4">
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
          </div>
          
          {/* Right column - 1/3 width on large screens */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
            <div className="space-y-4">
              <SwapCard
                tokenData={tokenData}
                isLaunched={isLaunched}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailsPage;