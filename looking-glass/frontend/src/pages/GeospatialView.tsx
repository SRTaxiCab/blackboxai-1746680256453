import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GeospatialView: React.FC = () => {
  const {
    geospatialPoints,
    regions,
    fetchGeospatialPoints,
    fetchRegions,
    isLoading,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0], // today
  });
  const [viewMode, setViewMode] = useState<'points' | 'heatmap' | 'clusters'>('points');

  useEffect(() => {
    fetchGeospatialPoints({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      start_date: timeRange.start,
      end_date: timeRange.end,
    });
    fetchRegions();
  }, [fetchGeospatialPoints, fetchRegions, selectedCategory, timeRange]);

  const getMarkerColor = (intensity: number): string => {
    if (intensity > 0.8) return '#ef4444'; // High intensity - red
    if (intensity > 0.5) return '#f97316'; // Medium-high intensity - orange
    if (intensity > 0.3) return '#facc15'; // Medium intensity - yellow
    return '#22c55e'; // Low intensity - green
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Geospatial Analysis</h1>
        <p className="mt-2 text-sm text-gray-700">
          Explore geographical distribution and patterns of events
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
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
            <option value="all">All Categories</option>
            <option value="political">Political</option>
            <option value="economic">Economic</option>
            <option value="social">Social</option>
            <option value="environmental">Environmental</option>
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
            value={timeRange.start}
            onChange={(e) => setTimeRange((prev) => ({ ...prev, start: e.target.value }))}
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
            value={timeRange.end}
            onChange={(e) => setTimeRange((prev) => ({ ...prev, end: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="view-mode" className="block text-sm font-medium text-gray-700">
            View Mode
          </label>
          <select
            id="view-mode"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'points' | 'heatmap' | 'clusters')}
          >
            <option value="points">Points</option>
            <option value="heatmap">Heatmap</option>
            <option value="clusters">Clusters</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-lg bg-white p-4 shadow">
        {isLoading.geospatial ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-gray-500">Loading geospatial data...</div>
          </div>
        ) : (
          <div className="h-[600px] w-full">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <ZoomControl position="bottomright" />

              {geospatialPoints.map((point) => (
                <CircleMarker
                    key={point.id}
                    center={[point.location.lat, point.location.lng]}
                    radius={10}
                    fillColor={getMarkerColor(point.intensity)}
                    color={getMarkerColor(point.intensity)}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.4}
                  >
                    <Popup>
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900">{point.details.title}</h3>
                        <p className="text-sm text-gray-700">{point.details.description}</p>
                        <div className="text-xs text-gray-500">
                          <p>Category: {point.category}</p>
                          <p>Region: {point.region}</p>
                          <p>
                            Intensity: {Math.round(point.intensity * 100)}%
                          </p>
                          <p>Date: {new Date(point.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

                {/* Intensity-based visualization for heatmap mode */}
                {viewMode === 'heatmap' && geospatialPoints.map((point) => (
                  <CircleMarker
                    key={`heat-${point.id}`}
                    center={[point.location.lat, point.location.lng]}
                    radius={point.intensity * 30}
                    fillColor={getMarkerColor(point.intensity)}
                    color={getMarkerColor(point.intensity)}
                    weight={1}
                    opacity={0.5}
                    fillOpacity={0.3}
                  />
                ))}

                {/* Region-based visualization for cluster mode */}
                {viewMode === 'clusters' && regions.map((region) => (
                  <CircleMarker
                    key={region.name}
                    center={region.center}
                    radius={Math.max(region.activity_level * 50, 20)}
                    fillColor="#3b82f6"
                    color="#2563eb"
                    weight={2}
                    opacity={0.6}
                    fillOpacity={0.2}
                  >
                    <Popup>
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900">{region.name}</h3>
                        <p className="text-sm text-gray-700">
                          Activity Level: {Math.round(region.activity_level * 100)}%
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Regional Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Active Regions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Most Active Regions</h2>
          <div className="mt-4 space-y-4">
            {regions
              .sort((a, b) => b.activity_level - a.activity_level)
              .slice(0, 5)
              .map((region) => (
                <div key={region.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{region.name}</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary-600"
                        style={{ width: `${region.activity_level * 100}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {Math.round(region.activity_level * 100)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Category Distribution</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(
              geospatialPoints.reduce((acc: Record<string, number>, point) => {
                acc[point.category] = (acc[point.category] || 0) + 1;
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => {
                const percentage = (count / geospatialPoints.length) * 100;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{category}</span>
                    <div className="flex items-center">
                      <div className="h-2 w-32 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-primary-600"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeospatialView;
