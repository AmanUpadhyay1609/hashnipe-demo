import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TimeData {
    buys: number;
    sells: number;
    buyers: number;
    sellers: number;
}

interface TradeData {
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

export const TradeCharts: React.FC<{ data: TradeData }> = ({ data }) => {
    console.log("Trade transaction", data)
    const transactionData = Object.entries(data?.transactions || {}).map(([time, stats]) => ({
        name: formatTimeLabel(time),
        buys: stats.buys,
        sells: stats.sells,
        buyers: stats.buyers,
        sellers: stats.sellers,
    }));

    const volumeData = Object.entries(data?.volume_usd || {}).map(([time, volume]) => ({
        name: formatTimeLabel(time),
        volume: parseFloat(volume),
    }));


    return (
        <div className="space-y-6">
            {/* Volume Chart */}
            <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4">
                <h3 className="text-white font-medium mb-4">Trading Volume</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData}>
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                            />
                            <Bar
                                dataKey="volume"
                                fill="#0ea5e9"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transactions Chart */}
            <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4">
                <h3 className="text-white font-medium mb-4">Transactions</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={transactionData}>
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="buys"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="sells"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};