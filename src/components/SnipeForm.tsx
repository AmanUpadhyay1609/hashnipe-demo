import React, { useState, useEffect } from 'react';
import { X, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenesisLaunch } from '../context/GenesisContext';
import { differenceInSeconds, format } from 'date-fns';

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
    onClose: () => void;
    onSnipe: (amount: number) => void;
    className?: string;
}

export const SnipeForm: React.FC<SnipeFormProps> = ({ project, isOpen, onClose, onSnipe, className }) => {
    const [amount, setAmount] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            onSnipe(numAmount);
            onClose();
        }
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
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full p-3 rounded-lg bg-dark-400 border border-dark-200 text-white placeholder-light-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-light-400">
                                        VIRTUAL
                                    </div>
                                </div>
                            </div>

                            <div className="bg-dark-400/50 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <Info size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-light-400">
                                        <p>Make sure you have enough VIRTUAL tokens in your wallet to complete the snipe.</p>
                                        <p className="mt-2">The snipe will be executed automatically when the token launches.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Zap size={18} />
                                <span>Confirm Snipe</span>
                            </button>
                        </form>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};