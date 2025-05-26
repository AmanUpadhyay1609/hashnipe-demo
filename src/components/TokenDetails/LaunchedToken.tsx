import React from 'react';
import CandlestickChart from './charts/CandlestickChart';
import TokenStats from './TokenStats';

interface LaunchedTokenProps {
  tokenData: any;
}

const LaunchedToken: React.FC<LaunchedTokenProps> = ({ tokenData }) => {
  return (
    <div className="space-y-6">
      {/* Price chart */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Price Chart</h2>
          <div className="flex space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded transition">1H</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded transition">4H</button>
            <button className="bg-cyan-900/70 hover:bg-cyan-800 text-sm px-3 py-1 rounded transition">1D</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded transition">1W</button>
          </div>
        </div>
        
        <CandlestickChart data={tokenData.chartData || []} />
      </div>
      
      {/* Market stats */}
      <TokenStats tokenData={tokenData} />
    </div>
  );
};

export default LaunchedToken;