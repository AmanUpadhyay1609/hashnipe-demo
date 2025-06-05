import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, Hash, User, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelegramIcon } from '../ui/TelegramIcon';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}
export const shortenAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu }) => {
  const [copied, setCopied] = useState(false);
  const handleTelegramConnect = () => {
    window.open(import.meta.env.VITE_TG_BOT_URL, '_blank');
  };

 

  const { isAuthenticated, decodedToken, logout } = useAuth();
  const username = decodedToken?.wallets?.base || 'User';

  const handleCopyUsername = async () => {
    try {
      await navigator.clipboard.writeText(username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-400/80 backdrop-blur-md border-b border-dark-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Hash size={28} className="text-primary-400" />
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                <span className="text-primary-400">Ha</span>
                <span className="text-white">Shnipe</span>
              </span>
              <span className="text-xs text-light-500">Smart AI Investment</span>
            </div>
          </Link>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={handleTelegramConnect}
                className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 transition-colors px-4 py-1 rounded-lg"
              >
                <TelegramIcon />
                <span className="text-white font-medium">Connect Telegram</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCopyUsername}
                  className="flex items-center space-x-2 bg-dark-300 px-3 py-1 rounded-lg hover:bg-dark-200 transition-colors group"
                >
                  <User size={16} className="text-light-400" />
                  <span className="text-light-300">{shortenAddress(username)}</span>
                  {copied ? (
                    <Check size={14} className="text-success-400" />
                  ) : (
                    <Copy size={14} className="text-light-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
                <button
                  onClick={logout}
                  className="text-light-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            <button className="p-2 rounded-full hover:bg-dark-300 transition-colors relative">
              <Bell size={20} className="text-light-400" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500"></span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-dark-300 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-300 border-b border-dark-100"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {!isAuthenticated ? (
                  <button
                    onClick={handleTelegramConnect}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 transition-colors px-4 py-3 rounded-lg"
                  >
                    <TelegramIcon />
                    <span className="text-white font-medium">Connect Telegram</span>
                  </button>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleCopyUsername}
                      className="flex items-center space-x-2 bg-dark-400 px-4 py-2 rounded-lg hover:bg-dark-200 transition-colors group"
                    >
                      <User size={16} className="text-light-400" />
                      <span className="text-light-300">{shortenAddress(username)}</span>
                      {copied ? (
                        <Check size={14} className="text-success-400" />
                      ) : (
                        <Copy size={14} className="text-light-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-light-400 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};