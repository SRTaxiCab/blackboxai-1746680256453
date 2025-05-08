import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TimelineExplorer from './pages/TimelineExplorer';
import EventProbability from './pages/EventProbability';
import NarrativeClusters from './pages/NarrativeClusters';
import GeospatialView from './pages/GeospatialView';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/timeline" element={<TimelineExplorer />} />
              <Route path="/probability" element={<EventProbability />} />
              <Route path="/narratives" element={<NarrativeClusters />} />
              <Route path="/geospatial" element={<GeospatialView />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
