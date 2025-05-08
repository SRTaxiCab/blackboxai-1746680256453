import { create } from 'zustand';
import api from '../services/api';

interface TimelineEvent {
  date: string;
  type: string;
  title: string;
  description: string;
  impact: number;
}

interface ProbabilityData {
  category: string;
  timeframe: number;
  dates: string[];
  probabilities: number[];
  contributing_factors: Array<{
    name: string;
    impact: number;
    trend: string;
  }>;
  overall_probability: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
}

interface Narrative {
  id: string;
  title: string;
  summary: string;
  sentiment: number;
  coordinates: { x: number; y: number };
}

interface TemporalEvolution {
  date: string;
  size: number;
  sentiment: number;
}

interface NarrativeCluster {
  id: string;
  theme: string;
  size: number;
  center: { x: number; y: number };
  narratives: Narrative[];
  sentiment_score: number;
  growth_rate: number;
  temporal_evolution?: TemporalEvolution[];
}

interface ThemeTrend {
  date: string;
  strength: number;
}

interface Theme {
  name: string;
  trend_data: ThemeTrend[];
}

interface NarrativeTrends {
  timeframe: string;
  themes: Theme[];
}

interface GeospatialPoint {
  id: string;
  region: string;
  location: { lat: number; lng: number };
  category: string;
  intensity: number;
  timestamp: string;
  details: {
    title: string;
    description: string;
    impact_radius: number;
  };
}

interface AppState {
  // Timeline
  timelineEvents: TimelineEvent[];
  timelineSummary: any;
  fetchTimelineEvents: (params?: any) => Promise<void>;
  fetchTimelineSummary: () => Promise<void>;

  // Probability
  probabilityData: ProbabilityData | null;
  categories: string[];
  historicalData: any[];
  fetchProbabilityAnalysis: (category: string, timeframe?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchHistoricalData: (params: any) => Promise<void>;

  // Narratives
  narrativeClusters: NarrativeCluster[];
  narrativeTrends: NarrativeTrends | null;
  selectedCluster: NarrativeCluster | null;
  fetchNarrativeClusters: (params?: any) => Promise<void>;
  fetchNarrativeTrends: (timeframe?: string) => Promise<void>;
  fetchClusterDetails: (clusterId: string) => Promise<void>;

  // Geospatial
  geospatialPoints: GeospatialPoint[];
  heatmapData: any[];
  regions: any[];
  spatialClusters: any[];
  fetchGeospatialPoints: (params?: any) => Promise<void>;
  fetchHeatmapData: () => Promise<void>;
  fetchRegions: () => Promise<void>;
  fetchSpatialClusters: (params?: any) => Promise<void>;

  // Loading states
  isLoading: {
    timeline: boolean;
    probability: boolean;
    narratives: boolean;
    geospatial: boolean;
  };
  error: string | null;
}

const useStore = create<AppState>((set) => ({
  // Initial state
  timelineEvents: [],
  timelineSummary: null,
  probabilityData: null,
  categories: [],
  historicalData: [],
  narrativeClusters: [],
  narrativeTrends: null,
  selectedCluster: null,
  geospatialPoints: [],
  heatmapData: [],
  regions: [],
  spatialClusters: [],
  isLoading: {
    timeline: false,
    probability: false,
    narratives: false,
    geospatial: false,
  },
  error: null,

  // Timeline actions
  fetchTimelineEvents: async (params) => {
    set((state) => ({ isLoading: { ...state.isLoading, timeline: true } }));
    try {
      const events = await api.timeline.getEvents(params);
      set({ timelineEvents: events, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch timeline events' });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, timeline: false } }));
    }
  },

  fetchTimelineSummary: async () => {
    set((state) => ({ isLoading: { ...state.isLoading, timeline: true } }));
    try {
      const summary = await api.timeline.getSummary();
      set({ timelineSummary: summary, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch timeline summary' });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, timeline: false } }));
    }
  },

  // Probability actions
  fetchProbabilityAnalysis: async (category, timeframe) => {
    set((state) => ({ isLoading: { ...state.isLoading, probability: true } }));
    try {
      const data = await api.probability.analyze(category, timeframe);
      set({ probabilityData: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch probability analysis' });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, probability: false } }));
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await api.probability.getCategories();
      set({ categories, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch categories' });
    }
  },

  fetchHistoricalData: async (params) => {
    try {
      const data = await api.probability.getHistorical(params);
      set({ historicalData: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch historical data' });
    }
  },

  // Narratives actions
  fetchNarrativeClusters: async (params) => {
    set((state) => ({ isLoading: { ...state.isLoading, narratives: true } }));
    try {
      const clusters = await api.narratives.getClusters(params);
      set({ narrativeClusters: clusters, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch narrative clusters' });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, narratives: false } }));
    }
  },

  fetchNarrativeTrends: async (timeframe) => {
    try {
      const trends = await api.narratives.getTrends(timeframe);
      set({ narrativeTrends: trends, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch narrative trends' });
    }
  },

  fetchClusterDetails: async (clusterId) => {
    try {
      const cluster = await api.narratives.getClusterDetails(clusterId);
      set({ selectedCluster: cluster, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch cluster details' });
    }
  },

  // Geospatial actions
  fetchGeospatialPoints: async (params) => {
    set((state) => ({ isLoading: { ...state.isLoading, geospatial: true } }));
    try {
      const points = await api.geospatial.getPoints(params);
      set({ geospatialPoints: points, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch geospatial points' });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, geospatial: false } }));
    }
  },

  fetchHeatmapData: async () => {
    try {
      const data = await api.geospatial.getHeatmap();
      set({ heatmapData: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch heatmap data' });
    }
  },

  fetchRegions: async () => {
    try {
      const regions = await api.geospatial.getRegions();
      set({ regions, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch regions' });
    }
  },

  fetchSpatialClusters: async (params) => {
    try {
      const clusters = await api.geospatial.getClusters(params);
      set({ spatialClusters: clusters, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch spatial clusters' });
    }
  },
}));

export default useStore;
