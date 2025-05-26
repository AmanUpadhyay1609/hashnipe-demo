import React from 'react';
import { BarChart, CircleUserRound, TrendingUp } from 'lucide-react';

interface TokenStatsProps {
  tokenData: any;
}

const TokenStats: React.FC<TokenStatsProps> = ({ tokenData }) => {
  const { 
    transactions, 
    volume_usd, 
    holders, 
    market_cap_usd, 
    price_change_percentage
  } = tokenData;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg">
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-xl font-semibold">Market Stats</h2>
      </div>
      
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/30 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Market Cap</p>
            <BarChart size={16} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium">
            ${Number(market_cap_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-gray-700/30 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">24h Volume</p>
            <TrendingUp size={16} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium">
            ${Number(volume_usd.h24).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-gray-700/30 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Holders</p>
            <CircleUserRound size={16} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium">{Number(holders).toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-700/30 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">24h Transactions</p>
          </div>
          <div className="flex justify-between">
            <span>Buys: {transactions.h24.buys}</span>
            <span>Sells: {transactions.h24.sells}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-400">5m</p>
          <p className={`font-medium ${parseFloat(price_change_percentage.m5) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {parseFloat(price_change_percentage.m5) >= 0 ? '+' : ''}{price_change_percentage.m5}%
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">1h</p>
          <p className={`font-medium ${parseFloat(price_change_percentage.h1) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {parseFloat(price_change_percentage.h1) >= 0 ? '+' : ''}{price_change_percentage.h1}%
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">6h</p>
          <p className={`font-medium ${parseFloat(price_change_percentage.h6) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {parseFloat(price_change_percentage.h6) >= 0 ? '+' : ''}{price_change_percentage.h6}%
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">24h</p>
          <p className={`font-medium ${parseFloat(price_change_percentage.h24) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {parseFloat(price_change_percentage.h24) >= 0 ? '+' : ''}{price_change_percentage.h24}%
          </p>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-400">Buys vs Sells (24h)</p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-l-full" 
            style={{ width: `${(transactions.h24.buys / (transactions.h24.buys + transactions.h24.sells)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span>Buys: {transactions.h24.buys}</span>
          <span>Sells: {transactions.h24.sells}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenStats;