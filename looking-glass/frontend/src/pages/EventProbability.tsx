import React, { useEffect, useState } from 'react';
import useStore from '../store';
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
import { Line } from 'react-chartjs-2';
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

interface ContributingFactor {
  name: string;
  impact: number;
  trend: string;
}

interface ProbabilityDataType {
  category: string;
  timeframe: number;
  dates: string[];
  probabilities: number[];
  contributing_factors: ContributingFactor[];
  overall_probability: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
}

const EventProbability: React.FC = () => {
  const {
    probabilityData,
    categories,
    fetchProbabilityAnalysis,
    fetchCategories,
    isLoading,
  }: {
    probabilityData: ProbabilityDataType | null;
    categories: string[];
    fetchProbabilityAnalysis: (category: string, timeframe: number) => void;
    fetchCategories: () => void;
    isLoading: { [key: string]: boolean };
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [timeframe, setTimeframe] = useState<number>(30);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProbabilityAnalysis(selectedCategory, timeframe);
    }
  }, [fetchProbabilityAnalysis, selectedCategory, timeframe]);

  const chartData = probabilityData ? {
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
  } : null;

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
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Event Probability Over Time',
      },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Event Probability Analysis</h1>
        <p className="mt-2 text-sm text-gray-700">
          Analyze statistical likelihoods of future events based on historical data and current trends
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Event Category
          </label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
            Timeframe (days)
          </label>
          <select
            id="timeframe"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(Number(e.target.value))}
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
          </select>
        </div>
      </div>

      {/* Probability Analysis */}
      {probabilityData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">Overall Probability</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {Math.round(probabilityData.overall_probability * 100)}%
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {Math.round(probabilityData.confidence_interval.lower * 100)}% - {Math.round(probabilityData.confidence_interval.upper * 100)}%
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {probabilityData.category}
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-sm font-medium text-gray-500">Timeframe</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {probabilityData.timeframe} days
              </p>
            </div>
          </div>

          {/* Probability Chart */}
          <div className="rounded-lg bg-white p-6 shadow">
            {isLoading.probability ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-gray-500">Loading probability data...</div>
              </div>
            ) : (
              chartData && <Line data={chartData} options={chartOptions} />
            )}
          </div>

          {/* Contributing Factors */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Contributing Factors</h3>
            <div className="mt-4 space-y-4">
              {probabilityData.contributing_factors.map((factor: ContributingFactor, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{factor.name}</p>
                    <p className="text-sm text-gray-500">Trend: {factor.trend}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <div className="mr-2 text-sm text-gray-500">Impact:</div>
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-primary-600"
                          style={{ width: `${factor.impact * 100}%` }}
                        />
                      </div>
                      <div className="ml-2 text-sm font-medium text-gray-900">
                        {Math.round(factor.impact * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventProbability;
