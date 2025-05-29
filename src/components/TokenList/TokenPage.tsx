import { useGenesis } from "../../context/GenesisContext";
import { TokenList } from "./TokenList";
import { BuySellForm } from "../BuySellForm";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TradeCharts } from "../TokenDetails/charts/TradeChart";

export const TokenPage: React.FC = () => {
    const {
        sentients,
        fetchSentients,
        sentientPagination,
        sentientLoading,
        selectedToken,
        setSelectedToken,
        tradeData,
    } = useGenesis();
    const [currentPage, setCurrentPage] = useState(1);

    // Select first token by default
    useEffect(() => {
        if (sentients && sentients.length > 0 && !selectedToken) {
            handleTokenSelect(sentients[0].id);
        }
    }, [sentients]);

    useEffect(() => {
        fetchSentients(currentPage);
    }, [currentPage, fetchSentients]);

    const handleTokenSelect = (tokenId: number) => {
        setSelectedToken(tokenId);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const selectedProject = sentients?.find(s => s.id === selectedToken);

    return (
        <div className="flex flex-col lg:flex-row gap-4 container mx-auto p-4">
            {/* Left side - Token List */}
            <div className="flex-1 space-y-6">
                <div className="space-y-4">
                    {sentientLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                        </div>
                    ) : (
                        sentients.map((token) => (
                            <TokenList
                                key={token.id}
                                token={token}
                                isSelected={selectedToken === token.id}
                                trade={tradeData}
                                onClick={() => handleTokenSelect(token.id)}
                            />
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {sentientPagination && (
                    <div className="flex justify-center items-center space-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-dark-400 text-light-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-300 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center space-x-2">
                            {[...Array(sentientPagination.pageCount)].map((_, idx) => {
                                const pageNumber = idx + 1;
                                // Show first page, last page, current page, and pages around current
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === sentientPagination.pageCount ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${currentPage === pageNumber
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-dark-400 text-light-400 hover:bg-dark-300'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return <span key={pageNumber} className="text-light-400">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === sentientPagination.pageCount}
                            className="p-2 rounded-lg bg-dark-400 text-light-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-300 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Right side - Trading Panel */}
            <div className="w-full lg:w-96 space-y-4">
                {selectedProject && (
                    <>
                        <BuySellForm
                            project={{ virtual: selectedProject }}
                            isOpen={true}
                            onClose={() => { }}
                        />

                        {/* Trade Data Panel */}
                        {tradeData && (
                            <>
                                {console.log("MY trade data", tradeData)}
                                <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4">
                                    <h3 className="text-white font-medium mb-3">Trading Statistics</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-light-400">Market Cap</span>
                                            <span className="text-white">
                                                ${Number(tradeData.marketCap).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-light-400">24h Volume</span>
                                            <span className="text-white">
                                                ${Number(tradeData.volume24h).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-light-400">Liquidity</span>
                                            <span className="text-white">
                                                ${Number(tradeData.liquidityInUSD).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-light-400">Buy Price</span>
                                            <span className="text-success-400">
                                                ${Number(tradeData.buyPrice).toFixed(6)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-light-400">Sell Price</span>
                                            <span className="text-error-400">
                                                ${Number(tradeData.sellPrice).toFixed(6)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <TradeCharts data={tradeData} />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};