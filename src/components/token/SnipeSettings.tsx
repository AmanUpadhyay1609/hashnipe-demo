import React from 'react';
import { motion } from 'framer-motion';
import { Bot, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SnipeSettings: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-400 rounded-xl p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Snipe Settings</h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-light-400">
            Investment Amount
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-500 focus:outline-none focus:border-primary-500"
              placeholder="Enter amount"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-light-400">
              ETH
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-light-400">
            Gas Price (Gwei)
          </label>
          <input
            type="number"
            className="w-full bg-dark-300 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-500 focus:outline-none focus:border-primary-500"
            placeholder="Enter gas price"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-light-400">
            Slippage Tolerance
          </label>
          <div className="flex space-x-2">
            <button className="flex-1 py-2 px-4 bg-dark-300 rounded-lg text-light-400 hover:bg-dark-200 transition-colors">
              0.5%
            </button>
            <button className="flex-1 py-2 px-4 bg-dark-300 rounded-lg text-light-400 hover:bg-dark-200 transition-colors">
              1%
            </button>
            <button className="flex-1 py-2 px-4 bg-dark-300 rounded-lg text-light-400 hover:bg-dark-200 transition-colors">
              2%
            </button>
          </div>
        </div>

        <button className="w-full btn-primary py-3">
          <Zap size={16} className="mr-2" />
          Set Up Snipe
        </button>
      </div>
    </motion.div>
  );
}; 