import React from 'react';
import { ExternalLink, Twitter, Globe } from 'lucide-react';

interface TeamDetailsProps {
  tokenData: any;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ tokenData }) => {
  // In a real app, team data would come from your API
  // For now, using static sample data
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former VP at Goldman Sachs with 10+ years in crypto. Built multiple successful DeFi protocols.",
      twitter: "https://twitter.com/alexjcrypto",
      linkedin: "https://linkedin.com/in/alexjohnsoncrypto"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "PhD in Computer Science from MIT. Previously led engineering at Uniswap.",
      twitter: "https://twitter.com/sarahchendev",
      github: "https://github.com/sarahchen"
    },
    {
      name: "Marcus Williams",
      role: "Lead Developer",
      bio: "Full stack developer with expertise in Solidity and React. Contributed to multiple Base ecosystem projects.",
      github: "https://github.com/marcuswilliamsdev"
    },
    {
      name: "Elena Petrova",
      role: "Marketing Director",
      bio: "10+ years in crypto marketing. Previously headed growth at Binance and Kraken.",
      twitter: "https://twitter.com/elenacryptopr"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Team Members</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/40 transition-colors"
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-cyan-600 to-blue-700 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-lg">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-cyan-400">{member.role}</p>
                  <p className="text-sm text-gray-400 mt-2">{member.bio}</p>
                  
                  <div className="flex mt-3 space-x-2">
                    {member.twitter && (
                      <a 
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        aria-label={`${member.name}'s Twitter`}
                      >
                        <Twitter size={16} />
                      </a>
                    )}
                    {member.github && (
                      <a 
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        aria-label={`${member.name}'s GitHub`}
                      >
                        <Globe size={16} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Advisors & Partners</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
              <span className="font-bold text-lg">VP</span>
            </div>
            <span className="text-sm font-medium">Virtual Protocol</span>
            <span className="text-xs text-gray-400">Strategic Partner</span>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center mb-2">
              <span className="font-bold text-lg">BC</span>
            </div>
            <span className="text-sm font-medium">Base Capital</span>
            <span className="text-xs text-gray-400">Investor</span>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2">
              <span className="font-bold text-lg">CV</span>
            </div>
            <span className="text-sm font-medium">Crypto Ventures</span>
            <span className="text-xs text-gray-400">Advisor</span>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-2">
              <span className="font-bold text-lg">DL</span>
            </div>
            <span className="text-sm font-medium">DeFi Labs</span>
            <span className="text-xs text-gray-400">Technology Partner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;