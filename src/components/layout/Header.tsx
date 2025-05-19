import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, AlertCircle, Bell, Hash, ListFilter, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../../context/WalletContext';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu }) => {
  const { address, connect, disconnect, isConnecting } = useWallet();
  
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const handleConnectClick = () => {
    if (address) {
      disconnect();
    } else {
      connect();
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-light-300 hover:text-primary-400 transition-colors">Home</Link>
            <Link to="/tokens" className="text-light-300 hover:text-primary-400 transition-colors">Tokens</Link>
            <Link to="/#features" className="text-light-300 hover:text-primary-400 transition-colors">Features</Link>
            <Link to="/#projects" className="text-light-300 hover:text-primary-400 transition-colors">Projects</Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-dark-300 transition-colors relative">
              <Bell size={20} className="text-light-400" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500"></span>
            </button>
            <button 
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                address 
                  ? 'bg-primary-500/20 hover:bg-primary-500/30 text-primary-400' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
              onClick={handleConnectClick}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mr-2"></div>
                  Connecting...
                </>
              ) : address ? (
                <>
                  <Wallet size={16} />
                  <span>{truncateAddress(address)}</span>
                </>
              ) : (
                <>
                  <Wallet size={16} />
                  <span>Connect Wallet</span>
                </>
              )}
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
                <Link to="/" className="py-2 text-light-300 hover:text-primary-400 transition-colors" onClick={toggleMenu}>Home</Link>
                <Link to="/tokens" className="py-2 text-light-300 hover:text-primary-400 transition-colors" onClick={toggleMenu}>Tokens</Link>
                <Link to="/#features" className="py-2 text-light-300 hover:text-primary-400 transition-colors" onClick={toggleMenu}>Features</Link>
                <Link to="/#projects" className="py-2 text-light-300 hover:text-primary-400 transition-colors" onClick={toggleMenu}>Projects</Link>
                <button 
                  className={`w-full mt-4 inline-flex items-center justify-center py-3 rounded-lg font-medium transition-colors ${
                    address 
                      ? 'bg-primary-500/20 hover:bg-primary-500/30 text-primary-400' 
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                  onClick={handleConnectClick}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mr-2"></div>
                      Connecting...
                    </>
                  ) : address ? (
                    <>
                      <Wallet size={16} className="mr-2" />
                      <span>{truncateAddress(address)}</span>
                    </>
                  ) : (
                    <>
                      <Wallet size={16} className="mr-2" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};