import React, { useState } from 'react';
import { Zap, Info, TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { GenesisLaunch } from '../context/GenesisContext';

interface BuySellFormProps {
    project: GenesisLaunch;
    isOpen: boolean;
    onClose: () => void;
}

export const BuySellForm: React.FC<any> = ({ project, isOpen, onClose }) => {
    const [amount, setAmount] = useState<string>('');
    const [token, setToken] = useState<string>('BASE_ETH');
    const [isBuying, setIsBuying] = useState<boolean>(true);
    const [showTokenDropdown, setShowTokenDropdown] = useState(false);

    //Replace with actual token data or fetch from an API
    const tokens = [
        {
            decimals: '6',
            tokenContractAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            tokenLogoUrl: 'https://static.okx.com/cdn/web3/currency/token/small/637-0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b-1?v=1742202380789',
            tokenName: 'usdc',
            tokenSymbol: 'USDC'
        },
        {
            decimals: '18',
            tokenContractAddress: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
            tokenLogoUrl: 'https://static.okx.com/cdn/web3/currency/token/small/8453-0x50c5725949a6f0c72e6c4a641f24049a917db0cb-97?v=1748278077008',
            tokenName: 'Dai Stablecoin',
            tokenSymbol: 'DAI'
        },
        {
            decimals: '18',
            tokenContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            tokenLogoUrl: 'https://static.okx.com/cdn/wallet/logo/base_20900.png',
            tokenName: 'Base',
            tokenSymbol: 'BASE_ETH'
        },
        {
            decimals: '18',
            tokenContractAddress: '0x4200000000000000000000000000000000000006',
            tokenLogoUrl: 'https://static.okx.com/cdn/wallet/logo/WETH-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
            tokenName: 'Wrapped Ether',
            tokenSymbol: 'WETH'
        },
    ];

    const selectedToken = tokens.find(t => t.tokenSymbol === token);

    const handleTokenSelect = (tokenSymbol: string) => {
        setToken(tokenSymbol);
        setShowTokenDropdown(false);
    };

    const handleTrade = () => {
        console.log(`${isBuying ? 'Buying' : 'Selling'} ${project.virtual.name} with ${amount} ${token}`);
    };

    if (!isOpen) return null;

    return (
        <div className="bg-dark-500 rounded-2xl border border-dark-300 shadow-xl h-fit">
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
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex gap-2 bg-dark-400 p-1 rounded-lg">
                    <button
                        onClick={() => setIsBuying(true)}
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
                        onClick={() => setIsBuying(false)}
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
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-transparent text-white text-lg focus:outline-none"
                        />
                        {isBuying ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                                    className="bg-dark-300 text-white px-3 py-1 rounded-md focus:outline-none flex items-center space-x-2"
                                >
                                    {selectedToken && (
                                        <>
                                            <img
                                                src={selectedToken.tokenLogoUrl}
                                                alt={selectedToken.tokenSymbol}
                                                className="w-5 h-5 rounded-full"
                                            />
                                            <span>{selectedToken.tokenSymbol}</span>
                                        </>
                                    )}
                                </button>
                                {showTokenDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-dark-500 rounded-lg border border-dark-300 shadow-xl z-50">
                                        <div className="p-2 max-h-60 overflow-y-auto">
                                            {tokens.map((token) => (
                                                <div
                                                    key={token.tokenContractAddress}
                                                    onClick={() => handleTokenSelect(token.tokenSymbol)}
                                                    className="flex items-center space-x-3 p-2 hover:bg-dark-400 rounded-md cursor-pointer"
                                                >
                                                    <img
                                                        src={token.tokenLogoUrl}
                                                        alt={token.tokenSymbol}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-white">
                                                            {token.tokenSymbol}
                                                        </span>
                                                        <span className="text-xs text-light-400">
                                                            {token.tokenName}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
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

                <div className="flex gap-2 mt-4">
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