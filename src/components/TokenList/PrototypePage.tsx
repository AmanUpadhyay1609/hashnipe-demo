import { useGenesis } from "../../context/GenesisContext";
import { TokenList } from "./TokenList";
import { BuySellForm } from "../BuySellForm";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TradeCharts } from "../TokenDetails/charts/TradeChart";
import { TradePanel } from "../TokenDetails/TradePanel";
import { PrototypeTokenList } from "./PrototypeList";

export const PrototypePage: React.FC = () => {
    const {
        prototypeData,
        fetchPrototype,
        prototypePagination,
        prototypeLoading,
        tradeData,
        setPrototypeToken,
        selectedPrototypeToken,
        fetchTradeData,
    } = useGenesis();
    const [currentPage, setCurrentPage] = useState(1);
    const [manualSelection, setManualSelection] = useState(false);

    // Handle initial data fetching and page changes
    useEffect(() => {
        const loadPageData = async () => {
            await fetchPrototype(currentPage);
        };
        loadPageData();
    }, [currentPage, fetchPrototype]);

    // Select first token when page changes or on initial load
    useEffect(() => {
        if (prototypeData && prototypeData.length > 0 && !manualSelection) {
            setPrototypeToken(prototypeData[0].id);
        }
    }, [prototypeData, setPrototypeToken]);

    // Handle token selection
    const handleTokenSelect = (tokenId: number) => {
        setManualSelection(true);
        setPrototypeToken(tokenId);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        setManualSelection(false); // Reset manual selection on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Use the selected token or default to first one
    const selectedProject = manualSelection
        ? prototypeData?.find(token => token.id === selectedPrototypeToken)
        : prototypeData?.[0];

    return (
        <div className="flex flex-col lg:flex-row gap-4 container mx-auto p-4">
            {/* Left side - Token List */}
            <div className="flex-1 space-y-4">
                {/* Header Section */}
                <div className="bg-dark-500 rounded-2xl border border-dark-300 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-semibold text-white">Prototype Tokens</h2>
                            <div className="px-2 py-1 rounded-full bg-dark-400 text-sm text-light-400">
                                {prototypePagination?.total || 0} tokens
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-light-400">
                            <span>Chain:</span>
                            <div className="px-2 py-1 rounded-full bg-dark-400 text-primary-400 flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                                <span>BASE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {prototypeLoading ? (
                        <div className="flex justify-center py-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                        </div>
                    ) : (
                        prototypeData.map((token) => (
                            <PrototypeTokenList
                                key={token.id}
                                token={token}
                                isSelected={token.id === selectedPrototypeToken}
                                onClick={() => handleTokenSelect(token.id)}
                            />
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {prototypePagination && (
                    <div className="flex justify-center items-center space-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-dark-400 text-light-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-300 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center space-x-2">
                            {[...Array(prototypePagination.pageCount)].map((_, idx) => {
                                const pageNumber = idx + 1;
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === prototypePagination.pageCount ||
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
                            disabled={currentPage === prototypePagination.pageCount}
                            className="p-2 rounded-lg bg-dark-400 text-light-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-300 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Right side - Trading Panel */}
            <div className="w-full lg:w-96 h-[calc(100vh-2rem)] sticky top-4">
                <div className="space-y-4 h-full overflow-y-auto scrollbar-thin scrollbar-track-dark-400 scrollbar-thumb-dark-300 pr-2">
                    {selectedProject && (
                        <>
                            <BuySellForm
                                project={{ virtual: selectedProject }}
                                isOpen={true}
                                onClose={() => { }}
                            />

                            {/* Trade Data Panel */}
                            {/* {tradeData && (
                                <>
                                    <TradePanel tradeData={tradeData} />
                                    <TradeCharts data={tradeData} />
                                </>
                            )} */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};