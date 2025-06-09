import React, { useState, useMemo } from 'react';
import { ArrowDownUp, ChevronDown, SearchIcon } from 'lucide-react';

interface Token {
    symbol: string;
    address: string;
    balance?: string;
    decimals: number;
    logo?: string;
}

interface SwapFormProps {
    userBalances: Token[];
    supportedTokens: any;
}

export const SwapForm: React.FC<SwapFormProps> = ({ userBalances, supportedTokens }) => {
    const [fromToken, setFromToken] = useState<Token | null>(null);
    const [toToken, setToToken] = useState<Token | null>(null);
    const [amount, setAmount] = useState('');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter available 'to' tokens by removing selected 'from' token
    const availableToTokens = useMemo(() => {
        return supportedTokens.filter(token => token.address !== fromToken?.address);
    }, [supportedTokens, fromToken]);

    const handleFromTokenSelect = (token: Token) => {
        setFromToken(token);
        setShowFromDropdown(false);
        // If selected token is same as 'to' token, clear 'to' token
        if (token.address === toToken?.address) {
            setToToken(null);
        }
    };

    return (
        <div className="bg-dark-400 rounded-xl p-6 space-y-6">
            <div className="space-y-4">
                {/* From Token Section */}
                <div className="space-y-2">
                    <label className="text-sm text-light-500">From</label>
                    <div className="relative">
                        <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {fromToken?.logo && (
                                    <img
                                        src={fromToken.logo}
                                        alt={fromToken.symbol}
                                        className="w-6 h-6 rounded-full"
                                    />
                                )}
                                <button
                                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                                    className="flex items-center space-x-2"
                                >
                                    <span className="text-white">
                                        {fromToken ? fromToken.symbol : 'Select token'}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-light-500" />
                                </button>
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.0"
                                className="w-1/2 text-right bg-transparent focus:outline-none text-white"
                            />
                        </div>

                        {/* From Token Dropdown */}
                        {showFromDropdown && (
                            <div className="absolute z-10 w-full mt-2 bg-dark-300 rounded-lg shadow-xl">
                                <div className="p-4 border-b border-dark-200">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search tokens"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-dark-400 rounded-lg text-white focus:outline-none"
                                        />
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-500" />
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {userBalances
                                        .filter(token =>
                                            token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map(token => (
                                            <button
                                                key={token.address}
                                                onClick={() => handleFromTokenSelect(token)}
                                                className="w-full flex items-center space-x-3 p-4 hover:bg-dark-400 transition-colors"
                                            >
                                                {token.logo && (
                                                    <img
                                                        src={token.logo}
                                                        alt={token.symbol}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                )}
                                                <div className="flex-1 text-left">
                                                    <div className="text-white">{token.symbol}</div>
                                                    <div className="text-sm text-light-500">
                                                        Balance: {token.balance}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Swap Direction Button */}
                <button
                    className="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-dark-300 hover:bg-dark-200 transition-colors"
                    onClick={() => {
                        const temp = fromToken;
                        setFromToken(toToken);
                        setToToken(temp);
                    }}
                >
                    <ArrowDownUp className="w-4 h-4 text-light-500" />
                </button>

                {/* To Token Section */}
                <div className="space-y-2">
                    <label className="text-sm text-light-500">To</label>
                    <div className="relative">
                        <div className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {toToken?.logo && (
                                    <img
                                        src={toToken.logo}
                                        alt={toToken.symbol}
                                        className="w-6 h-6 rounded-full"
                                    />
                                )}
                                <button
                                    onClick={() => setShowToDropdown(!showToDropdown)}
                                    className="flex items-center space-x-2"
                                >
                                    <span className="text-white">
                                        {toToken ? toToken.symbol : 'Select token'}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-light-500" />
                                </button>
                            </div>
                            <div className="text-right text-light-500">
                                {/* Estimated output amount would go here */}
                                -
                            </div>
                        </div>

                        {/* To Token Dropdown */}
                        {showToDropdown && (
                            <div className="absolute z-10 w-full mt-2 bg-dark-300 rounded-lg shadow-xl">
                                <div className="p-4 border-b border-dark-200">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search tokens"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-dark-400 rounded-lg text-white focus:outline-none"
                                        />
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-500" />
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {availableToTokens
                                        .filter(token =>
                                            token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map(token => (
                                            <button
                                                key={token.address}
                                                onClick={() => {
                                                    setToToken(token);
                                                    setShowToDropdown(false);
                                                }}
                                                className="w-full flex items-center space-x-3 p-4 hover:bg-dark-400 transition-colors"
                                            >
                                                {token.logo && (
                                                    <img
                                                        src={token.logo}
                                                        alt={token.symbol}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                )}
                                                <div className="text-white">{token.symbol}</div>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                disabled={!fromToken || !toToken || !amount}
                className="w-full py-3 px-4 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {!fromToken || !toToken
                    ? 'Select tokens'
                    : !amount
                        ? 'Enter amount'
                        : 'Swap'}
            </button>
        </div>
    );
};