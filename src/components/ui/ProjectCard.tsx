import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Zap, Users, ArrowRight } from 'lucide-react';
import { GenesisLaunch } from '../../context/GenesisContext';
import { useGenesis } from '../../context/GenesisContext';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: GenesisLaunch;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { getProjectScore, isRecommendedToSnipe, isRecommendedToSubscribe } = useGenesis();
  
  const score = getProjectScore(project);
  const shouldSnipe = isRecommendedToSnipe(project);
  const shouldSubscribe = isRecommendedToSubscribe(project);
  
  const startDate = new Date(project.startsAt);
  const endDate = new Date(project.endsAt);
  const isLive = project.status === 'STARTED';
  
  // Calculate remaining time
  const now = new Date();
  const timeRemaining = formatDistanceToNow(endDate, { addSuffix: true });
  
  // Calculate subscription percentage (based on 42,425 VIRTUAL target)
  const TARGET_VIRTUALS = 42425;
  const subscriptionPercentage = (project.totalVirtuals / TARGET_VIRTUALS) * 100;
  
  // Format percentage for display
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };
  
  // Determine status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'STARTED':
        return 'bg-success-500/20 text-success-400 border-success-500/30';
      case 'INITIALIZED':
        return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
      default:
        return 'bg-light-500/20 text-light-400 border-light-500/30';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="card card-hover group"
    >
      <div className="relative">
        {/* Score indicator */}
        <div className="absolute top-4 right-4 z-10 bg-dark-400/90 backdrop-blur-sm border border-dark-100 rounded-full p-1 flex items-center justify-center w-12 h-12">
          <div 
            className={`text-sm font-bold flex items-center justify-center w-full h-full rounded-full ${
              score >= 70 
                ? 'text-success-400 bg-success-500/10' 
                : score >= 50 
                  ? 'text-warning-400 bg-warning-500/10' 
                  : 'text-light-400 bg-light-500/10'
            }`}
          >
            {score}
          </div>
        </div>
        
        {/* Recommendation badges */}
        {shouldSnipe && (
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-success-500/20 text-success-400 border border-success-500/30 rounded-full px-3 py-1 text-xs font-medium">
            <Zap size={12} />
            <span>Best to Snipe</span>
          </div>
        )}
        
        {shouldSubscribe && !shouldSnipe && (
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-warning-500/20 text-warning-400 border border-warning-500/30 rounded-full px-3 py-1 text-xs font-medium">
            <Clock size={12} />
            <span>Subscribe</span>
          </div>
        )}
        
        {/* Project Image - Link to detail page */}
        <Link to={`/tokens/${project.id}`} className="block">
          <div className="relative overflow-hidden h-40 rounded-t-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent z-10"></div>
            {project.virtual.image && (
              <img 
                src={project.virtual.image.url} 
                alt={project.virtual.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </div>
        </Link>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link to={`/tokens/${project.id}`} className="hover:text-primary-400 transition-colors">
              <h3 className="text-xl font-bold text-white leading-tight">{project.virtual.name}</h3>
              <div className="text-sm text-primary-400 font-medium">${project.virtual.symbol}</div>
            </Link>
          </div>
          
          <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status}
          </div>
        </div>
        
        <p className="text-light-400 text-sm mb-4 line-clamp-2">
          {project.virtual.description}
        </p>
        
        <div className="space-y-4 mb-4">
          {/* Timeline */}
          <div className="flex items-center text-xs">
            <div className="text-light-500">
              {format(startDate, 'MMM dd')}
            </div>
            <div className="flex-grow mx-2 h-0.5 bg-dark-100 relative">
              <div className="absolute left-0 top-0 h-full bg-primary-500" style={{ width: `${isLive ? 50 : 0}%` }}></div>
            </div>
            <div className="text-light-500">
              {format(endDate, 'MMM dd')}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-dark-400/60 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-white">{project.totalParticipants}</div>
              <div className="text-xs text-light-500">Users</div>
            </div>
            <div className="bg-dark-400/60 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-white">{project.totalVirtuals.toLocaleString()}</div>
              <div className="text-xs text-light-500">Virtuals</div>
            </div>
            <div className="bg-dark-400/60 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-white">{formatPercentage(subscriptionPercentage)}</div>
              <div className="text-xs text-light-500">Subscribed</div>
            </div>
          </div>
          
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-light-500">Progress</span>
              <span className="text-primary-400 font-medium">{formatPercentage(subscriptionPercentage)}</span>
            </div>
            <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${Math.min(subscriptionPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Time remaining */}
          <div className="flex items-center space-x-2 text-sm">
            <Clock size={14} className="text-light-500" />
            <span className="text-light-400">Ends {timeRemaining}</span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-dark-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-primary-500/20 border border-dark-300 flex items-center justify-center">
                  <Users size={10} className="text-primary-400" />
                </div>
              ))}
              {project.totalParticipants > 0 && (
                <div className="w-6 h-6 rounded-full bg-dark-300 border border-dark-100 flex items-center justify-center text-xs text-light-400">
                  +{project.totalParticipants}
                </div>
              )}
            </div>
            <span className="text-xs text-light-500">Participants</span>
          </div>
          
          <Link 
            to={`/tokens/${project.id}`}
            className="text-primary-400 flex items-center space-x-1 text-sm font-medium group"
          >
            <span>View</span>
            <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};