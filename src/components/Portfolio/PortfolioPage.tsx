import React, { useState } from 'react';
import ToggleButtonGroup from './ToggleButtonGroup';
import TokenList from './TokenList';
import { allTokensData, virtualTokensData } from '../../data/tokenData';
import EmptyState from './EmptyState';
import { Wallet } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <TokenList tokens={allTokensData.result} />;
      case 'virtual':
        return <TokenList tokens={virtualTokensData.data} isVirtual />;
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
        return <TokenList tokens={allTokensData.result} />;
    }
  };

  return (
    <div className="min-h-screen text-white bg-dark-900">
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