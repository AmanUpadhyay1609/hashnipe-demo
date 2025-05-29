import { FC } from 'react';

interface TradePanelData {
    data: {
        base_token_price_usd: string;
        quote_token_price_usd: string;
        fdv_usd: string;
        market_cap_usd: string | null;
        reserve_in_usd: string;
        price_change_percentage: {
            h24: string;
        };
        volume_usd: {
            h24: string;
        };
    };
}

export const TradePanel: FC<{ tradeData?: TradePanelData }> = ({ tradeData }) => {
    const formatValue = (value: string | null | undefined, prefix: string = '$', decimals: number = 2) => {
        if (!value) return '-';
        const num = Number(value);
        return isNaN(num) ? '-' : `${prefix}${num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}`;
    };

    const getPriceChangeColor = (change: string | undefined) => {
        if (!change) return 'text-light-400';
        const num = Number(change);
        return num > 0 ? 'text-success-400' : num < 0 ? 'text-error-400' : 'text-light-400';
    };

    return (
        <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4">
            <h3 className="text-white font-medium mb-3">Trading Statistics</h3>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-light-400">Token Price</span>
                    <span className="text-white">
                        {formatValue(tradeData?.data?.base_token_price_usd, '$', 6)}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-light-400">24h Change</span>
                    <span className={getPriceChangeColor(tradeData?.data?.price_change_percentage?.h24)}>
                        {tradeData?.data?.price_change_percentage?.h24
                            ? `${Number(tradeData.data.price_change_percentage.h24) > 0 ? '+' : ''}${tradeData.data.price_change_percentage.h24}%`
                            : '-'}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-light-400">24h Volume</span>
                    <span className="text-white">
                        {formatValue(tradeData?.data?.volume_usd?.h24)}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-light-400">Market Cap</span>
                    <span className="text-white">
                        {formatValue(tradeData?.data?.market_cap_usd || tradeData?.data?.fdv_usd)}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-light-400">Liquidity</span>
                    <span className="text-white">
                        {formatValue(tradeData?.data?.reserve_in_usd)}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-light-400">VIRTUAL Price</span>
                    <span className="text-white">
                        {formatValue(tradeData?.data?.quote_token_price_usd)}
                    </span>
                </div>
            </div>
        </div>
    );
};