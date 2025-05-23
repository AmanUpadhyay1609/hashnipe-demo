import React, { useState } from 'react';
import ToggleButtonGroup from './ToggleButtonGroup';
import TokenList from './TokenList';
import { allTokensData, virtualTokensData } from '../../data/tokenData';
import EmptyState from './EmptyState';
import { Wallet } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <TokenList tokens={allTokensData.result} />;
      case 'virtual':
        return <TokenList tokens={virtualTokensData.data} isVirtual />;
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
        return <TokenList tokens={allTokensData.result} />;
    }
  };

  return (
    <div className="min-h-screen text-white" >
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center mb-4 sm:mb-6">
          <Wallet className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-blue-400">Portfolio</h1>
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