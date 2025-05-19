import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, TrendingUp, Zap } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TelegramIcon } from '../ui/TelegramIcon';

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const { setJwt } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setJwt(token);
      console.log("Token",token)
      // Redirect to the page they tried to visit or home
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [searchParams, setJwt, navigate, location]);

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-20 md:pb-32">
      <div className="absolute inset-0 bg-dark-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.4),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(20,184,166,0.4),transparent_40%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          {/* Left Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-300/50 rounded-full mb-8 border border-dark-100">
              <span className="animate-pulse bg-primary-500 h-2 w-2 rounded-full"></span>
              <span className="text-sm font-medium text-light-400">Now Intelligent Sniping for Virtual Protocol</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">#HaShnipe</span> Agent
              <br className="hidden lg:block" />
              <span className="text-white"> Your Smart AI</span>
              <br className="hidden lg:block" />
              <span className="text-white">Investment Companion</span>
            </h1>

            <p className="text-light-400 text-lg md:text-xl mb-10 max-w-2xl">
              Identify and snipe the best AI agents on Virtual Protocol in the earliest possible blocks. Let our intelligent agent analyze and score projects to maximize your investment potential.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2"
                onClick={() => console.log("h")}
              >
                {/* <span>{isAuthenticated ? 'View Dashboard' : 'Get Started'}</span> */}
                <TelegramIcon />
              </button>
              <button className="btn-secondary w-full sm:w-auto">Learn More</button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-500/10 rounded-full p-2">
                  <Bot size={20} className="text-primary-400" />
                </div>
                <span className="text-light-300">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary-500/10 rounded-full p-2">
                  <TrendingUp size={20} className="text-primary-400" />
                </div>
                <span className="text-light-300">Smart Scoring System</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary-500/10 rounded-full p-2">
                  <Zap size={20} className="text-primary-400" />
                </div>
                <span className="text-light-300">Early Block Sniping</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - HaShnipe Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-3xl transform -translate-y-1/4 rounded-full"></div>
              <div className="relative">
                <img
                  src="/hashnipe.png"
                  alt="HaShnipe AI Agent"
                  className="w-full h-full lg:w-full lg:h-full object-cover animate-float"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};