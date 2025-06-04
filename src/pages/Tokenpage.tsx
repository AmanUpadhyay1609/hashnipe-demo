import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TokenListPage } from './TokenListPage';
import { TokenPage } from '../components/TokenList/TokenPage';
import { PrototypePage } from '../components/TokenList/PrototypePage';
import { useGenesis } from '../context/GenesisContext';
import { useAuth } from '../context/AuthContext';

interface TabData {
    id: string;
    label: string;
    content: React.ReactNode;
}

const tabs: TabData[] = [
    {
        id: 'Genesis launches',
        label: 'Genesis launches',
        content: <TokenListPage />
    },
    {
        id: 'Sentient Agents',
        label: 'Sentient Agents',
        content: <TokenPage />
    },
    {
        id: 'Prototype Agents',
        label: 'Prototype Agents',
        content: <PrototypePage />
    }
];

export default function Tokenpage() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
  
    return (
        <div className="min-h-screen bg-dark-500">
            <div className="container mx-auto py-6">
                {/* Tab Navigation */}
                <div className="flex border-b border-dark-300">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm font-medium transition-colors relative
                ${activeTab === tab.id
                                    ? 'text-primary-400'
                                    : 'text-light-400 hover:text-light-300'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                                    initial={false}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
                        >
                            {tab.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}