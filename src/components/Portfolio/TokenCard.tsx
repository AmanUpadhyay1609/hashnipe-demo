import React from 'react';
import { TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface TokenCardProps {
  token: any;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  // Safely calculate percentage change for display
  const percentChange = token.usd_price_24hr_percent_change || 0;
  const isPositive = percentChange > 0;
  
  // Get fallback image for tokens without logos
  const getTokenImage = () => {
    if (token.logo) return token.logo;
    if (token.thumbnail) return token.thumbnail;
    return 'https://assets.staticimg.com/cms/media/1lB3PkckFDyfxz6VudCEoFYmV0gT9ow10NrQctXZf.png';
  };
  
  // Get security score color
  const getSecurityScoreColor = () => {
    if (!token.security_score) return 'bg-gray-600';
    if (token.security_score >= 80) return 'bg-green-500';
    if (token.security_score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return '0';
    if (num === 0) return '0';
    
    if (num < 0.00001) {
      return num.toExponential(4);
    }
    
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6
    }).format(num);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-750 transition-colors duration-200">
      {/* Token Info */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          <img 
            src={getTokenImage()} 
            alt={token.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://assets.staticimg.com/cms/media/1lB3PkckFDyfxz6VudCEoFYmV0gT9ow10NrQctXZf.png';
            }}
          />
        </div>
        <div className="ml-3">
          <div className="font-medium text-white flex items-center">
            {token.name}
            {token.security_score && (
              <span 
                className={`ml-2 w-2 h-2 rounded-full ${getSecurityScoreColor()}`} 
                title={`Security Score: ${token.security_score}`}
              ></span>
            )}
          </div>
          <div className="text-sm text-gray-400">{token.symbol}</div>
        </div>
      </div>
      
      {/* Balance */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white">{formatNumber(Number(token.balance_formatted))}</div>
        {token.possible_spam && (
          <div className="text-xs text-yellow-500 mt-1 flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Possible Spam
          </div>
        )}
      </div>
      
      {/* USD Value */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white">${formatNumber(Number(token.usd_value || 0))}</div>
        <div className={`text-xs flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(percentChange).toFixed(2)}% 24h
        </div>
      </div>
      
      {/* Portfolio % */}
      <div className="flex items-center">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full" 
            style={{ width: `${Math.min(token.portfolio_percentage || 0, 100)}%` }}
          ></div>
        </div>
        <span className="ml-2 text-white">{(token.portfolio_percentage || 0).toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default TokenCard;