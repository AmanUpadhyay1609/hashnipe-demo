import React from 'react';
import { Users } from 'lucide-react';

interface Subscriber {
  walletAddress: string;
  totalPoints: number;
  totalVirtuals: number;
}

interface TopSubscribersProps {
  subscribers: Subscriber[];
}

const TopSubscribers: React.FC<TopSubscribersProps> = ({ subscribers }) => {
  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-dark-500 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-dark-300 flex items-center justify-between">
        <div className="flex items-center">
          <Users size={18} className="text-cyan-400 mr-2" />
          <h2 className="text-xl font-semibold">Top Subscribers</h2>
        </div>
        <span className="bg-gray-700/50 text-xs px-2 py-1 rounded">
          {subscribers.length} entries
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-700/30">
              <th className="px-4 py-3 text-left font-medium">Rank</th>
              <th className="px-4 py-3 text-left font-medium">Wallet</th>
              <th className="px-4 py-3 text-right font-medium">Points</th>
              <th className="px-4 py-3 text-right font-medium">VIRTUAL</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.slice(0, 10).map((subscriber, index) => (
              <tr 
                key={subscriber.walletAddress}
                className={`border-b border-gray-700/50 ${index < 3 ? 'bg-dark-300' : ''} hover:bg-gray-700/30 transition-colors`}
              >
                <td className="px-4 py-3">
                  {index < 3 ? (
                    <span className={`
                      inline-flex items-center justify-center w-6 h-6 rounded-full
                      ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                        index === 1 ? 'bg-gray-400/20 text-gray-300' : 
                        'bg-amber-700/20 text-amber-600'}
                    `}>
                      {index + 1}
                    </span>
                  ) : (
                    <span className="text-gray-400">{index + 1}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono">
                  <a 
                    href={`https://basescan.org/address/${subscriber.walletAddress}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {formatAddress(subscriber.walletAddress)}
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  {Number(subscriber.totalPoints).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {Number(subscriber.totalVirtuals).toLocaleString(undefined, { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSubscribers;