import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Zap, Info, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Suportedtokens, VirtualToken } from '../data/supportedTokens';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import { ethers } from 'ethers';

interface BuySellFormProps {
    project: any;
    isOpen: boolean;
    type: any;
    onClose: () => void;
}

export const BuySellForm: React.FC<BuySellFormProps> = ({ project, isOpen, onClose, type }) => {
    const [amount, setAmount] = useState<string>('');
    const { jwt, decodedToken } = useAuth()
    const { getBalance } = useApi();
    const [token, setToken] = useState<string>('VIRTUAL');
    const [isBuying, setIsBuying] = useState<boolean>(true);
    const [showTokenDropdown, setShowTokenDropdown] = useState(false);
    const [quote, setQuote] = useState<string>('');
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [tokenBalance, setTokenBalance] = useState<string>('0');
    const [projectBalance, setProjectBalance] = useState<string>('0');
    const [error, setError] = useState<string>('');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const tokens = type == '' ? Suportedtokens : VirtualToken
    const getTokenInfo = (symbol: string) => tokens.find(t => t.tokenSymbol === symbol);
    const selectedTokenInfo = getTokenInfo(token);

    const projectTokenInfo = {
        tokenSymbol: project.virtual.symbol,
        tokenContractAddress: project.virtual.tokenAddress,
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

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                // Fetch selected token balance
                if (selectedTokenInfo?.tokenContractAddress && decodedToken?.wallets?.base) {
                    const balance = await getBalance(
                        selectedTokenInfo.tokenContractAddress,
                        decodedToken.wallets.base
                    );
                    setTokenBalance(balance);
                }

                // Fetch project token balance
                if (project.virtual.tokenAddress && decodedToken?.wallets?.base) {
                    const balance = await getBalance(
                        project.virtual.tokenAddress,
                        decodedToken.wallets.base
                    );
                    setProjectBalance(balance);
                }
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();
    }, [token, decodedToken?.wallets?.base, project.virtual.tokenAddress]);

    const selectedToken = tokens.find(t => t.tokenSymbol === token);

    const handleTokenSelect = (tokenSymbol: string) => {
        setToken(tokenSymbol);
        setShowTokenDropdown(false);
    };

    const handleSwapSuccess = (result: any) => {
        const formattedAmount = Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        });

        const successMessage = (
            <div className="flex flex-col space-y-1">
                <span className="font-medium">
                    {isBuying ? '🟢 Buy Success' : '🔴 Sell Success'}
                </span>
                <span className="text-sm opacity-90">
                    {isBuying
                        ? `Bought ${formattedAmount} ${project.virtual.symbol} for ${formattedAmount} ${selectedTokenInfo?.tokenSymbol}`
                        : `Sold ${formattedAmount} ${project.virtual.symbol} for ${formattedAmount} ${selectedTokenInfo?.tokenSymbol}`
                    }
                </span>
            </div>
        );



        onClose();
    };

    const handleSwapError = (error: unknown) => {
        const errorMessage = (
            <div className="flex flex-col space-y-1">
                <span className="font-medium text-error-400">
                    ⚠️ Swap Failed
                </span>
                <span className="text-sm opacity-90">
                    {error instanceof Error
                        ? error.message
                        : 'Failed to execute swap. Please try again.'}
                </span>
            </div>
        );
    };

    const handleTrade = async () => {
        if (!validateAmount(amount) || !decodedToken?.wallets?.base) {
            return;
        }

        try {
            const fromTokenAddress = isBuying
                ? selectedTokenInfo?.tokenContractAddress
                : project.virtual.tokenAddress;
            const toTokenAddress = isBuying
                ? project.virtual.tokenAddress
                : selectedTokenInfo?.tokenContractAddress;

            if (!fromTokenAddress || !toTokenAddress) {
                throw new Error('Invalid token addresses');
            }

            // Convert decimals to string
            const decimals = (isBuying
                ? selectedTokenInfo?.decimals || 18
                : project.virtual.decimals || 18).toString();
            console.log("decimals", decimals)

            // Parse amount with string decimals
            const amountInWei = ethers.parseUnits(amount, Number(decimals)).toString();
            console.log("amountInWei", amountInWei)
            const swapParams = {
                chainId: "8453", // Fixed chain ID for Base
                fromTokenAddress,
                toTokenAddress,
                amountInBN: amountInWei,
                slippage: "0.5",
                userWalletAddress: decodedToken.wallets.base
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/swap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify(swapParams)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Swap failed');
            }

            const result = await response.json();

            if (result.success) {
                handleSwapSuccess(result);
            } else {
                throw new Error(result.message || 'Swap failed');
            }
        } catch (error) {
            console.error('Swap error:', error);
            handleSwapError(error);

            // Reset loading state if you have one
            setIsLoading(false);
        }
    };

    const handlePercentageSelect = (percentage: number) => {
        if (!isBuying) {
            const maxBalance = parseFloat(projectBalance);
            const calculatedAmount = (maxBalance * percentage / 100).toFixed(6);
            setAmount(calculatedAmount);
        } else {
            const maxBalance = parseFloat(tokenBalance);
            const calculatedAmount = (maxBalance * percentage / 100).toFixed(6);
            setAmount(calculatedAmount);
        }
    };

    const validateAmount = useCallback((value: string) => {
        const numAmount = parseFloat(value);
        const maxBalance = isBuying
            ? parseFloat(tokenBalance)
            : parseFloat(projectBalance);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        if (numAmount > maxBalance) {
            setError(`Insufficient ${isBuying ? selectedTokenInfo?.tokenSymbol : project.virtual.symbol} balance`);
            return false;
        }

        setError('');
        return true;
    }, [isBuying, tokenBalance, projectBalance, selectedTokenInfo, project.virtual]);

    const isTradeDisabled = useMemo(() => {
        const numAmount = parseFloat(amount);
        const maxBalance = isBuying
            ? parseFloat(tokenBalance)
            : parseFloat(projectBalance);

        return (
            isNaN(numAmount) ||
            numAmount <= 0 ||
            numAmount > maxBalance ||
            !!error ||
            quoteLoading ||
            !!quoteError
        );
    }, [amount, tokenBalance, projectBalance, error, quoteLoading, quoteError, isBuying]);

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
                            <span className="text-xs text-light-500">
                                Available: {tokenBalance} {token}
                            </span>
                        ) : (
                            <span className="text-xs text-light-500">
                                Balance: {projectBalance} {project.virtual.symbol}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2 bg-dark-400 rounded-lg p-3">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setAmount(value);
                                    validateAmount(value);
                                }}
                                placeholder="0.0"
                                className={`w-full bg-transparent text-white text-lg focus:outline-none ${error ? 'text-error-500' : ''
                                    }`}
                            />
                            {isBuying ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                                        className="bg-dark-300 text-white px-3 py-1 rounded-md focus:outline-none flex items-center space-x-2"

                                    >
                                        {selectedToken ? (
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

                        {/* Add percentage buttons */}
                        {!isBuying && (
                            <div className="flex space-x-2">
                                {[25, 50, 75, 100].map((percentage) => (
                                    <button
                                        key={percentage}
                                        onClick={() => handlePercentageSelect(percentage)}
                                        className="flex-1 py-1 px-2 text-xs rounded bg-dark-300 text-light-300 hover:bg-dark-200 transition-colors"
                                    >
                                        {percentage}%
                                    </button>
                                ))}
                            </div>
                        )}

                        {error && (
                            <p className="text-xs text-error-500 mt-1">
                                {error}
                            </p>
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
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-light-400 flex items-center space-x-1">
                            <Info size={14} className="text-light-500" />
                            <span>You will receive</span>
                        </span>
                        <div className="flex items-center space-x-2">
                            {quoteLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />
                                    <span className="text-light-500">Fetching quote...</span>
                                </div>
                            ) : quoteError ? (
                                <span className="text-error-400">{quoteError}</span>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="text-xl font-medium text-light-300">
                                        {Number(quote || '0').toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 6
                                        })}
                                    </span>
                                    <span className="text-light-500">
                                        {isBuying ? project.virtual.symbol : (selectedTokenInfo?.tokenSymbol || token)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleTrade}
                        disabled={isTradeDisabled}
                        className={`flex-1 font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2
                            ${isTradeDisabled
                                ? 'bg-dark-300 cursor-not-allowed text-light-500'
                                : isBuying
                                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                                    : 'bg-error-500 hover:bg-error-600 text-white'
                            }`}
                    >
                        <Zap size={18} className={isTradeDisabled ? 'opacity-50' : ''} />
                        <span>
                            {isTradeDisabled
                                ? 'Insufficient Amount'
                                : `${isBuying ? 'Buy' : 'Sell'} ${project.virtual.symbol}`}
                        </span>
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

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}
function setIsLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}

