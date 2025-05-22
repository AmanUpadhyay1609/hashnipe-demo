import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

export interface TokenomicsRelease {
  id: number;
  type: string;
  duration: number | null;
  startsAt: string;
  bips: number;
  durationUnit: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tokenomics {
  id: number;
  bips: number;
  isLocked: boolean;
  releases: TokenomicsRelease[];
}

export interface Virtual {
  id: number;
  chain: string;
  name: string;
  symbol: string;
  tokenAddress: string | null;
  preToken: string | null;
  description: string;
  image: {
    url: string;
  };
  overview?: string;
  category?: string;
  status?: string;
  role?: string;
  tokenomics?: Tokenomics[];
}

export interface GenesisLaunch {
  id: number;
  startsAt: string;
  endsAt: string;
  status: string;
  genesisId: string;
  genesisTx: string;
  genesisAddress: string;
  result: any;
  processedParticipants: string;
  createdAt: string;
  updatedAt: string;
  allocationResult: any;
  virtual: Virtual;
  totalPoints: number;
  totalVirtuals: number;
  totalParticipants: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface GenesisResponse {
  data: GenesisLaunch[];
  meta: {
    pagination: Pagination;
  };
}

export type StatusFilter = 'all' | 'active' | 'ended' | 'upcoming' | 'top-snipe';

interface ApiErrorResponse {
  message: string;
}

interface GenesisContextType {
  genesisLaunches: GenesisLaunch[];
  loading: boolean;
  error: string | null;
  getProjectScore: (project: GenesisLaunch) => number;
  isRecommendedToSnipe: (project: GenesisLaunch) => boolean;
  isRecommendedToSubscribe: (project: GenesisLaunch) => boolean;
  currentFilter: StatusFilter;
  setCurrentFilter: (filter: StatusFilter) => void;
  pagination: Pagination | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchGenesisLaunches: (page?: number, filter?: StatusFilter) => Promise<void>;
  activeProjects: GenesisLaunch[];
  endedProjects: GenesisLaunch[];
  upcomingProjects: GenesisLaunch[];
  topSnipeProjects: GenesisLaunch[];
}

const GenesisContext = createContext<GenesisContextType | undefined>(undefined);

export const useGenesis = () => {
  const context = useContext(GenesisContext);
  if (context === undefined) {
    throw new Error('useGenesis must be used within a GenesisProvider');
  }
  return context;
};

interface GenesisProviderProps {
  children: ReactNode;
}

export const GenesisProvider: React.FC<GenesisProviderProps> = ({ children }) => {
  const [genesisLaunches, setGenesisLaunches] = useState<GenesisLaunch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<StatusFilter>('all');
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtered lists
  const [activeProjects, setActiveProjects] = useState<GenesisLaunch[]>([]);
  const [endedProjects, setEndedProjects] = useState<GenesisLaunch[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<GenesisLaunch[]>([]);
  const [topSnipeProjects, setTopSnipeProjects] = useState<GenesisLaunch[]>([]);

  const baseUrl = 'https://api.virtuals.io/api/geneses';

  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to fetch genesis launches');
    } else {
      setError('An unexpected error occurred');
    }
    setLoading(false);
    console.error('Error:', error);
  };

