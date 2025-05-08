import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Dashboard: React.FC = () => {
  const {
    timelineEvents,
    probabilityData,
    narrativeClusters,
    geospatialPoints,
    fetchTimelineEvents,
    fetchProbabilityAnalysis,
    fetchNarrativeClusters,
    fetchGeospatialPoints,
    isLoading,
  } = useStore();

  useEffect(() => {
    // Fetch initial data for dashboard overview
    fetchTimelineEvents({ limit: 5 });
    fetchProbabilityAnalysis('overall', 30);
    fetchNarrativeClusters({ limit: 5 });
    fetchGeospatialPoints({ limit: 5 });
  }, [fetchTimelineEvents, fetchProbabilityAnalysis, fetchNarrativeClusters, fetchGeospatialPoints]);

  const probabilityChartData = probabilityData
    ? {
        labels: probabilityData.dates,
        datasets: [
          {
            label: 'Probability',
            data: probabilityData.probabilities,
            borderColor: 'rgb(14, 165, 233)',
            backgroundColor: 'rgba(14, 165, 233, 0.5)',
            tension: 0.3,
            fill: true,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'Probability',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of key insights and analysis across all dimensions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Events</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{timelineEvents.length}</p>
          <div className="mt-4">
            <Link
              to="/timeline"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View timeline →
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Overall Probability</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {probabilityData ? `${Math.round(probabilityData.overall_probability * 100)}%` : '-'}
          </p>
          <div className="mt-4">
            <Link
              to="/probability"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View analysis →
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Narrative Clusters</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{narrativeClusters.length}</p>
          <div className="mt-4">
            <Link
              to="/narratives"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View clusters →
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Regions</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {new Set(geospatialPoints.map((p) => p.region)).size}
          </p>
          <div className="mt-4">
            <Link
              to="/geospatial"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View map →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Events</h2>
            <Link
              to="/timeline"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          {isLoading.timeline ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {timelineEvents.slice(0, 5).map((event) => (
                <div key={event.date} className="flex items-start space-x-4">
                  <div className="min-w-[100px] text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Probability Trends */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Probability Trends</h2>
            <Link
              to="/probability"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View analysis
            </Link>
          </div>
          {isLoading.probability ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">Loading probability data...</div>
            </div>
          ) : (
            probabilityChartData && (
              <div className="h-64">
                <Line data={probabilityChartData} options={chartOptions} />
              </div>
            )
          )}
        </div>

        {/* Top Narrative Clusters */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Top Narrative Clusters</h2>
            <Link
              to="/narratives"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          {isLoading.narratives ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">Loading clusters...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {narrativeClusters.slice(0, 5).map((cluster) => (
                <div key={cluster.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cluster.theme}</p>
                    <p className="text-sm text-gray-500">{cluster.narratives.length} narratives</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {Math.round(cluster.sentiment_score * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">sentiment</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Regions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Active Regions</h2>
            <Link
              to="/geospatial"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View map
            </Link>
          </div>
          {isLoading.geospatial ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">Loading regions...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from(
                geospatialPoints.reduce((acc, point) => {
                  const existing = acc.get(point.region) || {
                    count: 0,
                    avgIntensity: 0,
                  };
                  acc.set(point.region, {
                    count: existing.count + 1,
                    avgIntensity: (existing.avgIntensity * existing.count + point.intensity) / (existing.count + 1),
                  });
                  return acc;
                }, new Map())
              )
                .sort(([, a], [, b]) => b.count - a.count)
                .slice(0, 5)
                .map(([region, data]) => (
                  <div key={region} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{region}</p>
                      <p className="text-sm text-gray-500">{data.count} events</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {Math.round(data.avgIntensity * 100)}%
                      </p>
                      <p className="text-sm text-gray-500">avg. intensity</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
