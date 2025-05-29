import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useMemo } from 'react';

export const CHART_THEME = {
    colors: {
        buy: '#10b981',
        sell: '#ef4444',
        volume: '#0ea5e9',
        grid: '#374151',
        axis: '#9ca3af',
    },
    fonts: {
        size: 12,
    },
};

interface TimeData {
    buys: number;
    sells: number;
    buyers: number;
    sellers: number;
}

interface TradeData {
    data: {
        transactions: {
            m5: TimeData;
            m15: TimeData;
            m30: TimeData;
            h1: TimeData;
            h6: TimeData;
            h24: TimeData;
        };
        volume_usd: {
            m5: string;
            m15: string;
            m30: string;
            h1: string;
            h6: string;
            h24: string;
        };
        // Add other properties from your API response if needed
    };
}

const formatTimeLabel = (time: string) => {
    switch (time) {
        case 'm5': return '5m';
        case 'm15': return '15m';
        case 'm30': return '30m';
        case 'h1': return '1h';
        case 'h6': return '6h';
        case 'h24': return '24h';
        default: return time;
    }
};

export const TradeCharts: React.FC<{ data?: TradeData }> = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload) return null;

        return (
            <div className="bg-dark-400 border border-dark-300 rounded-lg p-3 shadow-lg">
                <p className="text-light-400 text-sm font-medium mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-light-400">{entry.name}:</span>
                        <span className="text-white font-medium">
                            {entry.name === 'Volume'
                                ? `$${Number(entry.value).toLocaleString()}`
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const chartData = useMemo(() => {
        if (!data?.data) return { transactionData: [], volumeData: [] };

        const { transactions, volume_usd } = data.data;

        return {
            transactionData: Object.entries(transactions || {})
                .map(([time, stats]) => ({
                    name: formatTimeLabel(time),
                    Buys: stats?.buys || 0,
                    Sells: stats?.sells || 0,
                    "Active Buyers": stats?.buyers || 0,
                    "Active Sellers": stats?.sellers || 0,
                }))
                .reverse(), // Show oldest data first
            volumeData: Object.entries(volume_usd || {})
                .map(([time, volume]) => ({
                    name: formatTimeLabel(time),
                    Volume: parseFloat(volume) || 0,
                }))
                .reverse(),
        };
    }, [data]);

    // Handle case when data is not loaded yet
    if (!data?.data) {
        return (
            <div className="space-y-6">
                <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4 h-80 animate-pulse" />
                <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4 h-80 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Volume Chart */}
            <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Trading Volume</h3>
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-light-400">24h Volume:</span>
                        <span className="text-white font-medium">
                            ${Number(data.data.volume_usd.h24).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.volumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="Volume"
                                fill="#0ea5e9"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transactions Chart */}
            <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Trading Activity</h3>
                    <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-success-400" />
                            <span className="text-light-400">Buys</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-error-400" />
                            <span className="text-light-400">Sells</span>
                        </div>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData.transactionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="Buys"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Sells"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};