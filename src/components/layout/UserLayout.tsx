import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    List,
    Settings,
    BarChart2,
    Wallet,
    Search,
    Bell,
    ChevronLeft,
    User,
    LogOut,
    Hash,
    Check,
    Copy
} from 'lucide-react';
import { shortenAddress } from './Header';

interface UserLayoutProps {
    children: ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { decodedToken, logout } = useAuth();
    const location = useLocation();
    const [copied, setCopied] = useState(false);

    const username = decodedToken?.walletAddress || 'User';
    console.log("walletAddress", decodedToken)

    const handleCopyUsername = async () => {
        try {
            await navigator.clipboard.writeText(username);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/tokens', icon: List, label: 'Tokens' },
        { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
        { path: '/analytics', icon: BarChart2, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-dark-500 text-xs">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 200 }}
                animate={{ width: isSidebarCollapsed ? 80 : 240 }}
                className="bg-dark-400 border-r border-dark-100 relative"
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        {!isSidebarCollapsed && (<>
                            <Hash size={28} className="text-primary-400" />
                            <div className="flex flex-col">
                                <span className="text-base font-medium">
                                    <span className="text-primary-400">Ha</span>
                                    <span className="text-white">Shnipe</span>
                                </span>
                            </div>
                        </>

                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-dark-300 transition-colors"
                        >
                            {isSidebarCollapsed ? (
                                <Hash size={28} className="text-primary-400" />
                            ) : (
                                <ChevronLeft size={20} className="text-light-400" />
                            )}
                        </button>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-4 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-500 text-white'
                                        : 'text-light-400 hover:bg-dark-300 hover:text-white'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {!isSidebarCollapsed && <span className="text-xs font-normal">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-dark-100">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-light-400 hover:bg-dark-300 hover:text-white transition-colors w-full"
                    >
                        <LogOut size={20} />
                        {!isSidebarCollapsed && <span className="text-xs font-normal">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-dark-400 border-b border-dark-100 px-6 flex items-center justify-between">
                    <div className="flex-1 max-w-2xl">
                        <div className={`relative ${isSearchFocused ? 'ring-2 ring-primary-500' : ''}`}>
                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-400"
                            />
                            <input
                                type="text"
                                placeholder="Search tokens, addresses, or transactions..."
                                className="w-full bg-dark-300 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-6">
                        <button className="p-2 rounded-lg hover:bg-dark-300 transition-colors relative">
                            <Bell size={20} className="text-light-400" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500"></span>
                        </button>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleCopyUsername}
                                className="flex items-center space-x-2 bg-dark-300 px-3 py-1 rounded-lg hover:bg-dark-200 transition-colors group"
                            >
                                <User size={16} className="text-light-400" />
                                <span className="text-light-300 text-xs font-normal">{shortenAddress(username)}</span>
                                {copied ? (
                                    <Check size={14} className="text-success-400" />
                                ) : (
                                    <Copy size={14} className="text-light-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="h-12 bg-dark-400 border-t border-dark-100 px-6 flex items-center justify-between">
                    <span className="text-light-500 text-xs">© 2024 Hashnipe. All rights reserved.</span>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-light-500 hover:text-primary-400 text-xs transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-light-500 hover:text-primary-400 text-xs transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};
