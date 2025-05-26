import React from 'react';
import TopSubscribers from './TopSubscribers';

interface UnlaunchedTokenProps {
  tokenData: any;
}

const UnlaunchedToken: React.FC<UnlaunchedTokenProps> = ({ tokenData }) => {
  const { data, totalPoints, totalVirtuals, totalParticipants } = tokenData;
  const launchDate = new Date(data.startsAt);
  const now = new Date();
  
  // Calculate time remaining until launch
  const timeRemaining = launchDate.getTime() - now.getTime();
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  return (
    <div className="space-y-6">
      {/* Launch information */}
      <div className="bg-dark-500 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Launch Information</h2>
        
        {timeRemaining > 0 ? (
          <div className="mb-6">
            <p className="text-white mb-2">Time until launch</p>
            <div className="flex space-x-4">
              <div className="bg-dark-300 p-3 rounded-lg text-center min-w-[80px]">
                <p className="text-2xl font-bold">{days}</p>
                <p className="text-xs text-gray-400">Days</p>
              </div>
              <div className="bg-dark-300 p-3 rounded-lg text-center min-w-[80px]">
                <p className="text-2xl font-bold">{hours}</p>
                <p className="text-xs text-gray-400">Hours</p>
              </div>
              <div className="bg-dark-300 p-3 rounded-lg text-center min-w-[80px]">
                <p className="text-2xl font-bold">{minutes}</p>
                <p className="text-xs text-gray-400">Minutes</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-yellow-400 font-medium">Launch period has started!</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-300 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Total Points</p>
            <p className="text-lg font-medium">{Number(totalPoints).toLocaleString()}</p>
          </div>
          
          <div className="bg-dark-300 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Total VIRTUAL</p>
            <p className="text-lg font-medium">{Number(totalVirtuals).toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Total Participants</p>
            <p className="text-lg font-medium">{Number(totalParticipants).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Progress</h3>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-cyan-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min((totalVirtuals / 50000) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span className="text-gray-400">
              {Number(totalVirtuals).toLocaleString()} VIRTUAL
            </span>
            <span className="text-gray-400">Target: 50,000 VIRTUAL</span>
          </div>
        </div>
      </div>
      
      {/* Top subscribers */}
      <TopSubscribers subscribers={tokenData.topSubscribers || []} />
    </div>
  );
};

export default UnlaunchedToken;