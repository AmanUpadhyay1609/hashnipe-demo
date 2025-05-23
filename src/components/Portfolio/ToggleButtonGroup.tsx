import React from 'react';

interface ToggleButtonGroupProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All Tokens' },
    { id: 'virtual', label: 'Virtual' },
    { id: 'genesis', label: 'Genesis Launches' },
    { id: 'unlock', label: 'Token Unlock' },
  ];

  return (
    <div className="flex flex-wrap gap-2 bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButtonGroup;