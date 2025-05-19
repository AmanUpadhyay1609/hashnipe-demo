import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Clock, Zap, CheckCircle, XCircle, Copy, ExternalLink
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useWallet } from '../context/WalletContext';
import { useGenesis, GenesisLaunch } from '../context/GenesisContext';
import { TokenOverview } from '../components/token/TokenOverview';
import { SnipeSettings } from '../components/token/SnipeSettings';

export const TokenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProjectScore, isRecommendedToSnipe } = useGenesis();
  const { address, connect, isConnecting } = useWallet();
  
  const [project, setProject] = useState<GenesisLaunch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'snipe'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.virtuals.io/api/geneses/${id}?populate=virtual`);
        setProject(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load project details');
        setLoading(false);
        console.error('Error fetching project details:', err);
      }
    };
    
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="min-h-screen bg-dark-600 flex items-center justify-center">
        <div className="bg-dark-500 p-8 rounded-xl max-w-lg text-center">
          <XCircle size={48} className="text-error-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Token</h2>
          <p className="text-light-400 mb-6">{error || 'Project not found'}</p>
          <Link 
            to="/tokens" 
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Tokens</span>
          </Link>
        </div>
      </div>
    );
  }
  
  const score = getProjectScore(project);
  const isSnipeRecommended = isRecommendedToSnipe(project);
  const endDate = new Date(project.endsAt);
  const timeRemaining = formatDistanceToNow(endDate, { addSuffix: true });
  const startDate = new Date(project.startsAt);
  const formattedStartDate = format(startDate, 'MMM dd, yyyy HH:mm');
  const formattedEndDate = format(endDate, 'MMM dd, yyyy HH:mm');
  
  const isActive = project.status === 'STARTED';
  const isUpcoming = project.status === 'INITIALIZED';
  const isEnded = project.status === 'FINALIZED' || project.status === 'FAILED';
  
  // Calculate progress percentage
  const TARGET_VIRTUALS = 42425;
  const progressPercentage = (project.totalVirtuals / TARGET_VIRTUALS) * 100;
  
  return (
    <div className="min-h-screen bg-dark-600 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link 
            to="/tokens" 
            className="text-light-400 hover:text-primary-400 transition-colors inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Tokens
          </Link>
        </div>
        
        {/* Token Header */}
        <div className="bg-dark-500 rounded-2xl p-6 md:p-8 mb-8 border border-dark-300">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Token Image and Basic Info */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-dark-400 border border-dark-200">
                {project.virtual.image && (
                  <img 
                    src={project.virtual.image.url} 
                    alt={project.virtual.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{project.virtual.name}</h1>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-info-500/20 text-info-400 border border-info-500/30' :
                    isUpcoming ? 'bg-warning-500/20 text-warning-400 border border-warning-500/30' :
                    'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30'
                  }`}>
                    {isActive ? 'Active' : isUpcoming ? 'Upcoming' : 'Ended'}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-light-400 mb-3">
                  <span className="text-primary-400 font-medium">${project.virtual.symbol}</span>
                  <span>•</span>
                  <span>Chain: {project.virtual.chain}</span>
                  <span>•</span>
                  <span>Genesis #{project.genesisId}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-dark-400 rounded text-xs text-light-400 hover:bg-dark-300 transition-colors"
                    onClick={() => copyToClipboard(project.genesisAddress, 'address')}
                  >
                    <span>{project.genesisAddress.slice(0, 6)}...{project.genesisAddress.slice(-4)}</span>
                    {copiedText === 'address' ? (
                      <CheckCircle size={12} className="text-success-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                  
                  <a 
                    href={`https://basescan.org/tx/${project.genesisTx}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-dark-400 rounded text-xs text-light-400 hover:bg-dark-300 transition-colors"
                  >
                    <span>View Tx</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Score and Action */}
            <div className="ml-auto flex flex-col items-end">
              <div className="flex items-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold ${
                  score >= 70 
                    ? 'text-success-400 bg-success-500/10 border-2 border-success-500/30' 
                    : score >= 50 
                      ? 'text-warning-400 bg-warning-500/10 border-2 border-warning-500/30' 
                      : 'text-light-400 bg-light-500/10 border-2 border-light-500/30'
                }`}>
                  {score}
                </div>
                <div className="ml-3">
                  <div className="text-sm text-light-500">HaShnipe Score</div>
                  <div className="text-sm font-medium text-white">
                    {score >= 70 ? 'Excellent' : score >= 50 ? 'Good' : 'Average'}
                  </div>
                </div>
              </div>
              
              {isActive && (
                <button 
                  onClick={() => {
                    if (!address) {
                      connect();
                    } else {
                      setActiveTab('snipe');
                    }
                  }}
                  className="btn-primary w-full sm:w-auto"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} className="mr-2" />
                      <span>Set Up Snipe</span>
                    </>
                  )}
                </button>
              )}
              
              {isUpcoming && (
                <button 
                  onClick={() => {
                    if (!address) {
                      connect();
                    }
                  }}
                  className="btn-secondary w-full sm:w-auto"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mr-2"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="mr-2" />
                      <span>Subscribe to Launch</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
            <div className="text-sm text-light-500 mb-2">Participants</div>
            <div className="text-2xl font-bold text-white">{project.totalParticipants.toLocaleString()}</div>
            <div className="text-sm text-light-400">Active investors</div>
          </div>
          
          <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
            <div className="text-sm text-light-500 mb-2">Total VIRTUAL</div>
            <div className="text-2xl font-bold text-white">{project.totalVirtuals.toLocaleString()}</div>
            <div className="text-sm text-light-400">{progressPercentage.toFixed(2)}% of target</div>
          </div>
          
          <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
            <div className="text-sm text-light-500 mb-2">Time Remaining</div>
            <div className="text-2xl font-bold text-white">{isEnded ? 'Ended' : timeRemaining}</div>
            <div className="text-sm text-light-400">
              {isEnded ? 'Launch completed' : 'Until genesis ends'}
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="bg-dark-500 rounded-xl p-6 mb-8 border border-dark-300">
          <h3 className="text-lg font-semibold text-white mb-4">Launch Timeline</h3>
          <div className="flex items-center mb-6">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full ${
                isActive || isEnded ? 'bg-primary-500' : 'bg-dark-300'
              } flex items-center justify-center`}>
                {isActive || isEnded ? <CheckCircle size={12} className="text-white" /> : null}
              </div>
              <div className="w-1 h-12 bg-dark-300">
                <div className={`w-full h-full ${
                  isActive || isEnded ? 'bg-primary-500' : 'bg-dark-300'
                } rounded-full transition-all duration-300`} style={{ height: `${isActive ? 100 : 0}%` }}></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="font-medium text-white">Genesis Started</div>
              <div className="text-sm text-light-400">{formattedStartDate}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full ${
                isEnded ? 'bg-primary-500' : 'bg-dark-300'
              } flex items-center justify-center`}>
                {isEnded ? <CheckCircle size={12} className="text-white" /> : null}
              </div>
            </div>
            <div className="ml-4">
              <div className="font-medium text-white">Genesis Ends</div>
              <div className="text-sm text-light-400">{formattedEndDate}</div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-dark-300">
            <div className="flex space-x-8">
              <button
                className={`pb-3 px-1 font-medium ${
                  activeTab === 'overview' 
                    ? 'text-primary-400 border-b-2 border-primary-500' 
                    : 'text-light-400 hover:text-light-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`pb-3 px-1 font-medium ${
                  activeTab === 'snipe' 
                    ? 'text-primary-400 border-b-2 border-primary-500' 
                    : 'text-light-400 hover:text-light-300'
                }`}
                onClick={() => {
                  if (!address) {
                    connect();
                  } else {
                    setActiveTab('snipe');
                  }
                }}
              >
                Snipe Settings
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' ? (
            <TokenOverview project={project} />
          ) : (
            <SnipeSettings project={project} score={score} />
          )}
        </div>
      </div>
    </div>
  );
}; 