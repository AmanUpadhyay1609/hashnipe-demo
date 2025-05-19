import React, { useState } from 'react';
import { GenesisLaunch } from '../../context/GenesisContext';
import { 
  Settings, AlertTriangle, DollarSign, 
  TrendingUp, Zap, Wallet
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface SnipeSettingsProps {
  project: GenesisLaunch;
  score: number;
}

export const SnipeSettings: React.FC<SnipeSettingsProps> = ({ project, score }) => {
  const { address } = useWallet();
  
  // Snipe settings
  const [investmentAmount, setInvestmentAmount] = useState<number>(0.05);
  const [maxSlippage, setMaxSlippage] = useState<number>(10);
  const [maxGasPrice, setMaxGasPrice] = useState<number>(0.5);
  const [strategy, setStrategy] = useState<'aggressive' | 'balanced' | 'conservative'>('balanced');
  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const [takeProfit, setTakeProfit] = useState<number | null>(150);
  const [blockTarget, setBlockTarget] = useState<'early' | 'mid' | 'any'>('early');
  
  // Recommendation based on score
  const getRecommendedStrategy = () => {
    if (score >= 80) return 'aggressive';
    if (score >= 60) return 'balanced';
    return 'conservative';
  };
  
  const recommendedStrategy = getRecommendedStrategy();
  
  // Apply recommended settings
  const applyRecommendedSettings = () => {
    setStrategy(recommendedStrategy);
    
    // Set values based on recommended strategy
    if (recommendedStrategy === 'aggressive') {
      setMaxSlippage(15);
      setMaxGasPrice(1);
      setStopLoss(70);
      setTakeProfit(200);
      setBlockTarget('early');
    } else if (recommendedStrategy === 'balanced') {
      setMaxSlippage(10);
      setMaxGasPrice(0.5);
      setStopLoss(60);
      setTakeProfit(150);
      setBlockTarget('mid');
    } else {
      setMaxSlippage(5);
      setMaxGasPrice(0.3);
      setStopLoss(50);
      setTakeProfit(100);
      setBlockTarget('any');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would implement actual token sniping logic
    console.log('Sniping token with settings:', {
      investmentAmount,
      maxSlippage,
      maxGasPrice,
      strategy,
      stopLoss,
      takeProfit,
      blockTarget,
      project
    });
    
    // Show success notification or redirect
    alert('Snipe set up successfully! You will be notified when the token is sniped.');
  };
  
  const renderSlippageLabel = () => {
    if (maxSlippage <= 5) return 'Low';
    if (maxSlippage <= 10) return 'Medium';
    return 'High';
  };
  
  const renderGasPriceLabel = () => {
    if (maxGasPrice <= 0.3) return 'Low';
    if (maxGasPrice <= 0.7) return 'Medium';
    return 'High';
  };
  
  const formatEth = (value: number) => {
    return `${value} ETH`;
  };
  
  return (
    <div className="space-y-8">
      {/* Snipe Notification */}
      <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-full bg-primary-500/20">
            <Zap size={24} className="text-primary-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Configure Your Snipe</h3>
            <p className="text-light-400">
              Set up your sniping parameters for {project.virtual.name} ({project.virtual.symbol}). Our AI agent 
              will execute the trade according to your settings when the token launches.
            </p>
          </div>
        </div>
      </div>
      
      {/* Strategy Recommendation */}
      <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
        <div className="flex items-start space-x-4 mb-6">
          <div className="p-2 rounded-full bg-info-500/20">
            <Settings size={20} className="text-info-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-1">Recommended Strategy</h3>
            <p className="text-light-400 text-sm mb-4">
              Based on our analysis, we recommend the following strategy for this token:
            </p>
            
            <div className="p-4 bg-dark-400 rounded-lg border border-dark-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-light-400">Strategy Type:</span>
                <span className="font-medium text-white capitalize">{recommendedStrategy}</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-light-400">Score-Based Assessment:</span>
                <span className={`font-medium ${
                  score >= 70 ? 'text-success-400' : 
                  score >= 50 ? 'text-warning-400' : 
                  'text-error-400'
                }`}>
                  {score >= 70 ? 'High Potential' : 
                   score >= 50 ? 'Moderate Potential' : 
                   'Approach with Caution'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-light-400">Recommendation:</span>
                <span className="font-medium text-white">
                  {score >= 70 ? 'Allocate standard investment' : 
                   score >= 50 ? 'Consider partial allocation' : 
                   'Minimal test allocation only'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={applyRecommendedSettings}
              className="w-full py-2 px-4 bg-info-500/20 hover:bg-info-500/30 text-info-400 rounded-lg transition-colors border border-info-500/30 text-sm font-medium"
            >
              Apply Recommended Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Snipe Settings Form */}
      <form onSubmit={handleSubmit} className="bg-dark-500 rounded-xl p-6 border border-dark-300">
        <h3 className="text-lg font-medium text-white mb-6">Snipe Configuration</h3>
        
        <div className="space-y-6">
          {/* Investment Amount */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-light-400">Investment Amount</span>
              <span className="text-sm text-light-500">Balance: ~0.2 ETH</span>
            </label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-500" />
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                min={0.01}
                max={10}
                step={0.01}
                className="w-full pl-10 pr-16 py-3 bg-dark-400 border border-dark-200 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-500">
                ETH
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <button 
                type="button" 
                className="px-2 py-1 bg-dark-400 text-light-400 text-xs rounded"
                onClick={() => setInvestmentAmount(0.05)}
              >
                0.05
              </button>
              <button 
                type="button" 
                className="px-2 py-1 bg-dark-400 text-light-400 text-xs rounded"
                onClick={() => setInvestmentAmount(0.1)}
              >
                0.1
              </button>
              <button 
                type="button"
                className="px-2 py-1 bg-dark-400 text-light-400 text-xs rounded"
                onClick={() => setInvestmentAmount(0.25)}
              >
                0.25
              </button>
              <button 
                type="button"
                className="px-2 py-1 bg-dark-400 text-light-400 text-xs rounded"
                onClick={() => setInvestmentAmount(0.5)}
              >
                0.5
              </button>
              <button 
                type="button"
                className="px-2 py-1 bg-dark-400 text-light-400 text-xs rounded"
                onClick={() => setInvestmentAmount(1)}
              >
                1.0
              </button>
            </div>
          </div>
          
          {/* Strategy Type */}
          <div>
            <label className="block text-light-400 mb-2">Strategy Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className={`py-3 px-4 rounded-lg text-center ${
                  strategy === 'conservative' 
                    ? 'bg-info-500/20 border border-info-500/40 text-info-400' 
                    : 'bg-dark-400 border border-dark-200 text-light-400 hover:bg-dark-300'
                }`}
                onClick={() => setStrategy('conservative')}
              >
                Conservative
              </button>
              <button
                type="button"
                className={`py-3 px-4 rounded-lg text-center ${
                  strategy === 'balanced' 
                    ? 'bg-primary-500/20 border border-primary-500/40 text-primary-400' 
                    : 'bg-dark-400 border border-dark-200 text-light-400 hover:bg-dark-300'
                }`}
                onClick={() => setStrategy('balanced')}
              >
                Balanced
              </button>
              <button
                type="button"
                className={`py-3 px-4 rounded-lg text-center ${
                  strategy === 'aggressive' 
                    ? 'bg-secondary-500/20 border border-secondary-500/40 text-secondary-400' 
                    : 'bg-dark-400 border border-dark-200 text-light-400 hover:bg-dark-300'
                }`}
                onClick={() => setStrategy('aggressive')}
              >
                Aggressive
              </button>
            </div>
          </div>
          
          {/* Max Slippage */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-light-400">Max Slippage</span>
              <span className="text-sm text-light-500">{renderSlippageLabel()}</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={1}
                max={20}
                value={maxSlippage}
                onChange={(e) => setMaxSlippage(Number(e.target.value))}
                className="w-full h-2 bg-dark-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-light-500">
                <span>1%</span>
                <span>10%</span>
                <span>20%</span>
              </div>
            </div>
            <div className="mt-2 text-center text-sm text-white font-medium">
              {maxSlippage}%
            </div>
          </div>
          
          {/* Max Gas Price */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-light-400">Max Gas Price (GWEI)</span>
              <span className="text-sm text-light-500">{renderGasPriceLabel()}</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.1}
                value={maxGasPrice}
                onChange={(e) => setMaxGasPrice(Number(e.target.value))}
                className="w-full h-2 bg-dark-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-light-500">
                <span>0.1</span>
                <span>1.0</span>
                <span>2.0</span>
              </div>
            </div>
            <div className="mt-2 text-center text-sm text-white font-medium">
              {maxGasPrice.toFixed(1)}
            </div>
          </div>
          
          {/* Block Target */}
          <div>
            <label className="block text-light-400 mb-2">Block Target</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className={`py-3 px-4 rounded-lg text-center ${
                  blockTarget === 'early' 
                    ? 'bg-primary-500/20 border border-primary-500/40 text-primary-400' 
                    : 'bg-dark-400 border border-dark-200 text-light-400 hover:bg-dark-300'
                }`}
                onClick={() => setBlockTarget('early')}
              >
                Early Blocks
              </button>
              <button
                type="button"
                className={`py-3 px-4 rounded-lg text-center ${
                  blockTarget === 'mid' 
                    ? 'bg-primary-500/20 border border-primary-500/40 text-primary-400' 
                    : 'bg-dark-400 border border-dark-200 text-light-400 hover:bg-dark-300'
                }`}
                onClick={() => setBlockTarget('mid')}
              >
                Mid Blocks
              </button>
              <button
                type="button"
                className={`py-3 px-4 rounded-lg text-center ${
                  blockTarget === 'any' 
                    ? 'bg-primary-500/20 border border-primary-500/40 text-primary-400' 
                    : 'bg-dark-400 border border-dark-200 text-light-400 hover:bg-dark-300'
                }`}
                onClick={() => setBlockTarget('any')}
              >
                Any Block
              </button>
            </div>
          </div>
          
          {/* Take Profit / Stop Loss */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-light-400 mb-2">Take Profit (%)</label>
              <div className="relative">
                <TrendingUp size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-500" />
                <input
                  type="number"
                  value={takeProfit || ''}
                  onChange={(e) => setTakeProfit(e.target.value ? Number(e.target.value) : null)}
                  min={0}
                  placeholder="No take profit"
                  className="w-full pl-10 pr-10 py-3 bg-dark-400 border border-dark-200 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-500">
                  %
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-light-400 mb-2">Stop Loss (%)</label>
              <div className="relative">
                <TrendingUp size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-500 rotate-180" />
                <input
                  type="number"
                  value={stopLoss || ''}
                  onChange={(e) => setStopLoss(e.target.value ? Number(e.target.value) : null)}
                  min={0}
                  max={100}
                  placeholder="No stop loss"
                  className="w-full pl-10 pr-10 py-3 bg-dark-400 border border-dark-200 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-500">
                  %
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="p-4 bg-dark-400 rounded-lg border border-dark-200">
            <h4 className="font-medium text-white mb-3">Snipe Summary</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-light-400">Investment Amount:</span>
                <span className="text-white">{formatEth(investmentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-400">Strategy:</span>
                <span className="text-white capitalize">{strategy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-400">Max Slippage:</span>
                <span className="text-white">{maxSlippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-400">Max Gas Price:</span>
                <span className="text-white">{maxGasPrice} GWEI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-400">Block Target:</span>
                <span className="text-white capitalize">{blockTarget} Blocks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-400">Take Profit:</span>
                <span className="text-white">{takeProfit ? `${takeProfit}%` : 'Not Set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-400">Stop Loss:</span>
                <span className="text-white">{stopLoss ? `${stopLoss}%` : 'Not Set'}</span>
              </div>
            </div>
          </div>
          
          {/* Warning */}
          <div className="p-4 bg-warning-500/10 border border-warning-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-warning-400 flex-shrink-0 mt-0.5" />
              <p className="text-light-400 text-sm">
                This will set up an automated sniping agent for {project.virtual.symbol}. The agent will 
                attempt to buy the token according to your parameters as soon as it becomes available. 
                This is a high-risk activity and results may vary based on market conditions.
              </p>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Zap size={18} />
            <span>Set Up Snipe Agent</span>
          </button>
        </div>
      </form>
    </div>
  );
}; 