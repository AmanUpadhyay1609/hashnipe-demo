import React, { useEffect, useState } from 'react';
import { useGenesis, StatusFilter, GenesisLaunch } from '../context/GenesisContext';
import { Search, Filter, ArrowUpDown, Zap, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export const TokenListPage: React.FC = () => {
  const { 
    genesisLaunches, 
    loading, 
    error, 
    getProjectScore, 
    isRecommendedToSnipe,
    currentFilter,
    setCurrentFilter,
    pagination,
    currentPage, 
    setCurrentPage,
    fetchGenesisLaunches
  } = useGenesis();
  
  const { address, connect, isConnecting } = useWallet();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('score');

  // Fetch data when page changes
  useEffect(() => {
    fetchGenesisLaunches(currentPage, currentFilter);
  }, [currentPage, currentFilter]);

  // Filter projects based on search term
  const filteredProjects = genesisLaunches.filter(project => {
    return (
      project.virtual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.virtual.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.virtual.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort projects based on sort option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOption === 'score') {
      return getProjectScore(b) - getProjectScore(a);
    } else if (sortOption === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'ending') {
      return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
    } else if (sortOption === 'participants') {
      return b.totalParticipants - a.totalParticipants;
    }
    return 0;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'STARTED':
        return <Clock size={16} className="text-info-400" />;
      case 'INITIALIZED':
        return <AlertCircle size={16} className="text-warning-400" />;
      case 'FINALIZED':
        return <CheckCircle size={16} className="text-success-400" />;
      case 'FAILED':
        return <XCircle size={16} className="text-error-400" />;
      default:
        return <Clock size={16} className="text-light-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'STARTED':
        return 'text-info-400 bg-info-500/10 border-info-500/20';
      case 'INITIALIZED':
        return 'text-warning-400 bg-warning-500/10 border-warning-500/20';
      case 'FINALIZED':
        return 'text-success-400 bg-success-500/10 border-success-500/20';
      case 'FAILED':
        return 'text-error-400 bg-error-500/10 border-error-500/20';
      default:
        return 'text-light-400 bg-light-500/10 border-light-500/20';
    }
  };
  
  const handleSnipe = async (project: GenesisLaunch) => {
    if (!address) {
      await connect();
      return;
    }
    
    // Implement snipe functionality
    console.log('Sniping project:', project.virtual.name);
  };
  
  const handleSubscribe = async (project: GenesisLaunch) => {
    if (!address) {
      await connect();
      return;
    }
    
    // Implement subscribe functionality
    console.log('Subscribing to project:', project.virtual.name);
  };

  return (
    <div className="min-h-screen bg-dark-600 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Virtuals</span> Token List
          </h1>
          <p className="text-light-400 max-w-3xl mx-auto">
            Track and interact with tokens from Virtual Protocol's Genesis Launches. Use our advanced filtering to find the best opportunities.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-400 text-light-300 hover:bg-dark-300'
            }`}
            onClick={() => {
              setCurrentFilter('all');
              setCurrentPage(1);
            }}
          >
            All Tokens
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-400 text-light-300 hover:bg-dark-300'
            }`}
            onClick={() => {
              setCurrentFilter('active');
              setCurrentPage(1);
            }}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'ended'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-400 text-light-300 hover:bg-dark-300'
            }`}
            onClick={() => {
              setCurrentFilter('ended');
              setCurrentPage(1);
            }}
          >
            Ended
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-400 text-light-300 hover:bg-dark-300'
            }`}
            onClick={() => {
              setCurrentFilter('upcoming');
              setCurrentPage(1);
            }}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'top-snipe'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-400 text-light-300 hover:bg-dark-300'
            }`}
            onClick={() => {
              setCurrentFilter('top-snipe');
              setCurrentPage(1);
            }}
          >
            Top Snipe Picks
          </button>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-light-500" />
            </div>
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-400 border border-dark-200 text-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown size={18} className="text-light-500" />
            </div>
            <select
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-400 border border-dark-200 text-light-300 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="score">Highest Score</option>
              <option value="recent">Most Recent</option>
              <option value="ending">Ending Soon</option>
              <option value="participants">Most Participants</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={18} className="text-light-500" />
            </div>
          </div>
        </div>

        {/* Token List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-error-500 p-8 bg-error-500/10 rounded-xl">
            {error}
          </div>
        ) : (
          <div className="bg-dark-500 rounded-2xl overflow-hidden border border-dark-300">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-dark-400 text-light-300 font-medium text-sm border-b border-dark-300">
              <div className="col-span-3">Token</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Score</div>
              <div className="col-span-2 text-center">Participants</div>
              <div className="col-span-2 text-center">Total VIRTUAL</div>
              <div className="col-span-2 text-right">Time Remaining</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            {/* Mobile Header (Only shown on mobile) */}
            <div className="md:hidden p-4 bg-dark-400 text-light-300 font-medium text-sm border-b border-dark-300">
              Tokens ({sortedProjects.length})
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-dark-300">
              {sortedProjects.length === 0 ? (
                <div className="p-6 text-center text-light-400">
                  No tokens found matching your criteria
                </div>
              ) : (
                sortedProjects.map((project) => {
                  const score = getProjectScore(project);
                  const recommended = isRecommendedToSnipe(project);
                  const endDate = new Date(project.endsAt);
                  const timeRemaining = formatDistanceToNow(endDate, { addSuffix: true });
                  const isActive = project.status === 'STARTED';
                  const isUpcoming = project.status === 'INITIALIZED';
                  const isEnded = project.status === 'FINALIZED' || project.status === 'FAILED';
                  
                  return (
                    <div 
                      key={project.id} 
                      className="p-4 hover:bg-dark-400/40 transition-colors"
                    >
                      {/* Desktop View */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        {/* Token */}
                        <div className="col-span-3 flex items-center space-x-3">
                          <Link to={`/tokens/${project.id}`} className="w-10 h-10 rounded-full overflow-hidden bg-dark-300 flex-shrink-0">
                            {project.virtual.image && (
                              <img 
                                src={project.virtual.image.url} 
                                alt={project.virtual.name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </Link>
                          <div>
                            <Link to={`/tokens/${project.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                              {project.virtual.name}
                            </Link>
                            <div className="text-xs text-primary-400">${project.virtual.symbol}</div>
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-1 flex justify-center">
                          <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                          </div>
                        </div>
                        
                        {/* Score */}
                        <div className="col-span-1 text-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            score >= 70 
                              ? 'text-success-400 bg-success-500/10 border border-success-500/30' 
                              : score >= 50 
                                ? 'text-warning-400 bg-warning-500/10 border border-warning-500/30' 
                                : 'text-light-400 bg-light-500/10 border border-light-500/30'
                          }`}>
                            {score}
                          </div>
                        </div>
                        
                        {/* Participants */}
                        <div className="col-span-2 text-center text-light-300">
                          {project.totalParticipants.toLocaleString()}
                        </div>
                        
                        {/* Total VIRTUAL */}
                        <div className="col-span-2 text-center text-light-300">
                          {project.totalVirtuals.toLocaleString()}
                        </div>
                        
                        {/* Time Remaining */}
                        <div className="col-span-2 text-right text-light-300">
                          {isEnded ? 'Ended' : timeRemaining}
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-1 flex justify-end space-x-2">
                          {isActive && (
                            <button 
                              onClick={() => handleSnipe(project)}
                              className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                              title="Snipe at launch"
                            >
                              <Zap size={16} />
                            </button>
                          )}
                          {isUpcoming && (
                            <button 
                              onClick={() => handleSubscribe(project)}
                              className="p-2 rounded-full bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
                              title="Subscribe"
                            >
                              <Clock size={16} />
                            </button>
                          )}
                          <Link 
                            to={`/tokens/${project.id}`}
                            className="p-2 rounded-full bg-dark-300 text-light-300 hover:bg-dark-200 transition-colors"
                            title="View details"
                          >
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Mobile View */}
                      <div className="md:hidden">
                        <div className="flex items-center justify-between mb-3">
                          <Link to={`/tokens/${project.id}`} className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-300">
                              {project.virtual.image && (
                                <img 
                                  src={project.virtual.image.url} 
                                  alt={project.virtual.name} 
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white">{project.virtual.name}</div>
                              <div className="text-xs text-primary-400">${project.virtual.symbol}</div>
                            </div>
                          </Link>
                          
                          <div className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span>{project.status}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-dark-400/60 rounded-lg p-2 text-center">
                            <div className="text-sm font-bold text-white">{project.totalParticipants}</div>
                            <div className="text-xs text-light-500">Users</div>
                          </div>
                          <div className="bg-dark-400/60 rounded-lg p-2 text-center">
                            <div className="text-sm font-bold text-white">{project.totalVirtuals.toLocaleString()}</div>
                            <div className="text-xs text-light-500">Virtuals</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              score >= 70 
                                ? 'text-success-400 bg-success-500/10 border border-success-500/30' 
                                : score >= 50 
                                  ? 'text-warning-400 bg-warning-500/10 border border-warning-500/30' 
                                  : 'text-light-400 bg-light-500/10 border border-light-500/30'
                            }`}>
                              {score}
                            </div>
                            <div className="text-xs text-light-400">
                              {isEnded ? 'Ended' : timeRemaining}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {isActive && (
                              <button 
                                onClick={() => handleSnipe(project)}
                                className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                              >
                                <Zap size={16} />
                              </button>
                            )}
                            {isUpcoming && (
                              <button 
                                onClick={() => handleSubscribe(project)}
                                className="p-2 rounded-full bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
                              >
                                <Clock size={16} />
                              </button>
                            )}
                            <Link
                              to={`/tokens/${project.id}`}
                              className="p-2 rounded-full bg-dark-300 text-light-300 hover:bg-dark-200 transition-colors"
                            >
                              <ArrowRight size={16} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm">
              <button
                className="px-3 py-2 rounded-l-md border border-dark-200 bg-dark-400 text-light-300 hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: Math.min(pagination.pageCount, 5) }).map((_, index) => {
                let pageNumber = currentPage - 2 + index;
                
                if (currentPage < 3) {
                  pageNumber = index + 1;
                } else if (currentPage > pagination.pageCount - 2) {
                  pageNumber = pagination.pageCount - 4 + index;
                }
                
                if (pageNumber > 0 && pageNumber <= pagination.pageCount) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 border border-dark-200 ${
                        currentPage === pageNumber
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-400 text-light-300 hover:bg-dark-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                className="px-3 py-2 rounded-r-md border border-dark-200 bg-dark-400 text-light-300 hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, pagination.pageCount))}
                disabled={currentPage === pagination.pageCount}
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components
const ChevronDown = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
); 