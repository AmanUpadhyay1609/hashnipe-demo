import React, { useState } from 'react';
import { Settings, ArrowDown, RefreshCw } from 'lucide-react';

interface SwapCardProps {
  tokenData: any;
  isLaunched: boolean;
}

const SwapCard: React.FC<SwapCardProps> = ({ tokenData, isLaunched }) => {
  const [fromToken, setFromToken] = useState({
    symbol: 'VIRTUAL',
    name: 'Virtual Protocol',
    balance: '1000.00'
  });
  
  const [toToken, setToToken] = useState({
    symbol: isLaunched ? tokenData.tokenSymbol || 'VIRGEN' : tokenData.data.virtual.symbol,
    name: isLaunched ? tokenData.name : tokenData.data.virtual.name,
    balance: '0.00'
  });
  
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  
  // Mock conversion rate (in real app would come from API)
  const conversionRate = isLaunched ? 
    parseFloat(tokenData.quote_token_price_base_token || '164.35') : 0;
  
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    
    if (value && !isNaN(parseFloat(value)) && isLaunched) {
      setToAmount((parseFloat(value) * conversionRate).toFixed(6));
    } else {
      setToAmount('');
    }
  };
  
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    
    if (value && !isNaN(parseFloat(value)) && isLaunched) {
      setFromAmount((parseFloat(value) / conversionRate).toFixed(6));
    } else {
      setFromAmount('');
    }
  };
  
  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Swap</h2>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings size={18} />
        </button>
      </div>
      
      {/* From token */}
      <div className="bg-gray-700/50 rounded-lg p-3 mb-2">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>From</span>
          <span>Balance: {fromToken.balance}</span>
        </div>
        
        <div className="flex items-center">
          <input
            type="number"
            className="bg-transparent w-full text-xl outline-none"
            placeholder="0.0"
            value={fromAmount}
            onChange={handleFromAmountChange}
          />
          
          <div className="bg-gray-700 rounded-lg px-3 py-1 flex items-center ml-2">
            <span className="font-medium">{fromToken.symbol}</span>
          </div>
        </div>
      </div>
      
      {/* Switch button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button 
          className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors"
          onClick={switchTokens}
        >
          <ArrowDown size={16} />
        </button>
      </div>
      
      {/* To token */}
      <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>To</span>
          <span>Balance: {toToken.balance}</span>
        </div>
        
        <div className="flex items-center">
          <input
            type="number"
            className="bg-transparent w-full text-xl outline-none"
            placeholder="0.0"
            value={toAmount}
            onChange={handleToAmountChange}
            disabled={!isLaunched}
          />
          
          <div className="bg-gray-700 rounded-lg px-3 py-1 flex items-center ml-2">
            <span className="font-medium">{toToken.symbol}</span>
          </div>
        </div>
      </div>
      
      {/* Swap details */}
      {isLaunched && fromAmount && (
        <div className="bg-gray-700/30 rounded-lg p-3 mb-4 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Price</span>
            <span>1 {fromToken.symbol} ≈ {conversionRate.toFixed(6)} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Minimum received</span>
            <span>{(parseFloat(toAmount) * 0.99).toFixed(6)} {toToken.symbol}</span>
          </div>
        </div>
      )}
      
      {/* Action button */}
      <button 
        className={`w-full py-3 rounded-lg font-medium text-center ${
          isLaunched 
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
        disabled={!isLaunched || !fromAmount || fromAmount === '0'}
      >
        {!isLaunched ? 'Token not launched yet' : 
         !fromAmount ? 'Enter an amount' : 'Swap'}
      </button>
      
      {/* Disclaimer */}
      {isLaunched && (
        <div className="text-xs text-center mt-3 text-gray-400">
          Price is refreshed every 15 seconds
          <button className="ml-1 text-cyan-400 hover:text-cyan-300 inline-flex items-center">
            <RefreshCw size={12} className="mr-1" /> Refresh
          </button>
        </div>
      )}
      
      {!isLaunched && (
        <div className="text-xs text-center mt-3 text-gray-400">
          Trading will be available after token launch
        </div>
      )}
    </div>
  );
};

export default SwapCard;