import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const CopyAddress: React.FC<{ address: string }> = ({ address }) => {
    const [copied, setCopied] = useState(false);

    const shortenAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-dark-300 transition-colors group"
            title={`Copy address: ${address}`}
        >
            <span className="text-xs text-light-400">{shortenAddress(address)}</span>
            <span className="text-light-500 group-hover:text-light-300">
                {copied ? <Check size={12} /> : <Copy size={12} />}
            </span>
        </button>
    );
};