import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard: React.FC<{
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className: string }>;
}> = ({ title, description, href, icon: Icon }) => (
  <Link
    to={href}
    className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <div>
      <Icon className="h-8 w-8 text-primary-600" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Project Looking Glass</h1>
        <p className="mt-2 text-sm text-gray-700">
          Advanced predictive intelligence platform for analyzing global digital data
        </p>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Timeline Explorer Card */}
            <DashboardCard
              title="Timeline Explorer"
              description="Explore and analyze temporal patterns in global events"
              href="/timeline"
              icon={({ className }) => (
                <svg
                  className={className}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            />

            {/* Event Probability Card */}
            <DashboardCard
              title="Event Probability"
              description="Analyze statistical likelihoods of future events"
              href="/probability"
              icon={({ className }) => (
                <svg
                  className={className}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              )}
            />

            {/* Narrative Clusters Card */}
            <DashboardCard
              title="Narrative Clusters"
              description="Discover emerging patterns in global narratives"
              href="/narratives"
              icon={({ className }) => (
                <svg
                  className={className}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
