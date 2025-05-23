import React from 'react';
import { TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface TokenCardProps {
  token: any;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const percentChange = token.usd_price_24hr_percent_change || 0;
  const isPositive = percentChange > 0;
  
  // Create token initials for fallback
  const getTokenInitials = () => {
    const words = token.name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  const [imageError, setImageError] = React.useState(false);
  
  const getTokenImage = () => {
    if (imageError) {
      return (
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {getTokenInitials()}
        </div>
      );
    }
    const imageUrl = token.logo || token.thumbnail;
    return (
      <img 
        src={imageUrl}
        alt={token.name} 
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };
  
  const getSecurityScoreColor = () => {
    if (!token.security_score) return 'bg-gray-600';
    if (token.security_score >= 80) return 'bg-green-500';
    if (token.security_score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-750 transition-colors duration-200">
      {/* Token Info */}
      <div className="flex items-center col-span-2 md:col-span-1">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          {getTokenImage()}
        </div>
        <div className="ml-2 sm:ml-3">
          <div className="font-medium text-white flex items-center text-sm sm:text-base">
            {token.name}
            {token.security_score && (
              <span 
                className={`ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getSecurityScoreColor()}`} 
                title={`Security Score: ${token.security_score}`}
              ></span>
            )}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">{token.symbol}</div>
        </div>
      </div>
      
      {/* Balance */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white text-sm sm:text-base">{formatNumber(Number(token.balance_formatted))}</div>
        {token.possible_spam && (
          <div className="text-xs text-yellow-500 mt-1 flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Spam
          </div>
        )}
      </div>
      
      {/* USD Value */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white text-sm sm:text-base">${formatNumber(Number(token.usd_value || 0))}</div>
        <div className={`text-xs flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(percentChange).toFixed(2)}% 24h
        </div>
      </div>
      
      {/* Portfolio % */}
      <div className="flex items-center col-span-2 md:col-span-1">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${Math.min(token.portfolio_percentage || 0, 100)}%` }}
          ></div>
        </div>
        <span className="ml-2 text-white text-sm">{(token.portfolio_percentage || 0).toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default TokenCard;