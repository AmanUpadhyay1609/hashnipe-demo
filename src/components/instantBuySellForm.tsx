import React, { useState, useMemo, useEffect } from 'react';
import { Zap, ArrowRight, ArrowUpDown, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import { ethers } from 'ethers';
import { chain } from 'lodash';

// Add token configs
const tokens = {
    ETH: {
        symbol: 'BASE_ETH',
        name: 'ETH',
        image: 'https://static.okx.com/cdn/wallet/logo/base_20900.png',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    },
    VIRTUAL: {
        symbol: 'VIRTUAL',
        name: 'Virtual Protocol',
        image: 'https://web3.okx.com/cdn/web3/currency/token/small/1-0x44ff8620b8ca30902395a7bd3f2407e1a091bf73-96',
        address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b'
    }
};

// Add types
interface TokenBalance {
    tokenAddress: string;
    balance: string;
}

interface ApiError {
    message: string;
    status?: number;
}

// Add useDebounce hook at the top of the file after imports
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Add a helper function for formatting balance display
const formatBalance = (balance: string | undefined, decimals: number = 6): string => {
    if (!balance) return '0.00';
    const num = parseFloat(balance);
    return num.toFixed(decimals);
};

// Update the component
export const InstantSwapForm: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { decodedToken, jwt } = useAuth();
    const { refreshBalance } = useApi();
    const [amount, setAmount] = useState('');
    const [quote, setQuote] = useState('0');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBuying, setIsBuying] = useState(true);
    const [balances, setBalances] = useState<Record<string, string>>({});
    const [isQuoteLoading, setIsQuoteLoading] = useState(false);
    const [swapStatus, setSwapStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const debouncedAmount = useDebounce(amount, 500);

    // Fetch balances
    useEffect(() => {
        const fetchBalances = async () => {
            if (!decodedToken?.wallets?.base) return;

            try {
                const promises = Object.values(tokens).map(async token => {
                    const balance = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/getBalance?tokenAddress=${token.address}&walletAddress=${decodedToken.wallets.base}`,
                        {
                            headers: { 'Authorization': `Bearer ${jwt}` }
                        }
                    );
                    const data = await balance.json();
                    return { tokenAddress: token.address, balance: data.data.formattedBalance };
                });

                const results = await Promise.all(promises);
                const balanceMap = results.reduce((acc, { tokenAddress, balance }) => ({
                    ...acc,
                    [tokenAddress]: balance
                }), {});

                setBalances(balanceMap);
            } catch (err) {
                console.error('Balance fetch error:', err);
            }
        };

        fetchBalances();
    }, [decodedToken?.wallets?.base, jwt]);

    // Update the quote fetching useEffect
    useEffect(() => {
        const fetchQuote = async () => {
            // Add check for zero amount
            if (!debouncedAmount ||
                isNaN(parseFloat(debouncedAmount)) ||
                parseFloat(debouncedAmount) <= 0 ||
                !decodedToken?.wallets?.base
            ) {
                setQuote('0');
                setError('');  // Clear any existing errors
                return;
            }

            setIsQuoteLoading(true);
            try {
                const fromToken = isBuying ? tokens.ETH.address : tokens.VIRTUAL.address;
                const toToken = isBuying ? tokens.VIRTUAL.address : tokens.ETH.address;

                // Parse amount to wei
                const amountInWei = ethers.parseUnits(debouncedAmount, 18).toString();

                const quoteParams = {
                    chainId: "8453",
                    fromTokenAddress: fromToken,
                    toTokenAddress: toToken,
                    amountInBN: amountInWei,
                    slippage: "0.5",
                    userWalletAddress: decodedToken.wallets.base
                };

                const queryString = new URLSearchParams(quoteParams).toString();
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/swapquote?${queryString}`,
                    {
                        headers: { 'Authorization': `Bearer ${jwt}` }
                    }
                );

                if (res.status === 429) {
                    const retryAfter = res.headers.get('Retry-After');
                    const waitTime = retryAfter ? parseInt(retryAfter) : 5;
                    setError(`Too many requests. Please wait ${waitTime} seconds.`);
                    setQuote('0');
                    return;
                }

                if (!res.ok) {
                    const errorData: ApiError = await res.json();
                    throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
                }

                const data = await res.json();
                if (data.success) {
                    setQuote(ethers.formatUnits(data.data.toTokenAmount, 18).toString());
                    setError('');
                } else {
                    throw new Error(data.message || 'Failed to fetch quote');
                }
            } catch (err) {
                console.error('Quote error:', err);
                if (err instanceof Error && err.message.includes('429')) {
                    setError('Too many requests. Please try again in a few seconds.');
                } else {
                    setError(err instanceof Error ? err.message : 'Failed to fetch quote');
                }
                setQuote('0');
            } finally {
                setIsQuoteLoading(false);
            }
        };

        fetchQuote();
    }, [debouncedAmount, isBuying, jwt, decodedToken?.wallets?.base]);

    // Add error debouncing
    const debouncedError = useDebounce(error, 500);

    // Validate amount
    const validateAmount = (value: string) => {
        // Don't clear error immediately for empty value
        if (!value) {
            return false;
        }

        const numAmount = parseFloat(value);
        const fromToken = isBuying ? tokens.ETH.address : tokens.VIRTUAL.address;
        const balance = parseFloat(balances[fromToken] || '0');
        const maxAmount = balance * 0.9; // 90% of balance

        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        if (numAmount > maxAmount) {
            setError(`Maximum amount is ${formatBalance(maxAmount.toString())} ${isBuying ? 'ETH' : 'VIRTUAL'}`);
            return false;
        }

        // Only clear error if all validations pass
        setError('');
        return true;
    };

    // Update handleSwap
    const handleSwap = async () => {
        if (!validateAmount(amount) || !decodedToken?.wallets?.base) return;

        setSwapStatus('loading');
        setError('');
        try {
            const fromToken = isBuying ? tokens.ETH.address : tokens.VIRTUAL.address;
            const toToken = isBuying ? tokens.VIRTUAL.address : tokens.ETH.address;

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/swap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    chainId: "8453",
                    fromTokenAddress: fromToken,
                    toTokenAddress: toToken,
                    amountInBN: ethers.parseUnits(amount, 18).toString(),
                    slippage: "0.5",
                    userWalletAddress: decodedToken.wallets.base,
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Swap failed');
            }

            await res.json();
            await refreshBalance();
            setSwapStatus('success');
            setTimeout(() => {
                onClose();
                setSwapStatus('idle');
            }, 2000);
        } catch (err) {
            console.error('Swap error:', err);
            setError(err instanceof Error ? err.message : 'Swap failed');
            setSwapStatus('error');
        }
    };

    const isDisabled = useMemo(() => isLoading || !amount || parseFloat(amount) <= 0, [isLoading, amount]);

    // Add computed values for balances
    const fromTokenBalance = useMemo(() => {
        const fromToken = isBuying ? tokens.ETH.address : tokens.VIRTUAL.address;
        return formatBalance(balances[fromToken]);
    }, [balances, isBuying]);

    const toTokenBalance = useMemo(() => {
        const toToken = isBuying ? tokens.VIRTUAL.address : tokens.ETH.address;
        return formatBalance(balances[toToken]);
    }, [balances, isBuying]);

    return (
        <div className="w-full max-w-md bg-dark-500 p-6 rounded-xl border border-dark-300 shadow-xl space-y-6">
            <div className="flex items-start justify-between space-x-4">
                <div className="flex w-100 space-x-4 justify-between ">
                    <div className="flex items-center justify-between ">
                        <div className="flex flex-col items-center space-y-2 relative ">
                            {/* First Token */}
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-dark-400">
                                    <img
                                        src={isBuying ? tokens.ETH.image : tokens.VIRTUAL.image}
                                        alt={isBuying ? "ETH" : "VIRTUAL"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-medium text-light-300">
                                    {isBuying ? tokens.ETH.symbol : tokens.VIRTUAL.symbol}
                                </span>
                            </div>
                            <div className='w-100 h-100 flex justify-center items-center'>
                                {/* Toggle Button */}
                                <button
                                    onClick={() => setIsBuying(!isBuying)}
                                    className="p-1.5 rounded-full bg-dark-300 hover:bg-dark-200 transition-colors"
                                >
                                    <ArrowUpDown size={14} className="text-light-400" />
                                </button>
                            </div>
                            {/* Second Token */}
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-dark-400">
                                    <img
                                        src={isBuying ? tokens.VIRTUAL.image : tokens.ETH.image}
                                        alt={isBuying ? "VIRTUAL" : "ETH"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-medium text-light-300">
                                    {isBuying ? tokens.VIRTUAL.symbol : tokens.ETH.symbol}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-6">
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => {
                                const newAmount = e.target.value;
                                setAmount(newAmount);
                                validateAmount(newAmount);
                            }}
                            max={balances[isBuying ? tokens.ETH.address : tokens.VIRTUAL.address]}
                            className="w-32 text-right p-2 rounded-md bg-dark-400 border border-dark-200 text-white placeholder-light-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="w-32 text-right p-2 text-light-400">
                            {isQuoteLoading ? (
                                <Loader size={16} className="animate-spin ml-auto" />
                            ) : (
                                Number(quote).toFixed(6)
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSwap}
                    disabled={swapStatus === 'loading' || !!error || !amount}
                    className="w-full py-3 px-4 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {swapStatus === 'loading' ? (
                        <Loader size={20} className="animate-spin" />
                    ) : swapStatus === 'success' ? (
                        <CheckCircle size={20} />
                    ) : (
                        <>
                            <Zap size={18} />
                            <span>Swap</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex items-center justify-between text-sm text-light-500">
                <span>Balance:</span>
                <span>
                    {balances[isBuying ? tokens.ETH.address : tokens.VIRTUAL.address] || '0'}
                    {isBuying ? ' ETH' : ' VIRTUAL'}
                </span>
            </div>

            {debouncedError && (
                <div className="flex items-center space-x-2 text-error-500">
                    <AlertCircle size={16} />
                    <p className="text-sm">{debouncedError}</p>
                </div>
            )}
        </div>
    );
};