  const fetchGenesisLaunches = useCallback(async (page: number = 1, filter: StatusFilter = currentFilter) => {
    setLoading(true);
    setError(null);

    try {
      let url = `${baseUrl}?pagination[page]=${page}&pagination[pageSize]=12&filters[virtual][priority][$ne]=-1`;

      // Build query based on filter
      if (filter === 'active') {
        url += '&filters[status][$in][0]=STARTED&sort=startsAt:asc';
      } else if (filter === 'ended') {
        url += '&filters[status][$in][0]=FAILED&filters[status][$in][1]=FINALIZED&sort=updatedAt:desc';
      } else if (filter === 'upcoming') {
        url += '&filters[status][$in][0]=INITIALIZED&sort=startsAt:asc';
      } else if (filter === 'all') {
        url += '&sort=updatedAt:desc';
      }

      const response = await axios.get<GenesisResponse>(url);
      setGenesisLaunches(response.data.data);
      setPagination(response.data.meta.pagination);
      setCurrentFilter(filter);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [currentFilter]);

  const fetchAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [activeResponse, endedResponse, upcomingResponse] = await Promise.all([
        axios.get<GenesisResponse>(
          `${baseUrl}?pagination[page]=1&pagination[pageSize]=6&filters[virtual][priority][$ne]=-1&filters[status][$in][0]=STARTED&sort=startsAt:asc`
        ),
        axios.get<GenesisResponse>(
          `${baseUrl}?pagination[page]=1&pagination[pageSize]=6&filters[virtual][priority][$ne]=-1&filters[status][$in][0]=FAILED&filters[status][$in][1]=FINALIZED&sort=updatedAt:desc`
        ),
        axios.get<GenesisResponse>(
          `${baseUrl}?pagination[page]=1&pagination[pageSize]=6&filters[virtual][priority][$ne]=-1&filters[status][$in][0]=INITIALIZED&sort=startsAt:asc`
        )
      ]);

      setActiveProjects(activeResponse.data.data);
      setEndedProjects(endedResponse.data.data);
      setUpcomingProjects(upcomingResponse.data.data);
      setGenesisLaunches(activeResponse.data.data);
      setPagination(activeResponse.data.meta.pagination);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   fetchAllCategories();
  //   const interval = setInterval(fetchAllCategories, 30000);
  //   return () => clearInterval(interval);
  // }, [fetchAllCategories]);

  // Calculate top snipe picks whenever active projects update
  useEffect(() => {
    // Top snipe picks - projects with highest score
    const topPicks = [...activeProjects]
      .sort((a, b) => {
        const scoreA = getProjectScore(a);
        const scoreB = getProjectScore(b);
        return scoreB - scoreA;
      }).slice(0, 6);

    setTopSnipeProjects(topPicks);
  }, [activeProjects]);

  const getProjectScore = (project: GenesisLaunch): number => {
    let score = 0;

    // Factor 1: Participant engagement (0-30 points)
    const participantScore = Math.min(project.totalParticipants / 10, 30);
    score += participantScore;

    // Factor 2: Funding progress (0-30 points)
    const fundingProgress = (project.totalVirtuals / 112000) * 100;
    const fundingScore = Math.min(fundingProgress / 3.33, 30);
    score += fundingScore;

    // Factor 3: Point commitment (0-20 points)
    const avgPointsPerParticipant = project.totalParticipants > 0
      ? project.totalPoints / project.totalParticipants
      : 0;
    const pointScore = Math.min(avgPointsPerParticipant / 100, 20);
    score += pointScore;

    // Factor 4: Time remaining factor (0-20 points)
    const now = new Date();
    const endsAt = new Date(project.endsAt);
    const hoursRemaining = Math.max(0, (endsAt.getTime() - now.getTime()) / (1000 * 60 * 60));

    let timeScore = 0;
    if (hoursRemaining >= 12 && hoursRemaining <= 24) {
      timeScore = 20;
    } else if (hoursRemaining < 12) {
      timeScore = (hoursRemaining / 12) * 20;
    } else {
      timeScore = Math.max(0, 20 - ((hoursRemaining - 24) / 12) * 10);
    }
    score += timeScore;

    return Math.round(score);
  };

  const isRecommendedToSnipe = (project: GenesisLaunch): boolean => {
    const score = getProjectScore(project);
    return score >= 70;
  };

  const isRecommendedToSubscribe = (project: GenesisLaunch): boolean => {
    const score = getProjectScore(project);
    return score >= 50 && score < 70;
  };

  return (
    <GenesisContext.Provider
      value={{
        genesisLaunches,
        loading,
        error,
        getProjectScore,
        isRecommendedToSnipe,
        isRecommendedToSubscribe,
        currentFilter,
        setCurrentFilter,
        pagination,
        currentPage,
        setCurrentPage,
        fetchGenesisLaunches,
        activeProjects,
        endedProjects,
        upcomingProjects,
        topSnipeProjects
      }}
    >
      {children}
    </GenesisContext.Provider>
  );
};