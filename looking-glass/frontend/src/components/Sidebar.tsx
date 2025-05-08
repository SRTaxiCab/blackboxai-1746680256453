import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClockIcon,
  ChartBarIcon,
  ShareIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Timeline Explorer', href: '/timeline', icon: ClockIcon },
  { name: 'Event Probability', href: '/probability', icon: ChartBarIcon },
  { name: 'Narrative Clusters', href: '/narratives', icon: ShareIcon },
  { name: 'Geospatial View', href: '/geospatial', icon: GlobeAltIcon },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="Looking Glass"
          />
        </div>
        <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex w-full flex-col">
          <p className="text-xs font-medium text-gray-500">Looking Glass Analytics</p>
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
