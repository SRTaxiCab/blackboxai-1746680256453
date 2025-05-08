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

const TimelineExplorer: React.FC = () => {
  const { timelineEvents, timelineSummary, fetchTimelineEvents, fetchTimelineSummary, isLoading } = useStore();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0], // today
  });

  useEffect(() => {
    fetchTimelineEvents({
      start_date: dateRange.start,
      end_date: dateRange.end,
      event_type: selectedType === 'all' ? undefined : selectedType,
    });
    fetchTimelineSummary();
  }, [fetchTimelineEvents, fetchTimelineSummary, dateRange, selectedType]);

  const chartData = {
    labels: timelineEvents.map(event => event.date),
    datasets: [
      {
        label: 'Event Impact',
        data: timelineEvents.map(event => event.impact),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.3,
      },
    ],
  };

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
        beginAtZero: true,
        title: {
          display: true,
          text: 'Impact',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Event Timeline',
      },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Timeline Explorer</h1>
        <p className="mt-2 text-sm text-gray-700">
          Explore and analyze temporal patterns in global events
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="event-type" className="block text-sm font-medium text-gray-700">
            Event Type
          </label>
          <select
            id="event-type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Political">Political</option>
            <option value="Economic">Economic</option>
            <option value="Social">Social</option>
            <option value="Environmental">Environmental</option>
          </select>
        </div>

        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
      </div>

      {/* Summary Cards */}
      {timelineSummary && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {timelineSummary.total_events}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Impact</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {timelineSummary.average_impact}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Date Range</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(timelineSummary.date_range.start).toLocaleDateString()} -{' '}
              {new Date(timelineSummary.date_range.end).toLocaleDateString()}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Events by Type</h3>
            <div className="mt-1 space-y-1">
              {Object.entries(timelineSummary.events_by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-gray-500">{type}</span>
                  <span className="font-medium text-gray-900">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Chart */}
      <div className="rounded-lg bg-white p-6 shadow">
        {isLoading.timeline ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Loading timeline data...</div>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Event List */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Event Details</h2>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <ul className="divide-y divide-gray-200">
            {timelineEvents.map((event) => (
              <li key={`${event.date}-${event.title}`} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{event.type}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">Impact:</div>
                    <div className="ml-2 h-2 w-24 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary-600"
                        style={{ width: `${event.impact * 100}%` }}
                      />
                    </div>
                    <div className="ml-2 text-sm font-medium text-gray-900">
                      {Math.round(event.impact * 100)}%
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimelineExplorer;
