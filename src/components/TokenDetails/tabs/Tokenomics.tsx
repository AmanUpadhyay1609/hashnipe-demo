import React from 'react';

interface TokenomicsProps {
  tokenData: any;
}

const Tokenomics: React.FC<TokenomicsProps> = ({ tokenData }) => {
  // For demo purposes, extract tokenomics data from the overview if available
  let tokenomicsData = [];
  
  // Try to parse tokenomics table from the overview
  if (tokenData.data?.virtual?.overview) {
    const overviewText = tokenData.data.virtual.overview;
    
    // This is a very simplified approach - in a real app, you would parse this properly
    // or better yet, have structured data from your API
    if (overviewText.includes('Tokenomic')) {
      // Simple parsing for table-like content from markdown
      const tokenomicsSection = overviewText.split('Tokenomic')[1]?.split('***')[0] || '';
      // Further processing would be needed here
    }
  }
  
  // Sample tokenomics data (in a real app, this would come from your API)
  const sampleTokenomics = [
    { category: 'Public Sale', allocation: 37.5, vesting: 'Fixed supply – no vesting', details: 'Default' },
    { category: 'Liquidity Pool', allocation: 12.5, vesting: 'Fixed supply – no vesting', details: 'Default' },
    { category: 'Liquidity Incentives ($AIN–$VIRTUAL LPs)', allocation: 15.0, vesting: '100% 2-month cliff followed by 180-day unlocks', details: 'Rewards for liquidity providers supporting AIN–VIRTUAL pools.' },
    { category: 'Team & Advisors', allocation: 12.5, vesting: '100% 12-month cliff followed by immediate unlocks', details: 'Align long-term incentives with builders and strategic contributors.' },
    { category: 'Marketing & Growth', allocation: 10.0, vesting: '100% 1-month cliff followed by 365-day unlocks', details: 'Fuel campaigns, partnerships, user acquisition, and brand building.' },
    { category: 'Treasury', allocation: 5.0, vesting: '100% 3-month cliff followed by immediate unlocks', details: 'DAO-controlled funds for grants, bounties, reserves, and emergencies.' },
    { category: 'Virtual Ecosystem', allocation: 3.0, vesting: '100% 2-month cliff followed by 180-day unlocks', details: 'Broader incentives for Virtual yappers, stakers, and campaign contributors.' },
    { category: 'Data Contributors', allocation: 2.5, vesting: '100% 1-month cliff followed by 365-day unlocks', details: 'Rewards for users contributing data, tagging, and insights into AInalyst.' },
    { category: '$VADER Community', allocation: 1.0, vesting: '100% 2-month cliff followed by 180-day unlocks', details: 'Incentives for $VADER stakers in the Virtual ecosystem.' },
    { category: '$VIRGEN Community', allocation: 1.0, vesting: '100% 2-month cliff followed by 180-day unlocks', details: 'Rewards for Genesis Launch participants staking with Virgen.' },
  ];

  // Generate colors for pie chart
  const pieColors = [
    '#4ade80', // green
    '#f97316', // orange
    '#60a5fa', // blue
    '#a78bfa', // purple
    '#34d399', // teal
    '#fbbf24', // yellow
    '#fb7185', // pink
    '#94a3b8', // slate
    '#64748b', // blue-gray
    '#c084fc'  // violet
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tokenomics chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Token Distribution</h3>
          
          <div className="relative w-full aspect-square max-w-[300px] mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Donut chart with SVG */}
              {sampleTokenomics.map((item, index, array) => {
                // Calculate the slice
                const total = array.reduce((sum, item) => sum + item.allocation, 0);
                const startAngle = array
                  .slice(0, index)
                  .reduce((sum, item) => sum + (item.allocation / total) * 360, 0);
                const endAngle = startAngle + (item.allocation / total) * 360;
                
                // Convert to radians and calculate coordinates
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                const x1 = 50 + 35 * Math.cos(startRad);
                const y1 = 50 + 35 * Math.sin(startRad);
                const x2 = 50 + 35 * Math.cos(endRad);
                const y2 = 50 + 35 * Math.sin(endRad);
                
                // Create the arc
                const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
                
                // For the donut effect, we need two arcs
                return (
                  <path
                    key={index}
                    d={`
                      M ${50} ${50}
                      L ${x1} ${y1}
                      A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}
                      Z
                    `}
                    fill={pieColors[index % pieColors.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
              {/* Inner circle to create donut */}
              <circle cx="50" cy="50" r="20" fill="#1f2937" />
            </svg>
          </div>
        </div>
        
        {/* Tokenomics table */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Allocation Details</h3>
          <div className="overflow-auto max-h-[400px] scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-600">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-400">Category</th>
                  <th className="px-2 py-2 text-right font-medium text-gray-400">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {sampleTokenomics.map((item, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-2 py-2 flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      ></span>
                      {item.category}
                    </td>
                    <td className="px-2 py-2 text-right">{item.allocation}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Vesting details */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Vesting Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-700/30">
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Allocation</th>
                <th className="px-4 py-3 text-left font-medium">Vesting Schedule</th>
              </tr>
            </thead>
            <tbody>
              {sampleTokenomics.map((item, index) => (
                <tr 
                  key={index}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20"
                >
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{item.allocation}%</td>
                  <td className="px-4 py-3">{item.vesting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tokenomics;