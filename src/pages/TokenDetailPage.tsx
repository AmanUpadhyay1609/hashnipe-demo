import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SnipeSettings } from '../components/token/SnipeSettings';

export const TokenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Protected route will handle redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-8">
          <button className="p-2 rounded-lg hover:bg-dark-300 transition-colors">
            <ArrowLeft size={20} className="text-light-400" />
          </button>
          <h1 className="text-2xl font-bold">Token Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-dark-400 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Token Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-light-400">Token ID</span>
                  <span className="text-light-300">{id}</span>
                </div>
                {/* Add more token details here */}
              </div>
            </div>

            <div className="bg-dark-400 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-500/10 rounded-full p-2">
                    <Bot size={20} className="text-primary-400" />
                  </div>
                  <div>
                    <span className="text-light-400 text-sm">AI Score</span>
                    <p className="text-xl font-semibold">85/100</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-500/10 rounded-full p-2">
                    <TrendingUp size={20} className="text-primary-400" />
                  </div>
                  <div>
                    <span className="text-light-400 text-sm">Growth Potential</span>
                    <p className="text-xl font-semibold">High</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-500/10 rounded-full p-2">
                    <Zap size={20} className="text-primary-400" />
                  </div>
                  <div>
                    <span className="text-light-400 text-sm">Risk Level</span>
                    <p className="text-xl font-semibold">Medium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <SnipeSettings />
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 