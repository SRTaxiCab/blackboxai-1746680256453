import React from 'react';

const GeospatialView: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Geospatial View</h1>
        <p className="mt-2 text-sm text-gray-700">
          Visualize global data and trends across geographical regions
        </p>

        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Map Visualization Section */}
            <div className="mb-8">
              <div className="bg-gray-50 p-4 rounded-lg h-[600px] flex items-center justify-center">
                <p className="text-gray-500">Interactive map visualization coming soon...</p>
              </div>
            </div>

            {/* Controls and Filters */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Region Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                  <option>Global</option>
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Asia</option>
                  <option>South America</option>
                  <option>Africa</option>
                  <option>Oceania</option>
                </select>
              </div>

              {/* Data Layer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Layer</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                  <option>Risk Indicators</option>
                  <option>Event Density</option>
                  <option>Narrative Spread</option>
                  <option>Economic Indicators</option>
                </select>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Range</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex items-center">
                  <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Low Risk</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Medium Risk</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 bg-orange-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">High Risk</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Critical Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeospatialView;
