import React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

interface TokenInfoProps {
  tokenData: any;
  isLaunched: boolean;
}

const TokenInfo: React.FC<TokenInfoProps> = ({ tokenData, isLaunched }) => {
  const renderPriceChange = (change: string) => {
    const changeNum = parseFloat(change);
    return (
      <span className={`flex items-center ${changeNum >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {changeNum >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {Math.abs(changeNum).toFixed(2)}%
      </span>
    );
  };

  if (isLaunched) {
    const { 
      name, 
      tokenSymbol, 
      tokenLogoUrl, 
      price, 
      price_change_percentage,
      marketCap,
      volume,
      holders
    } = tokenData;
    
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <img 
            src={tokenLogoUrl} 
            alt={tokenSymbol} 
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded">
                {tokenSymbol}
              </span>
              <a 
                href={`https://basescan.org/token/${tokenData.tokenContractAddress}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-cyan-400 flex items-center"
              >
                <span className="text-xs truncate max-w-[180px]">{tokenData.tokenContractAddress}</span>
                <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Price</p>
            <p className="text-xl font-medium">${parseFloat(price).toFixed(8)}</p>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">24h Change</p>
            <p className="text-xl font-medium">
              {renderPriceChange(price_change_percentage.h24)}
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Market Cap</p>
            <p className="text-xl font-medium">
              ${Number(marketCap).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Holders</p>
            <p className="text-xl font-medium">{Number(holders).toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  } else {
    const { virtual } = tokenData.data;
    
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-4">
          {virtual.image?.url ? (
            <img 
              src={virtual.image.url} 
              alt={virtual.name} 
              className="w-12 h-12 rounded-full mr-4"
            />
          ) : (
            <div className="w-12 h-12 bg-cyan-900/50 rounded-full mr-4 flex items-center justify-center">
              {virtual.symbol?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{virtual.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded">
                {virtual.symbol}
              </span>
              <span className="text-sm bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded">
                Unlaunched
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Chain</p>
            <p className="font-medium">{virtual.chain || 'BASE'}</p>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Status</p>
            <p className="font-medium">{tokenData.data.status}</p>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Total Participants</p>
            <p className="font-medium">{tokenData.data.totalParticipants}</p>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Launch Date</p>
            <p className="font-medium">
              {new Date(tokenData.data.startsAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default TokenInfo;