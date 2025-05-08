import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Timeline API
export const timelineApi = {
  getEvents: async (params?: { start_date?: string; end_date?: string; event_type?: string }) => {
    const response = await api.get('/timeline/events', { params });
    return response.data;
  },
  getSummary: async () => {
    const response = await api.get('/timeline/summary');
    return response.data;
  },
};

// Probability API
export const probabilityApi = {
  analyze: async (category: string, timeframe: number = 30) => {
    const response = await api.get('/probability/analyze', {
      params: { category, timeframe },
    });
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/probability/categories');
    return response.data;
  },
  getHistorical: async (params: { category: string; start_date?: string; end_date?: string }) => {
    const response = await api.get('/probability/historical', { params });
    return response.data;
  },
};

// Narratives API
export const narrativesApi = {
  getClusters: async (params?: { min_size?: number; max_clusters?: number }) => {
    const response = await api.get('/narratives/clusters', { params });
    return response.data;
  },
  getTrends: async (timeframe: string = '7d') => {
    const response = await api.get('/narratives/trends', {
      params: { timeframe },
    });
    return response.data;
  },
  getClusterDetails: async (clusterId: string) => {
    const response = await api.get(`/narratives/cluster/${clusterId}`);
    return response.data;
  },
};

// Geospatial API
export const geospatialApi = {
  getPoints: async (params?: {
    region?: string;
    category?: string;
    min_intensity?: number;
  }) => {
    const response = await api.get('/geospatial/points', { params });
    return response.data;
  },
  getHeatmap: async () => {
    const response = await api.get('/geospatial/heatmap');
    return response.data;
  },
  getRegions: async () => {
    const response = await api.get('/geospatial/regions');
    return response.data;
  },
  getClusters: async (params?: { min_points?: number; max_radius?: number }) => {
    const response = await api.get('/geospatial/clusters', { params });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

const apiService = {
  timeline: timelineApi,
  probability: probabilityApi,
  narratives: narrativesApi,
  geospatial: geospatialApi,
  healthCheck,
};

export default apiService;
