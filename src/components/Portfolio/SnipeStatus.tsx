import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Check, AlertCircle, Clock, ExternalLink, Search, Calendar, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

interface GenesisLaunchItem {
    _id: string;
    agentName: string;
    genesisId: string;
    launchTime: string;
    userAmount: string;
    transactionStatus: string;
    agentStatus: string;
    transactionHash?: string;
    tokenAddress?: string;
    transactionSentAt?: string;
    transactionConfirmedAt?: string;
    transactionFailedAt?: string;
    userMarketCap: string;
}

const GenesisList: React.FC<{ launches: GenesisLaunchItem[] }> = ({ launches }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter launches based on search term
    const filteredLaunches = useMemo(() => {
        if (!searchTerm.trim()) return launches;
        
        const searchLower = searchTerm.toLowerCase();
        return launches.filter(launch => 
            launch.agentName.toLowerCase().includes(searchLower) ||
            launch.genesisId.toLowerCase().includes(searchLower) ||
            launch.tokenAddress?.toLowerCase().includes(searchLower) ||
            launch.transactionHash?.toLowerCase().includes(searchLower)
        );
    }, [launches, searchTerm]);

    const getStatusInfo = (launch: GenesisLaunchItem) => {
        const { agentStatus, transactionConfirmedAt, transactionFailedAt } = launch;
        
        switch (agentStatus) {
            case 'completed':
                return {
                    color: 'text-success-400',
                    icon: <Check className="w-5 h-5 text-success-400" />,
                    text: 'SUCCESS',
                    time: transactionConfirmedAt ? format(new Date(transactionConfirmedAt), 'PPp') : '-'
                };
            case 'error':
                return {
                    color: 'text-error-400',
                    icon: <AlertCircle className="w-5 h-5 text-error-400" />,
                    text: 'FAILED',
                    time: transactionFailedAt ? format(new Date(transactionFailedAt), 'PPp') : '-'
                };
            default:
                return {
                    color: 'text-warning-400',
                    icon: <Clock className="w-5 h-5 text-warning-400" />,
                    text: 'PENDING',
                    time: '-'
                };
        }
    };

    return (
        <div className="space-y-4 px-4 md:px-0">
            {/* Search Bar - Full width on mobile */}
            <div className="relative w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search launches..."
                    className="w-full pl-10 pr-4 py-3 md:py-2.5 bg-dark-400 border border-dark-300 rounded-lg text-sm md:text-base text-light-100 placeholder:text-light-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-500" />
            </div>

            {/* Results Count - Responsive text size */}
            <div className="text-xs md:text-sm text-light-500 px-1">
                Showing {filteredLaunches.length} of {launches.length} launches
            </div>

            {/* Launches List */}
            <div className="space-y-4">
                {filteredLaunches.length > 0 ? (
                    filteredLaunches.map((launch) => {
                        const statusInfo = getStatusInfo(launch);
                        return (
                            <div
                                key={launch._id}
                                className="bg-dark-400 rounded-xl p-4 space-y-4 md:space-y-3"
                            >
                                {/* Header - Stack on mobile */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${statusInfo.color.replace('text', 'bg')}/10`}>
                                            {statusInfo.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-base md:text-lg font-medium text-light-100">
                                                {launch.agentName}
                                            </h3>
                                            <span className="text-xs text-light-500">#{launch.genesisId}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs md:text-sm ${statusInfo.color} font-medium`}>
                                        {statusInfo.text}
                                    </span>
                                </div>

                                {/* Amount and Market Cap - Stack on mobile */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <div className="p-3 rounded-lg bg-dark-300/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Wallet className="w-4 h-4 text-light-500" />
                                            <p className="text-xs text-light-500">Amount</p>
                                        </div>
                                        <p className="text-sm md:text-base text-light-100">
                                            {ethers.formatUnits(launch.userAmount, 18)} VIRTUAL
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-dark-300/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-light-500" />
                                            <p className="text-xs text-light-500">Market Cap</p>
                                        </div>
                                        <p className="text-sm md:text-base text-light-100">
                                            ${Number(launch.userMarketCap).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Times - Stack on mobile */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <div className="p-3 rounded-lg bg-dark-300/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-light-500" />
                                            <p className="text-xs text-light-500">Launch Time</p>
                                        </div>
                                        <p className="text-xs md:text-sm text-light-100">
                                            {format(new Date(launch.launchTime), 'PPp')}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-dark-300/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-light-500" />
                                            <p className="text-xs text-light-500">Status Time</p>
                                        </div>
                                        <p className="text-xs md:text-sm text-light-100">
                                            {statusInfo.time}
                                        </p>
                                    </div>
                                </div>

                                {/* Links - Full width on mobile */}
                                <div className="space-y-2 pt-2 border-t border-dark-300">
                                    {launch.tokenAddress && (
                                        <a
                                            href={`https://basescan.org/token/${launch.tokenAddress}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
                                        >
                                            <span className="text-xs text-light-500">Token</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-primary-400 truncate max-w-[120px] md:max-w-[200px]">
                                                    {launch.tokenAddress}
                                                </span>
                                                <ExternalLink className="w-3 h-3 text-light-500" />
                                            </div>
                                        </a>
                                    )}
                                    
                                    {launch.transactionHash && (
                                        <a
                                            href={`https://basescan.org/tx/${launch.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
                                        >
                                            <span className="text-xs text-light-500">Transaction</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-primary-400 truncate max-w-[120px] md:max-w-[200px]">
                                                    {launch.transactionHash}
                                                </span>
                                                <ExternalLink className="w-3 h-3 text-light-500" />
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-dark-400 rounded-xl p-6">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <Search className="w-8 h-8 text-light-500 mb-2" />
                            <h3 className="text-base md:text-lg font-medium text-light-100">
                                No launches found
                            </h3>
                            <p className="text-xs md:text-sm text-light-500">
                                No launches match your search for "{searchTerm}"
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenesisList;