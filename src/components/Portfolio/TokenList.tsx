import React, { useState } from 'react';
import TokenCard from './TokenCard';
import VirtualTokenCard from './VirtualTokenCard';
import { ChevronDown, ChevronUp, SortAsc } from 'lucide-react';

interface TokenListProps {
  tokens: any[];
  isVirtual?: boolean;
}

const TokenList: React.FC<TokenListProps> = ({ tokens, isVirtual = false }) => {
  const [sortField, setSortField] = useState(isVirtual ? 'amount' : 'portfolio_percentage');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedTokens = () => {
    const sortableTokens = [...tokens];
    
    return sortableTokens.sort((a, b) => {
      let aValue = isVirtual ? 
        (sortField === 'usdValue' ? a.usdValue : 
         sortField === 'amount' ? a.amount : 
         a[sortField]) : 
        (a[sortField] || 0);
      
      let bValue = isVirtual ? 
        (sortField === 'usdValue' ? b.usdValue : 
         sortField === 'amount' ? b.amount : 
         b[sortField]) : 
        (b[sortField] || 0);
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? 
          aValue.localeCompare(bValue) : 
          bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <SortAsc className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const headerItems = isVirtual ? 
    [
      { id: 'name', label: 'AI Agent' },
      { id: 'amount', label: 'Amount' },
      { id: 'virtualTokenValue', label: 'VIRTUAL Value' },
      { id: 'usdValue', label: 'USD Value' }
    ] : 
    [
      { id: 'name', label: 'Token' },
      { id: 'balance_formatted', label: 'Balance' },
      { id: 'usd_value', label: 'USD Value' },
      { id: 'portfolio_percentage', label: 'Portfolio %' }
    ];

  return (
    <div className="bg-dark-400 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 bg-dark-400  border-b border-dark-300 text-xs sm:text-sm font-medium text-gray-400">
        {headerItems.map((item) => (
          <div 
            key={item.id}
            className={`flex items-center cursor-pointer hover:text-white ${
              item.id === 'name' ? 'col-span-2 md:col-span-1' : ''
            }`}
            onClick={() => handleSort(item.id)}
          >
            {item.label}
            <span className="ml-1">
              {renderSortIcon(item.id)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Token List */}
      <div className="divide-y divide-gray-700">
        {getSortedTokens().map((token) => (
          isVirtual ? 
            <VirtualTokenCard key={token.id} token={token} /> :
            <TokenCard key={token.token_address} token={token} />
        ))}
        
        {tokens.length === 0 && (
          <div className="p-6 sm:p-8 text-center text-gray-400">
            No tokens found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenList;