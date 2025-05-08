import React from 'react';

const EventProbability: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Event Probability Analysis</h1>
        <p className="mt-2 text-sm text-gray-700">
          Analyze statistical likelihoods of future events based on historical data and current trends
        </p>
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Probability Chart Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Probability Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">Probability chart visualization coming soon...</p>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
                <div className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Event Category
                      </label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option>Political</option>
                        <option>Economic</option>
                        <option>Social</option>
                        <option>Technological</option>
                        <option>Environmental</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time Frame
                      </label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option>Next 30 days</option>
                        <option>Next 90 days</option>
                        <option>Next 6 months</option>
                        <option>Next year</option>
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

export default EventProbability;
