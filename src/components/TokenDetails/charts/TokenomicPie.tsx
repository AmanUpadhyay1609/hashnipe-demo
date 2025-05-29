import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = [
    '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#a78bfa',
    '#f472b6', '#34d399', '#f87171', '#38bdf8', '#fbbf24',
    '#6366f1', '#eab308'
];

interface TokenomicsData {
    id: number;
    amount: string;
    name: string;
    isLocked: boolean;
    releases: Array<{
        id: number;
        type: string;
        bips: number;
        startsAt: string;
    }>;
}

export const TokenomicsPieChart: React.FC<{ tokenomics: TokenomicsData[] }> = ({ tokenomics }) => {
    const data = tokenomics.map((t) => ({
        name: t.name,
        value: Number(t.amount),
        isLocked: t.isLocked,
        release: t.releases[0],
        id: t.id
    }));

    return (
        <div className="relative flex items-center justify-center h-full">
            <PieChart width={32} height={32}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={16}
                    innerRadius={8}
                    paddingAngle={2}
                    stroke="#22223b"
                    strokeWidth={1}
                >
                    {data.map((entry, idx) => (
                        <Cell
                            key={`cell-${entry.id}`}
                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
};