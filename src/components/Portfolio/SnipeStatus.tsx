import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Check, AlertCircle, Clock, ExternalLink, Search } from 'lucide-react';
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
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by agent name, ID, token or transaction..."
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-400 border border-dark-300 rounded-lg text-sm text-light-100 placeholder:text-light-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-500" />
            </div>

            {/* Results Count */}
            <div className="text-sm text-light-500">
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
                                className="bg-dark-400 rounded-xl p-4 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {statusInfo.icon}
                                        <h3 className="text-lg font-medium text-light-100">
                                            {launch.agentName} #{launch.genesisId}
                                        </h3>
                                    </div>
                                    <span className={`text-sm ${statusInfo.color}`}>
                                        {statusInfo.text}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-light-500">Amount</p>
                                        <p className="text-light-100">
                                            {ethers.formatUnits(launch.userAmount, 18)} VIRTUAL
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-light-500">Market Cap</p>
                                        <p className="text-light-100">
                                            ${Number(launch.userMarketCap).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-light-500">Launch Time</p>
                                        <p className="text-light-100">
                                            {format(new Date(launch.launchTime), 'PPp')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-light-500">Status Time</p>
                                        <p className="text-light-100">
                                            {statusInfo.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 text-sm">
                                    {launch.tokenAddress && (
                                        <div>
                                            <p className="text-light-500">Token</p>
                                            <a
                                                href={`https://basescan.org/token/${launch.tokenAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-400 hover:text-primary-300 truncate block flex items-center gap-1"
                                            >
                                                {launch.tokenAddress}
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    )}
                                    
                                    {launch.transactionHash && (
                                        <div>
                                            <p className="text-light-500">Transaction</p>
                                            <a
                                                href={`https://basescan.org/tx/${launch.transactionHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-400 hover:text-primary-300 truncate block flex items-center gap-1"
                                            >
                                                {launch.transactionHash}
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-dark-400 rounded-xl p-6">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <Search className="w-8 h-8 text-light-500 mb-2" />
                            <h3 className="text-lg font-medium text-light-100">
                                No launches found
                            </h3>
                            <p className="text-sm text-light-500">
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