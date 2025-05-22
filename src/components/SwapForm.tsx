import React, { useState } from 'react';
import { ArrowDownUp, Zap } from 'lucide-react';

interface SwapFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SwapForm: React.FC<SwapFormProps> = ({ isOpen, onClose }) => {
    const [fromAmount, setFromAmount] = useState<string>('');
    const [toAmount, setToAmount] = useState<string>('');
    const [fromToken, setFromToken] = useState<string>('ETH');
    const [toToken, setToToken] = useState<string>('VIRTUAL');

    const handleSwap = () => {
        // Implement swap logic here
        console.log('Swapping', fromAmount, fromToken, 'to', toAmount, toToken);
    };

    if (!isOpen) return null;

    return (
        <div className="bg-dark-500 rounded-2xl border border-dark-300 shadow-xl h-fit">
            <div className="p-4 border-b border-dark-300">
                <h2 className="text-xl font-semibold text-white">Swap Tokens</h2>
            </div>

            <div className="p-4 space-y-4">
                {/* From Token */}
                <div className="space-y-2">
                    <label className="text-sm text-light-400">From</label>
                    <div className="flex items-center space-x-2 bg-dark-400 rounded-lg p-3">
                        <input
                            type="number"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-transparent text-white text-lg focus:outline-none"
                        />
                        <select
                            value={fromToken}
                            onChange={(e) => setFromToken(e.target.value)}
                            className="bg-dark-300 text-white px-3 py-1 rounded-md focus:outline-none"
                        >
                            <option value="ETH">ETH</option>
                            <option value="USDT">USDT</option>
                            <option value="USDC">USDC</option>
                        </select>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                    <button className="p-2 rounded-full bg-dark-300 hover:bg-dark-200 transition-colors">
                        <ArrowDownUp size={20} className="text-light-400" />
                    </button>
                </div>

                {/* To Token */}
                <div className="space-y-2">
                    <label className="text-sm text-light-400">To</label>
                    <div className="flex items-center space-x-2 bg-dark-400 rounded-lg p-3">
                        <input
                            type="number"
                            value={toAmount}
                            onChange={(e) => setToAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-transparent text-white text-lg focus:outline-none"
                        />
                        <select
                            value={toToken}
                            onChange={(e) => setToToken(e.target.value)}
                            className="bg-dark-300 text-white px-3 py-1 rounded-md focus:outline-none"
                        >
                            <option value="VIRTUAL">VIRTUAL</option>
                        </select>
                    </div>
                </div>

                {/* Swap Button */}
                <button
                    onClick={handleSwap}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                    <Zap size={18} />
                    <span>Swap</span>
                </button>

                {/* Price Info */}
                <div className="bg-dark-400/60 rounded-lg p-3 text-sm text-light-400">
                    <div className="flex justify-between mb-1">
                        <span>Price</span>
                        <span>1 VIRTUAL = 0.0001 ETH</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Slippage</span>
                        <span>0.5%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 