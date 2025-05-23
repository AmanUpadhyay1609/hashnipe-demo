import React from 'react';

interface VirtualTokenCardProps {
  token: any;
}

const VirtualTokenCard: React.FC<VirtualTokenCardProps> = ({ token }) => {
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
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
          {getTokenInitials()}
        </div>
      );
    }
    const imageUrl = token.image?.url;
    return (
      <img 
        src={imageUrl}
        alt={token.name} 
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-dark-400  transition-colors duration-200">
      {/* Token Info */}
      <div className="flex items-center col-span-2 md:col-span-1">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-dark-400  flex-shrink-0">
          {getTokenImage()}
        </div>
        <div className="ml-2 sm:ml-3">
          <div className="font-medium text-white flex items-center text-sm sm:text-base">
            {token.name}
            <span 
              className={`ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusStyle(token.status)}`} 
              title={`Status: ${token.status}`}
            ></span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 flex items-center flex-wrap gap-1">
            <span>${token.symbol}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleStyle(token.role)}`}>
              {token.role}
            </span>
          </div>
        </div>
      </div>
      
      {/* Amount */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white text-sm sm:text-base">{formatNumber(token.amount)}</div>
      </div>
      
      {/* VIRTUAL Value */}
      <div className="flex flex-col justify-center">
        <div className="font-medium text-white text-sm sm:text-base">{formatNumber(Number(token.virtualTokenValue || 0)/10**18)}</div>
        {token.chain && (
          <div className="text-xs text-gray-400">
            Chain: {token.chain}
          </div>
        )}
      </div>
      
      {/* USD Value */}
      <div className="flex items-center justify-between">
        <div className="font-medium text-white text-sm sm:text-base">${formatNumber(Number(token.usdValue || 0))}</div>
        {token.status === 'ACTIVATING' && (
          <button className="px-2 py-1 sm:px-3 sm:py-1 bg-primary-600 hover:bg-primary-700 rounded-md text-xs text-white transition-colors">
            Stake
          </button>
        )}
      </div>
    </div>
  );
};

export default VirtualTokenCard;