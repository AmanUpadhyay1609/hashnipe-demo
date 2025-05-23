import React from 'react';
import { InfoIcon } from 'lucide-react';

interface VirtualTokenCardProps {
  token: any;
}

const VirtualTokenCard: React.FC<VirtualTokenCardProps> = ({ token }) => {
  // Format token role with appropriate styling
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'CREATIVE':
        return 'bg-purple-900 text-purple-300';
      case 'PRODUCTIVITY':
        return 'bg-blue-900 text-blue-300';
      case 'INFORMATION':
        return 'bg-green-900 text-green-300';
      case 'ON_CHAIN':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Format token status with appropriate styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500';
      case 'ACTIVATING':
        return 'bg-blue-500';
      case 'UNDERGRAD':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
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

  // Get token image URL with fallback
  const getTokenImage = () => {
    if (token.image && token.image.url) return token.image.url;
    return 'https://assets.staticimg.com/cms/media/1lB3PkckFDyfxz6VudCEoFYmV0gT9ow10NrQctXZf.png';
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
            <span 
              className={`ml-2 w-2 h-2 rounded-full ${getStatusStyle(token.status)}`} 
              title={`Status: ${token.status}`}
            ></span>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <span className="mr-2">${token.symbol}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleStyle(token.role)}`}>
              {token.role}
            </span>
          </div>
        </div>
      </div>
      
      {/* Amount */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white">{formatNumber(token.amount)}</div>
      </div>
      
      {/* VIRTUAL Value */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white">{formatNumber(Number(token.virtualTokenValue || 0))}</div>
        {token.chain && (
          <div className="text-xs text-gray-400">
            Chain: {token.chain}
          </div>
        )}
      </div>
      
      {/* USD Value */}
      <div className="flex items-center">
        <div className="font-medium text-white">${formatNumber(Number(token.usdValue || 0))}</div>
        {token.status === 'ACTIVATING' && (
          <button className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-xs text-white transition-colors">
            Stake
          </button>
        )}
      </div>
    </div>
  );
};

export default VirtualTokenCard;