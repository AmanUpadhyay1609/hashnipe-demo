import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg"></div>
      <div className="absolute inset-0 bg-dark-500/80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 rounded-full mb-8 border border-primary-500/20">
              <Zap size={16} className="text-primary-400" />
              <span className="text-sm font-medium text-light-300">Start sniping today</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Amplify Your <span className="gradient-text">AI Agent Investments</span>?
            </h2>
            
            <p className="text-light-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of investors using #HaShnipe Agent to identify and snipe the best AI agents on Virtual Protocol. Connect your wallet to get started.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3">
                <span>Connect Wallet</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn-secondary w-full sm:w-auto px-8 py-3">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};