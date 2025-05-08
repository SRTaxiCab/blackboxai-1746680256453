import React from 'react';

const NarrativeClusters: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Narrative Clusters</h1>
        <p className="mt-2 text-sm text-gray-700">
          Discover and analyze emerging patterns in global narratives
        </p>

        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Cluster Visualization Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cluster Visualization</h3>
              <div className="bg-gray-50 p-4 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">Cluster visualization coming soon...</p>
              </div>
            </div>

            {/* Narrative Analysis Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Narratives</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">Narrative Cluster {index}</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Sample narrative description and key themes...
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Theme 1
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Theme 2
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trend Analysis</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time Period</label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option>Last 24 hours</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Source Type</label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option>All Sources</option>
                        <option>News Media</option>
                        <option>Social Media</option>
                        <option>Academic Papers</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NarrativeClusters;
