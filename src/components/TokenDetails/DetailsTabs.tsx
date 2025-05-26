import React from 'react';
import TeamDetails from './tabs/TeamDetails';
import ProjectDetails from './tabs/ProjectDetails';
import Tokenomics from './tabs/Tokenomics';

interface DetailsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tokenData: any;
}

const DetailsTabs: React.FC<DetailsTabsProps> = ({ activeTab, setActiveTab, tokenData }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Team Details' },
    { id: 'project', label: 'Project Details' },
    { id: 'tokenomics', label: 'Tokenomics' },
    { id: 'holders', label: 'Holders' },
  ];
  
  return (
    <div className="bg-dark-500 rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-dark-500">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id 
                  ? 'text-cyan-400 border-b-2 border-cyan-400' 
                  : 'text-whitehover:bg-gray-700/30'
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-5">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About {tokenData.name || tokenData.data.virtual.name}</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {tokenData.data?.virtual?.description || 'No description available.'}
            </p>
          </div>
        )}
        
        {activeTab === 'team' && <TeamDetails tokenData={tokenData} />}
        {activeTab === 'project' && <ProjectDetails tokenData={tokenData} />}
        {activeTab === 'tokenomics' && <Tokenomics tokenData={tokenData} />}
        
        {activeTab === 'holders' && (
          <div className="text-center py-10">
            <p className="text-gray-400">Holder information will be available after launch</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsTabs;