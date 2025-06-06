import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenesisLaunch } from '../context/GenesisContext';
import { agentService, VIRTUALS_TOKEN_ADDRESS } from '../api/snipe';
import { toast } from 'react-hot-toast';
import { differenceInSeconds, format } from 'date-fns';
import { ethers } from 'ethers';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';

// CountdownTimer component
const CountdownTimer: React.FC<{ project: GenesisLaunch }> = ({ project }) => {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const targetDate = new Date(project.endsAt);
            const secondsLeft = differenceInSeconds(targetDate, now);

            if (secondsLeft <= 0) {
                setTimeLeft('Ended');
                return;
            }

            // Calculate days, hours, minutes, and seconds
            const days = Math.floor(secondsLeft / (24 * 3600));
            const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
            const minutes = Math.floor((secondsLeft % 3600) / 60);
            const seconds = secondsLeft % 60
            // Format with leading zeros
            const formattedTime = `${days}:${hours}:${minutes}:${seconds}`;
            setTimeLeft(formattedTime);
        };

        // Initial update
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        // Cleanup
        return () => clearInterval(interval);
    }, [project.endsAt]);

    return (
        <div className="px-4 py-2 rounded-lg text-base font-mono bg-warning-500/20 text-warning-400">
            <div className="flex items-center space-x-2">
                <span className="text-sm font-sans">Ends in</span>
                <span className="tracking-wider">{timeLeft}</span>
            </div>
        </div>
    );
};

interface SnipeFormProps {
    project: GenesisLaunch;
    isOpen: boolean;
    onSnipe: any;
    onClose: () => void;
    className?: string;
}

interface Notification {
    type: 'success' | 'error';
    message: string;
    details?: string;
}

export const SnipeForm: React.FC<SnipeFormProps> = ({ project, isOpen, onClose, onSnipe, className }) => {
    const { decodedToken, jwt } = useAuth();
    const { virtualBalance, refreshBalance } = useApi(); // Add this to get virtual balance
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [notification, setNotification] = useState<Notification | null>(null);

    // Validate amount whenever it changes
    const validateAmount = useCallback((value: string) => {
        const numAmount = parseFloat(value);
        const numBalance = parseFloat(virtualBalance);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        if (numAmount > numBalance) {
            setError('Insufficient VIRTUAL balance');
            return false;
        }

        setError('');
        return true;
    }, [virtualBalance]);

    // Handle amount change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value);
        validateAmount(value);
    };

    // Check if button should be disabled
    const isButtonDisabled = useMemo(() => {
        const numAmount = parseFloat(amount);
        return isLoading ||
            isNaN(numAmount) ||
            numAmount <= 0 ||
            numAmount > parseFloat(virtualBalance) ||
            !!error;
    }, [amount, isLoading, virtualBalance, error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!decodedToken?.wallets?.base) {
            setNotification({
                type: 'error',
                message: 'Wallet not connected'
            });
            return;
        }

        const numAmount = parseFloat(amount);
        if (!validateAmount(amount)) {
            return;
        }

        setIsLoading(true);
        try {
            if (!jwt) {
                throw new Error('Authentication token not found');
            }

            const snipeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/snipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    genesisId: project.genesisId.toString(),
                    name: project.virtual.name,
                    walletAddress: decodedToken.wallets.base,
                    token: "virtual",
                    amount: numAmount.toString(),
                    launchTime: project.endsAt,
                    marketCap: "1000000",
                })
            });

            console.log("snipe")
            if (!snipeResponse.ok) {
                const errorData = await snipeResponse.json();
                throw new Error(errorData.message || 'Failed to set up snipe');
            }

            const result = await snipeResponse.json();

            await refreshBalance();

            console.log("Result of snipe", result)

            setNotification({
                type: 'success',
                message: `${Number(result.data.deposit.finalAmount).toLocaleString()} VIRTUAL will be used to snipe ${project.virtual.name}`,
                details: `Launch Time: ${format(new Date(result.data.agent.launchTime), 'PPp')}`
            });

            onSnipe(result.data.agent);
            onClose();

        } catch (error) {
            console.error('Snipe error:', error);
            setNotification({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to set up snipe'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const NotificationMessage: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`fixed bottom-4 right-4 max-w-md p-4 rounded-lg border ${notification.type === 'success'
                    ? 'bg-dark-500 border-success-500/50 text-success-400'
                    : 'bg-dark-500 border-error-500/50 text-error-400'
                    }`}
            >
                <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                        {notification.type === 'success' ? '🎯' : '⚠️'}
                    </span>
                    <div className="flex-1">
                        <p className="font-medium">
                            {notification.type === 'success' ? 'Snipe Set Successfully' : 'Snipe Failed'}
                        </p>
                        <p className="text-sm mt-1 text-light-300">{notification.message}</p>
                        {notification.details && (
                            <p className="text-xs mt-1 text-light-500">{notification.details}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-light-500 hover:text-light-300 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="w-full max-w-md bg-dark-500 rounded-2xl border border-dark-300 shadow-xl p-4">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-300">
                                    {project.virtual.image && (
                                        <img
                                            src={project.virtual.image.url}
                                            alt={project.virtual.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{project.virtual.name}</h3>
                                    <p className="text-sm text-primary-400">${project.virtual.symbol}</p>
                                </div>
                            </div>
                            <CountdownTimer project={project} />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-light-300 mb-2">
                                    Amount to Snipe
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="amount"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="0.00"
                                        className={`w-full p-3 rounded-lg bg-dark-400 border ${error ? 'border-error-500' : 'border-dark-200'
                                            } text-white placeholder-light-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        min="0"
                                        step="0.00000001"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-light-400">
                                        VIRTUAL
                                    </div>
                                </div>
                                {error && (
                                    <p className="mt-1 text-sm text-error-500">
                                        {error}
                                    </p>
                                )}
                                <p className="mt-1 text-sm text-light-400">
                                    Balance: {Number(virtualBalance).toLocaleString()} VIRTUAL
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isButtonDisabled}
                                className="w-full py-3 px-4 rounded-lg bg-primary-500 text-white font-medium 
                                    hover:bg-primary-600 transition-colors flex items-center justify-center 
                                    space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <>
                                        <Zap size={18} />
                                        <span>Confirm Snipe</span>
                                    </>
                                )}
                            </button>

                            <div className="bg-dark-400/50 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <Info size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-light-400">
                                        <p>Make sure you have enough VIRTUAL tokens in your wallet to complete the snipe.</p>
                                        <p className="mt-2">The snipe will be executed automatically when the token launches.</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            )}
            {notification && (
                <NotificationMessage
                    notification={notification}
                    onClose={() => setNotification(null)}
                />
            )}
        </AnimatePresence>
    );
};