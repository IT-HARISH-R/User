import React, { useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar'; // Import the provided Sidebar component
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Mailbord from '../components/Dashboard/Mailbord';
import Users from '../components/Dashboard/Users';
import AdminPlans from '../components/Dashboard/AdminPlans';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard'); // Default active section

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="lg:hidden text-gray-500 dark:text-gray-300 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {activeSection}
            </h2>
            <div className="flex items-center space-x-4">
              <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-300 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Conditional Content Based on Active Section */}
          {activeSection === 'Dashboard' && (

            <Mailbord />
          )}

          {activeSection === 'Plans' && (<AdminPlans />)}
          {activeSection === 'Users' && (<Users />)}

          {activeSection === 'Analytics' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">We're building powerful analytics and insights. Stay tuned for detailed reports and visual data tracking.</p>
            </div>
          )}

          {activeSection === 'Payments' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Payments</h3>
              <p className="text-gray-600 dark:text-gray-400">Payment management features are on the way. Soon, you'll be able to view and handle transactions effortlessly.</p>
            </div>
          )}

          {activeSection === 'Settings' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Settings</h3>
              <p className="text-gray-600 dark:text-gray-400">Customization and configuration options are coming soon. Get ready to personalize your experience!</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;