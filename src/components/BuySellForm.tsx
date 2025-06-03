import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Zap, Info, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { GenesisLaunch } from '../context/GenesisContext';
import { tokens } from '../data/supportedTokens';
import { useAuth } from '../context/AuthContext';

interface BuySellFormProps {
    project: any;
    isOpen: boolean;
    onClose: () => void;
}

export const BuySellForm: React.FC<BuySellFormProps> = ({ project, isOpen, onClose }) => {
    const [amount, setAmount] = useState<string>('');
    const {jwt} = useAuth()
    const [token, setToken] = useState<string>('BASE_ETH');
    const [isBuying, setIsBuying] = useState<boolean>(true);
    const [showTokenDropdown, setShowTokenDropdown] = useState(false);
    const [quote, setQuote] = useState<string>('');
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const getTokenInfo = (symbol: string) => tokens.find(t => t.tokenSymbol === symbol);
    const selectedTokenInfo = getTokenInfo(token);
    const projectTokenInfo = {
        tokenSymbol: project.virtual.symbol,
        tokenContractAddress: project.virtual.tokenAddress ,
        decimals: 18,
    };

    useEffect(() => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setQuote('');
            setQuoteError(null);
            return;
        }
        setQuote('');
        setQuoteError(null);
        setQuoteLoading(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                // ChainId is always 8453 for BASE
                const chainId = 8453;
                const slippage = 0.5;
                let fromTokenAddress = '', toTokenAddress = '', decimals = 18;
                if (isBuying) {
                    fromTokenAddress = selectedTokenInfo?.tokenContractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
                    toTokenAddress = projectTokenInfo.tokenContractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
                    decimals = Number(selectedTokenInfo?.decimals) || 18;
                } else {
                    fromTokenAddress = projectTokenInfo.tokenContractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
                    toTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
                    decimals = projectTokenInfo.decimals || 18;
                }
                // Convert amount to BN
                const amountInBN = (BigInt(Math.floor(Number(amount) * Math.pow(10, decimals)))).toString();
                const url = `${import.meta.env.VITE_BACKEND_URL}/swapquote?chainId=${chainId}&fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amountInBN=${amountInBN}&slippage=${slippage}&userWalletAddress=0x3B35C042Ae25FE3d262158ec885CF7e042C58C42`;
                const res = await axios.get(url, {
                    headers: {
                        'authorization': `Bearer ${jwt}`
                    }
                });
                if (res.data && res.data.success && res.data.data) {
                    const toTokenAmount = res.data.data.toTokenAmount;
                    const toTokenDecimals = res.data.data.toToken.decimal || 18;
                    const humanAmount = (Number(toTokenAmount) / Math.pow(10, Number(toTokenDecimals))).toFixed(6);
                    setQuote(humanAmount);
                } else {
                    setQuote('');
                    setQuoteError('No quote available');
                }
            } catch {
                setQuote('');
                setQuoteError('Failed to fetch quote');
            } finally {
                setQuoteLoading(false);
            }
        }, 2000);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [amount, token, isBuying, projectTokenInfo.decimals, projectTokenInfo.tokenContractAddress, selectedTokenInfo?.decimals, selectedTokenInfo?.tokenContractAddress]);

    const selectedToken = tokens.find(t => t.tokenSymbol === token);

    const handleTokenSelect = (tokenSymbol: string) => {
        setToken(tokenSymbol);
        setShowTokenDropdown(false);
    };

    const handleTrade = () => {
        console.log(`${isBuying ? 'Buying' : 'Selling'} ${project.virtual.name} with ${amount} ${token}`);
        onClose();
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
                    <button
                        onClick={onClose}
                        className="text-light-400 hover:text-light-300"
                    >
                        <Clock className="w-5 h-5" />
                    </button>
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
                                    { selectedToken ? (
                                        <>
                                            <img
                                                src={selectedToken.tokenLogoUrl}
                                                alt={selectedToken.tokenSymbol}
                                                className="w-5 h-5 rounded-full"
                                            />
                                            <span>{selectedToken.tokenSymbol}</span>
                                        </>
                                    ) : null}
                                </button>
                                {showTokenDropdown  && (
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
                    <div className="flex justify-between text-sm">
                        <span className="text-light-400">You will receive</span>
                        <span className="text-light-300">
                            {quoteLoading ? 'Fetching quote...' : quoteError ? quoteError : (quote || '0.00')} {isBuying ? project.virtual.symbol : (selectedTokenInfo?.tokenSymbol || token)}
                        </span>
                    </div>
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