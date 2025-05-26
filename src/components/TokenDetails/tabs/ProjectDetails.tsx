import React from 'react';
import { Calendar, Users, Link, Cpu, Shield } from 'lucide-react';

interface ProjectDetailsProps {
  tokenData: any;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ tokenData }) => {
  const overview = tokenData.data?.virtual?.overview || '';
  
  // Extract project roadmap from overview (this is a simplification)
  const roadmapSection = overview.includes('Roadmap') 
    ? overview.split('Roadmap')[1]?.split('***')[0] || ''
    : '';

  return (
    <div className="space-y-6">
      {/* Project overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Cpu size={18} className="text-cyan-400 mr-2" />
          Project Overview
        </h3>
        
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {tokenData.data?.virtual?.description || 'No description available.'}
          </p>
        </div>
      </div>
      
      {/* Key features */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield size={18} className="text-cyan-400 mr-2" />
          Key Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h4 className="font-medium text-cyan-400 mb-2">Advanced AI Analytics</h4>
            <p className="text-sm text-gray-300">
              Leveraging machine learning to provide deep insights into market trends and token performance.
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h4 className="font-medium text-cyan-400 mb-2">Real-time Data Integration</h4>
            <p className="text-sm text-gray-300">
              Connect to multiple data sources for comprehensive and up-to-date market information.
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h4 className="font-medium text-cyan-400 mb-2">Secure Trading Interface</h4>
            <p className="text-sm text-gray-300">
              State-of-the-art security protocols to ensure safe transactions on the platform.
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h4 className="font-medium text-cyan-400 mb-2">Community Governance</h4>
            <p className="text-sm text-gray-300">
              Token holders can participate in key decisions regarding platform development and features.
            </p>
          </div>
        </div>
      </div>
      
      {/* Project roadmap */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar size={18} className="text-cyan-400 mr-2" />
          Project Roadmap
        </h3>
        
        <div className="space-y-4">
          <div className="relative pl-8 pb-6 border-l-2 border-cyan-800">
            <div className="absolute left-[-8px] top-0 w-4 h-4 bg-cyan-500 rounded-full"></div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-medium text-cyan-400">Q2 2025</h4>
              <ul className="mt-2 text-sm text-gray-300 space-y-1">
                <li>• Platform launch and initial token distribution</li>
                <li>• Integration with major exchanges</li>
                <li>• Mobile app release (iOS & Android)</li>
              </ul>
            </div>
          </div>
          
          <div className="relative pl-8 pb-6 border-l-2 border-cyan-800">
            <div className="absolute left-[-8px] top-0 w-4 h-4 bg-cyan-700 rounded-full"></div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-medium text-cyan-400">Q3 2025</h4>
              <ul className="mt-2 text-sm text-gray-300 space-y-1">
                <li>• Advanced analytics dashboard</li>
                <li>• Launch of staking program</li>
                <li>• Partnership with major DeFi protocols</li>
              </ul>
            </div>
          </div>
          
          <div className="relative pl-8 pb-6 border-l-2 border-cyan-800">
            <div className="absolute left-[-8px] top-0 w-4 h-4 bg-gray-600 rounded-full"></div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-medium text-gray-400">Q4 2025</h4>
              <ul className="mt-2 text-sm text-gray-400 space-y-1">
                <li>• Decentralized governance implementation</li>
                <li>• Cross-chain functionality</li>
                <li>• Enterprise solutions for institutional clients</li>
              </ul>
            </div>
          </div>
          
          <div className="relative pl-8">
            <div className="absolute left-[-8px] top-0 w-4 h-4 bg-gray-600 rounded-full"></div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h4 className="font-medium text-gray-400">2026</h4>
              <ul className="mt-2 text-sm text-gray-400 space-y-1">
                <li>• Layer 2 scaling solution</li>
                <li>• Expansion to new blockchain ecosystems</li>
                <li>• Full protocol decentralization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Official links */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Link size={18} className="text-cyan-400 mr-2" />
          Official Links
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {tokenData.data?.virtual?.socials?.VERIFIED_LINKS?.WEBSITE && (
            <a 
              href={tokenData.data.virtual.socials.VERIFIED_LINKS.WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700/30 p-3 rounded-lg flex items-center hover:bg-gray-700 transition-colors"
            >
              <Globe size={18} className="mr-2 text-cyan-400" />
              <span>Website</span>
              <ExternalLink size={14} className="ml-auto" />
            </a>
          )}
          
          {tokenData.data?.virtual?.socials?.VERIFIED_LINKS?.TWITTER && (
            <a 
              href={tokenData.data.virtual.socials.VERIFIED_LINKS.TWITTER}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700/30 p-3 rounded-lg flex items-center hover:bg-gray-700 transition-colors"
            >
              <Twitter size={18} className="mr-2 text-cyan-400" />
              <span>Twitter</span>
              <ExternalLink size={14} className="ml-auto" />
            </a>
          )}
          
          <a 
            href={`https://basescan.org/token/${tokenData.data?.virtual?.tokenAddress || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700/30 p-3 rounded-lg flex items-center hover:bg-gray-700 transition-colors"
          >
            <img 
              src="https://basescan.org/images/favicon.ico" 
              alt="BaseScan" 
              className="w-4 h-4 mr-2" 
            />
            <span>BaseScan</span>
            <ExternalLink size={14} className="ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Import these components at the top
const ExternalLink = ({ size = 24, className = '' }) => (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const Twitter = ({ size = 24, className = '' }) => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export default ProjectDetails;