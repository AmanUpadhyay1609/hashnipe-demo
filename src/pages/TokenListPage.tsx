import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGenesis, GenesisLaunch, StatusFilter } from '../context/GenesisContext';
import { Zap, Clock, ArrowRight, ChevronRight, ChevronLeft, DollarSign } from 'lucide-react';
// import { useWallet } from '../context/WalletContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { SnipeForm } from '../components/SnipeForm';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { TooltipProps } from 'recharts';
import { BuySellForm } from '../components/BuySellForm';

// Helper for pie chart colors
const PIE_COLORS = [
  '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#a78bfa', '#f472b6', '#34d399', '#f87171', '#38bdf8', '#fbbf24', '#6366f1', '#eab308'
];

// Tokenomics PieChart component
const TokenomicsPieChart = ({ tokenomics }) => {
  // Each tokenomics item is a slice, label by id or type
  const data = tokenomics.map((t) => ({
    name: t.releases[0]?.type || `#${t.id}`,
    value: t.bips,
    isLocked: t.isLocked,
    release: t.releases[0],
    id: t.id
  }));
  return (
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
          <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

const tokenomicsCache = {};
const TokenomicsPieChartPopup = ({ virtualId, tokenName, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenomics = useCallback(async () => {
    if (tokenomicsCache[virtualId]) {
      setData(tokenomicsCache[virtualId]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.virtuals.io/api/virtuals/${virtualId}/tokenomics`);
      if (!res.ok) throw new Error('Failed to fetch tokenomics');
      const json = await res.json();
      tokenomicsCache[virtualId] = json.data;
      setData(json.data);
    } catch {
      setError('Failed to load tokenomics');
    } finally {
      setLoading(false);
    }
  }, [virtualId]);

  useEffect(() => {
    fetchTokenomics();
  }, [fetchTokenomics]);

  // Prepare data for recharts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData = (data || []).map((t: any) => ({
    name: t.name,
    value: Number(t.bips),
    isLocked: t.isLocked,
    description: t.description,
    id: t.id
  }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  // Custom tooltip for recharts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = (props: TooltipProps<any, any>) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
          <div className="font-bold mb-1">{d.name}{d.isLocked && ' 🔒'}</div>
          <div>{d.description}</div>
          <div className="mt-1 text-primary-400 font-semibold">{((d.value / total) * 100).toFixed(1)}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-10 cursor-pointer"
        onClick={onClose}
      />
      {/* Chart Popup */}
      <div
        className="relative bg-dark-400 border border-dark-200 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center min-w-[380px] min-h-[380px]"
        onMouseLeave={onClose}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-lg font-bold text-white mb-4">{tokenName}</div>
        {loading ? (
          <div className="flex items-center justify-center w-[360px] h-[360px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-error-500 p-4">{error}</div>
        ) : (
          <PieChart width={360} height={360}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={160}
              innerRadius={80}
              paddingAngle={2}
              stroke="#22223b"
              strokeWidth={2}
            >
              {chartData.map((_, idx) => (
                <Cell key={`cell-popup-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
        )}
      </div>
    </div>
  );
};

export const TokenListPage: React.FC = () => {
  const {
    genesisLaunches,
    loading,
    error,
    getProjectScore,
    currentFilter,
    setCurrentFilter,
    pagination,
    currentPage,
    setCurrentPage,
    fetchGenesisLaunches
  } = useGenesis();

  // const { address, connect, isConnecting } = useWallet();

  const [selectedProject, setSelectedProject] = useState<GenesisLaunch | null>();
  const [isSnipeFormOpen, setIsSnipeFormOpen] = useState(false);
  const [showTokenomicsPopupIdx, setShowTokenomicsPopupIdx] = useState<number | null>(null);
  const tokenomicsAnchorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tokenomicsHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [searchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('score');
  const [selectedTradeProject, setSelectedTradeProject] = useState<GenesisLaunch | null>(null);
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Tokens' },
    { value: 'active', label: 'Active' },
    { value: 'ended', label: 'Ended' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'top-snipe', label: 'Top Snipe' }
  ];

  // Fetch data when page changes
  useEffect(() => {
    fetchGenesisLaunches(currentPage, currentFilter);
  }, [currentPage, currentFilter]);

  // Filter projects based on search term
  const filteredProjects = genesisLaunches.filter(project => {
    return (
      project.virtual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.virtual.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.virtual.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort projects based on sort option
  const sortedProjects = [...filteredProjects]
    .sort((a, b) => {
      if (sortOption === 'score') {
        return getProjectScore(b) - getProjectScore(a);
      } else if (sortOption === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === 'ending') {
        return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
      } else if (sortOption === 'participants') {
        return b.totalParticipants - a.totalParticipants;
      }
      return 0;
    });

  // Set initial project when data is loaded
  useEffect(() => {
    if (sortedProjects.length > 0 && !selectedProject && !selectedTradeProject) {
      const initialProject = sortedProjects[0];
      const isEnded = initialProject.status === 'FINALIZED' || initialProject.status === 'FAILED';
      if (isEnded) {
        setSelectedTradeProject(initialProject);
        setIsTradeFormOpen(true);
        setIsSnipeFormOpen(false);
      } else {
        setSelectedProject(initialProject);
        setIsSnipeFormOpen(true);
        setIsTradeFormOpen(false);
      }
    }
  }, [sortedProjects, selectedProject, selectedTradeProject]);

  // Update form when filter changes
  useEffect(() => {
    if (sortedProjects.length > 0) {
      const firstProject = sortedProjects[0];
      const isEnded = firstProject.status === 'FINALIZED' || firstProject.status === 'FAILED';
      if (isEnded) {
        setSelectedTradeProject(firstProject);
        setIsTradeFormOpen(true);
        setSelectedProject(null);
        setIsSnipeFormOpen(false);
      } else {
        setSelectedProject(firstProject);
        setIsSnipeFormOpen(true);
        setSelectedTradeProject(null);
        setIsTradeFormOpen(false);
      }
    }
  }, [currentFilter, sortedProjects]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'STARTED':
        return <div className="flex items-center space-x-1.5">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-success-400"></div>
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-success-400 animate-ping opacity-75"></div>
          </div>
          <span className="text-xs font-medium text-success-400">Live</span>
        </div>;
      case 'INITIALIZED':
        return <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-warning-400"></div>
          <span className="text-xs font-medium text-warning-400">Upcoming</span>
        </div>;
      case 'FINALIZED':
        return <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-primary-400"></div>
          <span className="text-xs font-medium text-primary-400">Ended</span>
        </div>;
      case 'FAILED':
        return <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-error-400"></div>
          <span className="text-xs font-medium text-error-400">Failed</span>
        </div>;
      default:
        return <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-light-400"></div>
          <span className="text-xs font-medium text-light-400">Unknown</span>
        </div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'STARTED':
        return 'bg-success-500/10 border-success-500/20';
      case 'INITIALIZED':
        return 'bg-warning-500/10 border-warning-500/20';
      case 'FINALIZED':
        return 'bg-primary-500/10 border-primary-500/20';
      case 'FAILED':
        return 'bg-error-500/10 border-error-500/20';
      default:
        return 'bg-light-500/10 border-light-500/20';
    }
  };

  const handleSnipe = async (project: GenesisLaunch) => {
    // Always set the new project and open the snipe form
    setSelectedProject(project);
    setIsSnipeFormOpen(true);
    // Close the trade form if it's open
    setSelectedTradeProject(null);
    setIsTradeFormOpen(false);
  };

  const handleSnipeSubmit = async (amount: number) => {
    if (selectedProject) {
      // Implement actual snipe functionality here
      console.log('Sniping project:', selectedProject.virtual.name, 'Amount:', amount);
      // You would typically call your snipe function here
    }
  };

  const handleTrade = async (project: GenesisLaunch) => {
    // Always set the new project and open the trade form
    setSelectedTradeProject(project);
    setIsTradeFormOpen(true);
    // Close the snipe form if it's open
    setSelectedProject(null);
    setIsSnipeFormOpen(false);
  };

  const handleSubscribe = async (project: GenesisLaunch) => {
    console.log("Subscribe", project.virtual.name);
  };

  const handleTradeClose = () => {
    setIsTradeFormOpen(false);
    setSelectedTradeProject(null);
  };

  return (
    <div className="min-h-screen py-4">
      <div className="container mx-auto px-1">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Token List Section */}
          <div className="flex-1">
            {/* Combined Filter and Sort Controls */}
            <div className="flex flex-row flex-wrap gap-2 mb-2 items-center justify-between w-full">
              <div className="flex flex-row flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setCurrentFilter(option.value as StatusFilter);
                      setCurrentPage(1);
                      setSelectedProject(null);
                      setSelectedTradeProject(null);
                      setIsSnipeFormOpen(false);
                      setIsTradeFormOpen(false);
                    }}
                    className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200
                      ${currentFilter === option.value
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-dark-400 text-light-300 hover:bg-dark-300 border border-dark-200'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="relative w-48 min-w-[180px]">
                <select
                  className="w-full p-2 rounded-lg bg-dark-400 border border-dark-200 text-light-300 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="score">Highest Score</option>
                  <option value="recent">Most Recent</option>
                  <option value="ending">Ending Soon</option>
                  <option value="participants">Most Participants</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-light-500" />
                </div>
              </div>
            </div>

            {/* Token List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-error-500 p-8 bg-error-500/10 rounded-xl">
                {error}
              </div>
            ) : (
              <div className="bg-dark-500 rounded-2xl overflow-x-auto overflow-y-hidden border border-dark-300">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-9 gap-2 p-3 bg-dark-400 text-light-300 font-medium text-sm border-b border-dark-300 items-center">
                  <div className="col-span-3">Token</div>
                  <div className="col-span-1 text-center">Score</div>
                  <div className="col-span-1 text-center">Participants</div>
                  <div className="col-span-1 text-center">Total VIRTUAL</div>
                  <div className="col-span-1 text-center">Tokenomics</div>
                  <div className="col-span-1 text-right">Time</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Mobile Header (Only shown on mobile) */}
                <div className="md:hidden p-4 bg-dark-400 text-light-300 font-medium text-sm border-b border-dark-300">
                  Tokens ({sortedProjects.length})
                </div>

                {/* Table Body */}
                <div className="divide-y divide-dark-300 bg-transparent">
                  {sortedProjects.length === 0 ? (
                    <div className="p-6 text-center text-light-400">
                      No tokens found matching your criteria
                    </div>
                  ) : (
                    sortedProjects.map((project) => {
                      const score = getProjectScore(project);
                      const endDate = new Date(project.endsAt);
                      const timeRemaining = formatDistanceToNow(endDate, { addSuffix: true });
                      const isActive = project.status === 'STARTED';
                      const isUpcoming = project.status === 'INITIALIZED';
                      const isEnded = project.status === 'FINALIZED' || project.status === 'FAILED';

                      return (
                        <div
                          key={project.id}
                          className="p-4 hover:bg-dark-400/40 transition-colors"
                        >
                          {/* Desktop View */}
                          <div className="hidden md:grid grid-cols-9 gap-2 items-center">
                            {/* Token */}
                            <div className="col-span-3 flex items-center space-x-3">
                              <Link to={`/tokens/${project.id}`} className="w-10 h-10 rounded-full overflow-hidden bg-dark-300 flex-shrink-0 ring-2 ring-dark-200 hover:ring-primary-500 transition-all">
                                {project.virtual.image ? (
                                  <img
                                    src={project.virtual.image.url}
                                    alt={project.virtual.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-dark-400 text-light-400">
                                    {project.virtual.symbol.charAt(0)}
                                  </div>
                                )}
                              </Link>
                              <div className="flex flex-col">
                                <Link to={`/tokens/${project.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                                  {project.virtual.name}
                                </Link>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-primary-400">${project.virtual.symbol}</span>
                                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                    {getStatusIcon(project.status)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Score */}
                            <div className="col-span-1 text-center">
                              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${score >= 70
                                ? 'text-success-400 bg-success-500/10 border border-success-500/30'
                                : score >= 50
                                  ? 'text-warning-400 bg-warning-500/10 border border-warning-500/30'
                                  : 'text-light-400 bg-light-500/10 border border-light-500/30'
                                }`}>
                                {score}
                              </div>
                            </div>

                            {/* Participants */}
                            <div className="col-span-1 text-center text-light-300">
                              {project.totalParticipants.toLocaleString()}
                            </div>

                            {/* Total VIRTUAL */}
                            <div className="col-span-1 text-center text-light-300">
                              {project.totalVirtuals.toLocaleString()}
                            </div>

                            {/* Tokenomics */}
                            <div
                              className="col-span-1 flex justify-center items-center relative min-w-[48px] h-8"
                              ref={el => tokenomicsAnchorRefs.current[sortedProjects.indexOf(project)] = el}
                              onMouseEnter={() => {
                                if (tokenomicsHoverTimeout.current) clearTimeout(tokenomicsHoverTimeout.current);
                                tokenomicsHoverTimeout.current = setTimeout(() => {
                                  setShowTokenomicsPopupIdx(sortedProjects.indexOf(project));
                                }, 1000);
                              }}
                              onMouseLeave={() => {
                                if (tokenomicsHoverTimeout.current) clearTimeout(tokenomicsHoverTimeout.current);
                                setShowTokenomicsPopupIdx(null);
                              }}
                              style={{ minWidth: 48, height: 32 }}
                            >
                              <TokenomicsPieChart tokenomics={project.virtual.tokenomics ?? []} />
                              {showTokenomicsPopupIdx === sortedProjects.indexOf(project) && (
                                <TokenomicsPieChartPopup
                                  virtualId={project.virtual.id}
                                  tokenName={project.virtual.name}
                                  onClose={() => setShowTokenomicsPopupIdx(null)}
                                />
                              )}
                            </div>

                            {/* Time Remaining */}
                            <div className="col-span-1 text-right text-light-300">
                              {isEnded ? 'Ended' : timeRemaining}
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 flex justify-end items-center space-x-1">
                              {isActive && (
                                <>
                                  <button
                                    onClick={() => handleSnipe(project)}
                                    className="p-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                    title="Snipe at launch"
                                  >
                                    <Zap size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleSubscribe(project)}
                                    className="p-1.5 rounded-full bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
                                    title="Subscribe"
                                  >
                                    <Clock size={16} />
                                  </button>
                                </>
                              )}
                              {isUpcoming && (
                                <>
                                  <button
                                    onClick={() => handleSnipe(project)}
                                    className="p-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                    title="Snipe at launch"
                                  >
                                    <Zap size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleSubscribe(project)}
                                    className="p-1.5 rounded-full bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
                                    title="Subscribe"
                                  >
                                    <Clock size={16} />
                                  </button>
                                </>
                              )}
                              {project.status === 'FINALIZED' && (
                                <button
                                  onClick={() => handleTrade(project)}
                                  className="p-1.5 rounded-full bg-success-500 text-white hover:bg-success-600 transition-colors"
                                  title="Trade on Base"
                                >
                                  <DollarSign size={16} />
                                </button>
                              )}
                              <Link
                                to={`/tokens/${project.id}`}
                                className="p-1.5 rounded-full bg-dark-300 text-light-300 hover:bg-dark-200 transition-colors"
                                title="View details"
                              >
                                <ArrowRight size={16} />
                              </Link>
                            </div>
                          </div>

                          {/* Mobile View */}
                          <div className="md:hidden">
                            <div className="flex items-center justify-between mb-3">
                              <Link to={`/tokens/${project.id}`} className="flex items-center space-x-3">
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
                                  <div className="font-medium text-white">{project.virtual.name}</div>
                                  <div className="text-xs text-primary-400">${project.virtual.symbol}</div>
                                </div>
                              </Link>

                              <div className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                                {getStatusIcon(project.status)}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-dark-400/60 rounded-lg p-2 text-center">
                                <div className="text-sm font-bold text-white">{project.totalParticipants}</div>
                                <div className="text-xs text-light-500">Users</div>
                              </div>
                              <div className="bg-dark-400/60 rounded-lg p-2 text-center">
                                <div className="text-sm font-bold text-white">{project.totalVirtuals.toLocaleString()}</div>
                                <div className="text-xs text-light-500">Virtuals</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${score >= 70
                                  ? 'text-success-400 bg-success-500/10 border border-success-500/30'
                                  : score >= 50
                                    ? 'text-warning-400 bg-warning-500/10 border border-warning-500/30'
                                    : 'text-light-400 bg-light-500/10 border border-light-500/30'
                                  }`}>
                                  {score}
                                </div>
                                <div className="text-xs text-light-400">
                                  {isEnded ? 'Ended' : timeRemaining}
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                {isActive && (
                                  <>
                                    <button
                                      onClick={() => handleSnipe(project)}
                                      className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                      title="Snipe at launch"
                                    >
                                      <Zap size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleSubscribe(project)}
                                      className="p-2 rounded-full bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
                                      title="Subscribe"
                                    >
                                      <Clock size={16} />
                                    </button>
                                  </>
                                )}
                                {isUpcoming && (
                                  <>
                                    <button
                                      onClick={() => handleSnipe(project)}
                                      className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                      title="Snipe at launch"
                                    >
                                      <Zap size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleSubscribe(project)}
                                      className="p-2 rounded-full bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
                                      title="Subscribe"
                                    >
                                      <Clock size={16} />
                                    </button>
                                  </>
                                )}
                                {project.status === 'FINALIZED' && (
                                  <button
                                    onClick={() => handleTrade(project)}
                                    className="p-2 rounded-full bg-success-500 text-white hover:bg-success-600 transition-colors"
                                    title="Trade on Base"
                                  >
                                    <DollarSign size={16} />
                                  </button>
                                )}
                                <Link
                                  to={`/tokens/${project.id}`}
                                  className="p-2 rounded-full bg-dark-300 text-light-300 hover:bg-dark-200 transition-colors"
                                  title="View details"
                                >
                                  <ArrowRight size={16} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pageCount && pagination.pageCount > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm">
                  <button
                    className="px-3 py-2 rounded-l-md border border-dark-200 bg-dark-400 text-light-300 hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {pagination && Array.from({ length: Math.min(pagination.pageCount, 5) }).map((_, index) => {
                    let pageNumber = currentPage - 2 + index;
                    if (currentPage < 3) {
                      pageNumber = index + 1;
                    } else if (currentPage > (pagination.pageCount ?? 0) - 2) {
                      pageNumber = (pagination.pageCount ?? 0) - 4 + index;
                    }
                    if (pageNumber > 0 && pageNumber <= (pagination.pageCount ?? 0)) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-4 py-2 border border-dark-200 ${currentPage === pageNumber
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-400 text-light-300 hover:bg-dark-300'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button
                    className="px-3 py-2 rounded-r-md border border-dark-200 bg-dark-400 text-light-300 hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, pagination?.pageCount ?? 1))}
                    disabled={currentPage === (pagination?.pageCount ?? 1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            )}
          </div>

          {selectedProject && (
            <div className="w-full lg:w-96 lg:sticky lg:top-6 self-start">
              <SnipeForm
                project={selectedProject}
                isOpen={isSnipeFormOpen}
                onClose={() => { }}
                onSnipe={handleSnipeSubmit}
              />
            </div>
          )}

          {selectedTradeProject && (
            <div className="w-full lg:w-96 lg:sticky lg:top-6 self-start">
              <BuySellForm
                project={selectedTradeProject}
                isOpen={isTradeFormOpen}
                onClose={() => { }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component remains unchanged
const ChevronDown = ({ size, className }: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);