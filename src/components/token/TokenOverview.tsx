import React from 'react';
import { GenesisLaunch } from '../../context/GenesisContext';
import { ExternalLink, CheckCircle, AlertTriangle, Globe, Twitter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TokenOverviewProps {
  project: GenesisLaunch;
}

export const TokenOverview: React.FC<TokenOverviewProps> = ({ project }) => {
  // Extract social links from overview
  const extractSocialLinks = (overview: string) => {
    const links: { type: string; url: string }[] = [];
    
    // Match Twitter links
    const twitterRegex = /https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+/g;
    const twitterMatches = overview.match(twitterRegex);
    
    if (twitterMatches) {
      twitterMatches.forEach(match => {
        links.push({ type: 'twitter', url: match });
      });
    }
    
    // Match website links
    const websiteRegex = /https?:\/\/(?!twitter\.com|x\.com)[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;
    const websiteMatches = overview.match(websiteRegex);
    
    if (websiteMatches) {
      websiteMatches.forEach(match => {
        if (!match.includes('twitter.com') && !match.includes('x.com')) {
          links.push({ type: 'website', url: match });
        }
      });
    }
    
    return links;
  };
  
  const socialLinks = project.virtual.overview 
    ? extractSocialLinks(project.virtual.overview) 
    : [];
  
  return (
    <div className="space-y-8">
      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-400 hover:bg-dark-300 transition-colors rounded-full text-sm text-light-300"
            >
              {link.type === 'twitter' ? (
                <Twitter size={16} className="text-info-400" />
              ) : (
                <Globe size={16} className="text-primary-400" />
              )}
              <span>{link.type === 'twitter' ? 'Twitter' : 'Website'}</span>
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      )}
      
      {/* Project Description */}
      <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
        <h3 className="text-lg font-medium text-white mb-4">Description</h3>
        <p className="text-light-400 whitespace-pre-line">{project.virtual.description}</p>
      </div>
      
      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
          <h3 className="text-lg font-medium text-white mb-4">Token Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-light-500">Name</span>
              <span className="text-white font-medium">{project.virtual.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Symbol</span>
              <span className="text-white font-medium">{project.virtual.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Blockchain</span>
              <span className="text-white font-medium">{project.virtual.chain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Category</span>
              <span className="text-white font-medium">{project.virtual.category || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Status</span>
              <span className="text-white font-medium">{project.virtual.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Role</span>
              <span className="text-white font-medium">{project.virtual.role?.replace('_', ' ') || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
          <h3 className="text-lg font-medium text-white mb-4">Genesis Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-light-500">Genesis ID</span>
              <span className="text-white font-medium">#{project.genesisId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Total Points</span>
              <span className="text-white font-medium">{project.totalPoints.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Total VIRTUAL</span>
              <span className="text-white font-medium">{project.totalVirtuals.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Genesis Address</span>
              <a 
                href={`https://basescan.org/address/${project.genesisAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 font-medium flex items-center hover:underline"
              >
                <span>{project.genesisAddress.slice(0, 6)}...{project.genesisAddress.slice(-4)}</span>
                <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-light-500">Genesis Tx</span>
              <a 
                href={`https://basescan.org/tx/${project.genesisTx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 font-medium flex items-center hover:underline"
              >
                <span>{project.genesisTx.slice(0, 6)}...{project.genesisTx.slice(-4)}</span>
                <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full Overview Section */}
      {project.virtual.overview && (
        <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
          <h3 className="text-lg font-medium text-white mb-4">Detailed Overview</h3>
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-medium prose-p:text-light-400 prose-a:text-primary-400">
            <ReactMarkdown>{project.virtual.overview}</ReactMarkdown>
          </div>
        </div>
      )}
      
      {/* Additional Info */}
      <div className="bg-dark-500 rounded-xl p-6 border border-dark-300">
        <h3 className="text-lg font-medium text-white mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-info-500/10 p-2 rounded-full">
              <AlertTriangle size={16} className="text-info-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">Investment Risk</h4>
              <p className="text-light-400 text-sm">
                This token is in genesis phase on Virtual Protocol. Investments during this phase are speculative and carry significant risk. Do your own research before investing.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-primary-500/10 p-2 rounded-full">
              <CheckCircle size={16} className="text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-white">HaShnipe Assessment</h4>
              <p className="text-light-400 text-sm">
                HaShnipe has analyzed this project based on participation metrics, funding progress, investor commitment, and time factors. Our scoring system helps identify potential investment opportunities, but final decisions should be made by you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 