import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store';
import { ForceGraph2D } from 'react-force-graph';

interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    val: number;
    color: string;
    theme?: string;
    sentiment?: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
  }>;
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

const NarrativeClusters: React.FC = () => {
  const {
    narrativeClusters,
    narrativeTrends,
    selectedCluster,
    fetchNarrativeClusters,
    fetchNarrativeTrends,
    fetchClusterDetails,
    isLoading,
  }: {
    narrativeClusters: NarrativeCluster[];
    narrativeTrends: NarrativeTrends | null;
    selectedCluster: NarrativeCluster | null;
    fetchNarrativeClusters: () => void;
    fetchNarrativeTrends: (timeframe: string) => void;
    fetchClusterDetails: (id: string) => void;
    isLoading: { [key: string]: boolean };
  } = useStore();

  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7d');
  const graphRef = useRef<any>();

  useEffect(() => {
    fetchNarrativeClusters();
    fetchNarrativeTrends(selectedTimeframe);
  }, [fetchNarrativeClusters, fetchNarrativeTrends, selectedTimeframe]);

  useEffect(() => {
    if (narrativeClusters.length > 0) {
      // Transform cluster data into graph format
      const nodes: GraphData['nodes'] = [];
      const links: GraphData['links'] = [];

      narrativeClusters.forEach((cluster) => {
        // Add cluster node
        nodes.push({
          id: cluster.id,
          name: cluster.theme,
          val: cluster.size * 2, // Size based on number of narratives
          color: getSentimentColor(cluster.sentiment_score),
          theme: cluster.theme,
          sentiment: cluster.sentiment_score,
        });

        // Add narrative nodes and links to cluster
        cluster.narratives.forEach((narrative) => {
          nodes.push({
            id: narrative.id,
            name: narrative.title,
            val: 1,
            color: getSentimentColor(narrative.sentiment),
          });

          links.push({
            source: cluster.id,
            target: narrative.id,
            value: 1,
          });
        });
      });

      setGraphData({ nodes, links });
    }
  }, [narrativeClusters]);

  const getSentimentColor = (sentiment: number): string => {
    // Color scale from red (negative) to green (positive)
    if (sentiment > 0.5) return '#22c55e'; // Positive - green
    if (sentiment > 0) return '#86efac'; // Slightly positive - light green
    if (sentiment === 0) return '#94a3b8'; // Neutral - gray
    if (sentiment > -0.5) return '#fca5a5'; // Slightly negative - light red
    return '#ef4444'; // Negative - red
  };

  const handleNodeClick = (node: any) => {
    if (node.theme) {
      // If it's a cluster node
      fetchClusterDetails(node.id);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Narrative Clusters</h1>
        <p className="mt-2 text-sm text-gray-700">
          Explore interconnected narrative themes and their relationships
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
          Trend Timeframe
        </label>
        <select
          id="timeframe"
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Graph Visualization */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        {isLoading.narratives ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-gray-500">Loading narrative clusters...</div>
          </div>
        ) : (
          <div className="h-[600px] w-full">
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="name"
              nodeColor={(node: any) => node.color}
              nodeVal={(node: any) => node.val}
              linkWidth={1}
              linkColor={() => '#e2e8f0'}
              onNodeClick={handleNodeClick}
              cooldownTicks={100}
              d3VelocityDecay={0.1}
            />
          </div>
        )}
      </div>

      {/* Cluster Details */}
      {selectedCluster && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">{selectedCluster.theme}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Size</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedCluster.size}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sentiment</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {Math.round(selectedCluster.sentiment_score * 100)}%
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Growth Rate</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {selectedCluster.growth_rate > 0 ? '+' : ''}
                {Math.round(selectedCluster.growth_rate * 100)}%
              </p>
            </div>
          </div>

          {/* Temporal Evolution */}
          {selectedCluster.temporal_evolution && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Temporal Evolution</h3>
              <div className="mt-2 h-32">
                {/* Add a line chart here for temporal evolution */}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trends */}
      {narrativeTrends && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Narrative Trends</h2>
          <div className="mt-4 space-y-4">
            {narrativeTrends.themes.map((theme: Theme) => (
              <div key={theme.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                <div className="flex items-center">
                  <div className="h-2 w-32 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-primary-600"
                      style={{
                        width: `${theme.trend_data[theme.trend_data.length - 1].strength * 100}%`,
                      }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {Math.round(theme.trend_data[theme.trend_data.length - 1].strength * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NarrativeClusters;
