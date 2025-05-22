import React, { useState } from 'react';
import { Zap, Info, TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { GenesisLaunch } from '../context/GenesisContext';

interface BuySellFormProps {
    project: GenesisLaunch;
    isOpen: boolean;
    onClose: () => void;
}

export const BuySellForm: React.FC<BuySellFormProps> = ({ project, isOpen, onClose }) => {
    const [amount, setAmount] = useState<string>('');
    const [token, setToken] = useState<string>('ETH');
    const [isBuying, setIsBuying] = useState<boolean>(true);

    const handleTokenChange = (newToken: string) => {
        if (newToken === 'SELL') {
            setIsBuying(false);
            setToken('ETH');
        } else {
            setToken(newToken);
        }
        onClose();
    };

    const handleTrade = () => {
        // Implement trade logic here
        console.log(`${isBuying ? 'Buying' : 'Selling'} ${project.virtual.name} with ${amount} ${token}`);
    };

    if (!isOpen) return null;

    return (
        <div className="bg-dark-500 rounded-2xl border border-dark-300 shadow-xl h-fit">
            {/* Header with Token Info and Close Button */}
            <div className="p-4 border-b border-dark-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-300 flex-shrink-0">
                            {project.virtual.image && (
                                <img
                                    src={project.virtual.image.url}
                                    alt={project.virtual.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{project.virtual.name}</h2>
                            <div className="text-sm text-primary-400">${project.virtual.symbol}</div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-dark-300 transition-colors"
                    >
                        <X size={20} className="text-light-400" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="flex gap-2 bg-dark-400 p-1 rounded-lg">
                    <button
                        onClick={() => {
                            setIsBuying(true);
                            onClose();
                        }}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2
                            ${isBuying
                                ? 'bg-success-500 text-white shadow-lg shadow-success-500/20'
                                : 'text-light-300 hover:bg-dark-300'
                            }`}
                    >
                        <TrendingUp size={16} />
                        <span>Buy</span>
                    </button>
                    <button
                        onClick={() => {
                            setIsBuying(false);
                            onClose();
                        }}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2
                            ${!isBuying
                                ? 'bg-error-500 text-white shadow-lg shadow-error-500/20'
                                : 'text-light-300 hover:bg-dark-300'
                            }`}
                    >
                        <TrendingDown size={16} />
                        <span>Sell</span>
                    </button>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-light-400">Amount</label>
                        {isBuying ? (
                            <span className="text-xs text-light-500">Available: 0.00 {token}</span>
                        ) : (
                            <span className="text-xs text-light-500">Balance: 0.00 {project.virtual.symbol}</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 bg-dark-400 rounded-lg p-3">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                onClose();
                            }}
                            placeholder="0.0"
                            className="w-full bg-transparent text-white text-lg focus:outline-none"
                        />
                        {isBuying ? (
                            <select
                                value={token}
                                onChange={(e) => handleTokenChange(e.target.value)}
                                className="bg-dark-300 text-white px-3 py-1 rounded-md focus:outline-none"
                            >
                                <option value="ETH">ETH</option>
                                <option value="USDC">USDC</option>
                                <option value="SELL">SELL</option>
                            </select>
                        ) : (
                            <div className="bg-dark-300 text-white px-3 py-1 rounded-md flex items-center space-x-2">
                                <img
                                    src={project.virtual.image?.url}
                                    alt={project.virtual.symbol}
                                    className="w-5 h-5 rounded-full"
                                />
                                <span>{project.virtual.symbol}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Impact and Slippage */}
                <div className="bg-dark-400/60 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-light-400">Price Impact</span>
                        <span className="text-success-400">0.01%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-400">Slippage Tolerance</span>
                        <span className="text-light-300">0.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-400">Network Fee</span>
                        <span className="text-light-300">~$0.50</span>
                    </div>
                    {!isBuying && (
                        <div className="flex justify-between text-sm">
                            <span className="text-light-400">You will receive</span>
                            <span className="text-light-300">0.00 {token}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-dark-300 hover:bg-dark-200 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTrade}
                        className={`flex-1 font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2
                            ${isBuying
                                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                                : 'bg-error-500 hover:bg-error-600 text-white'
                            }`}
                    >
                        <Zap size={18} />
                        <span>{isBuying ? 'Buy' : 'Sell'} {project.virtual.symbol}</span>
                    </button>
                </div>

                {/* Additional Info */}
                <div className="bg-dark-400/60 rounded-lg p-3 text-sm text-light-400">
                    <div className="flex items-center space-x-2 mb-2">
                        <Info size={14} />
                        <span>Trading on Base Network</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>Estimated time: ~30 seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 