import React, { useState } from 'react';
import { ArrowRight, Lock, Copy, Check } from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import BaseIcon from '../ui/BaseIcon';

interface PrototypeTokenData {
    id: number;
    uid: string;
    name: string;
    symbol: string;
    description: string;
    category: string;
    role: string;
    status: string;
    chain: string;
    walletAddress: string;
    virtualTokenValue: string;
    holderCount: number;
    mcapInVirtual: number;
    priceChangePercent24h: number;
    volume24h: number;
    image?: { url: string };
    cores: Array<{ name: string; coreId: number }>;
}

export const PrototypeTokenList: React.FC<any> = ({
    token,
    isSelected,
    onClick
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`bg-dark-500 rounded-2xl border ${isSelected ? 'border-primary-500' : 'border-dark-300'
                } overflow-hidden cursor-pointer transition-colors`}
            onClick={onClick}
        >
            {/* Desktop View */}
            <div className="hidden md:block">
                <div className="grid grid-cols-9 gap-4 p-1 px-2 items-center">
                    {/* Token Info */}
                    <div className="col-span-3 flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-300 flex-shrink-0">
                            {token.image ? (
                                <>
                                    <img
                                        src={token.image.url}
                                        alt={token.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <BaseIcon />
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-light-400">
                                    {token.symbol.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="font-medium text-white flex items-center space-x-2">
                                <span>{token.name}</span>
                                <span className="text-xs text-light-400">({token.category})</span>
                            </div>
                            <div className="text-sm text-light-400 flex items-center space-x-2">
                                <span>${token.symbol}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-dark-400 text-primary-400">
                                    <BaseIcon />
                                </span>
                                <span className="text-xs text-light-400">{token.role}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-light-400">
                                    {token.walletAddress?.slice(0, 6)}...{token.walletAddress?.slice(-4)}
                                </span>
                                <CopyToClipboard text={token.walletAddress || ''} onCopy={handleCopy}>
                                    <button className="p-1 hover:bg-dark-400 rounded-full transition-colors">
                                        {copied ? (
                                            <Check size={12} className="text-success-400" />
                                        ) : (
                                            <Copy size={12} className="text-light-400" />
                                        )}
                                    </button>
                                </CopyToClipboard>
                            </div>
                        </div>
                    </div>

                    {/* Price & Change */}
                    <div className="col-span-1">
                        <div className="text-white font-medium">
                            {(Number(token.virtualTokenValue) / 10 ** 18).toFixed(7)} Virtuals
                        </div>
                        <div className={`text-sm ${token.priceChangePercent24h >= 0
                            ? 'text-success-400'
                            : 'text-error-400'
                            }`}>
                            {token.priceChangePercent24h > 0 ? '+' : ''}
                            {token.priceChangePercent24h.toFixed(2)}%
                        </div>
                    </div>

                    {/* Volume */}
                    <div className="col-span-1 text-right">
                        <div className="text-white">${token.volume24h.toLocaleString()}</div>
                        <div className="text-xs text-light-400">24h Volume</div>
                    </div>

                    {/* Cores */}
                    <div className="col-span-2">
                        <div className="flex flex-wrap gap-1">
                            {token.cores.map(core => (
                                <span
                                    key={core.coreId}
                                    className="px-2 py-0.5 text-xs rounded-full bg-dark-400 text-primary-400"
                                >
                                    {core.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Market Cap */}
                    <div className="col-span-1 text-right">
                        <div className="text-white">${token.mcapInVirtual.toLocaleString()}</div>
                        <div className="text-xs text-light-400">Market Cap</div>
                    </div>

                    {/* Holders */}
                    <div className="col-span-1 text-right">
                        <div className="text-white">{token.holderCount.toLocaleString()}</div>
                        <div className="text-xs text-light-400">Holders</div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-300">
                            {token.image?.url && (
                                <img
                                    src={token.image.url}
                                    alt={token.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="font-medium text-white">{token.name}</div>
                            <div className="text-sm text-primary-400">${token.symbol}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {token.cores.slice(0, 2).map(core => (
                                    <span
                                        key={core.coreId}
                                        className="px-2 py-0.5 text-xs rounded-full bg-dark-400 text-primary-400"
                                    >
                                        {core.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`text-sm font-medium ${token.priceChangePercent24h >= 0
                        ? 'text-success-400'
                        : 'text-error-400'
                        }`}>
                        {token.priceChangePercent24h > 0 ? '+' : ''}
                        {token.priceChangePercent24h.toFixed(2)}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-dark-400/50 rounded-lg p-2">
                        <div className="text-white font-medium">
                            ${token.mcapInVirtual.toLocaleString()}
                        </div>
                        <div className="text-xs text-light-400">Market Cap</div>
                    </div>
                    <div className="bg-dark-400/50 rounded-lg p-2">
                        <div className="text-white font-medium">
                            {token.holderCount.toLocaleString()}
                        </div>
                        <div className="text-xs text-light-400">Holders</div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link
                        to={`/tokens/${token.id}`}
                        className="p-2 rounded-full bg-dark-300 text-light-300"
                    >
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};