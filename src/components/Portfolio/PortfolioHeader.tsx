import React from 'react';
import { ArrowDownUp, Info } from 'lucide-react';

interface PortfolioHeaderProps {
  totalBalance: number;
  totalValue: number;
  change24h: number;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ totalBalance, totalValue, change24h }) => {
  const isPositive = change24h >= 0;
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-white">Portfolio Overview</h2>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-750 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Total Balance</div>
          <div className="text-2xl font-bold text-white">{totalBalance.toFixed(4)}</div>
        </div>
        
        <div className="bg-gray-750 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Total Value</div>
          <div className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</div>
        </div>
        
        <div className="bg-gray-750 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">24h Change</div>
          <div className={`text-2xl font-bold flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            <ArrowDownUp className={`ml-2 w-5 h-5 ${isPositive ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;