import React, { useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar'; // Import the provided Sidebar component
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Mailbord from '../components/Dashboard/Mailbord';
import Users from '../components/Dashboard/Users';
import AdminPlans from '../components/Dashboard/AdminPlans';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Analytics from '../components/Dashboard/Analytics';
import Payments from '../components/Dashboard/Payments';
import ContactInquiries from '../components/Dashboard/ContactInquiries';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard'); // Default active section
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  return (
    <div className="flex h-[94vh] bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            {/* Mobile menu button - shows on all screens when sidebar is closed */}
            {!sidebarOpen && (
              <button
                className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
            )}

            {/* Spacer for alignment on mobile when sidebar is open */}
            {sidebarOpen && (
              <div className="lg:hidden w-6"></div>
            )}

            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mx-auto lg:mx-0 lg:mr-auto">
              {activeSection}
            </h2>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-300 cursor-pointer hover:text-gray-700 dark:hover:text-gray-100 transition-colors" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </div>

              {/* User Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-1 sm:space-x-2 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg px-2 sm:px-4 py-1.5 sm:py-2"
              >
                <UserCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <span className="hidden sm:inline text-white font-medium text-sm sm:text-base">
                  {user && user.username}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Conditional Content Based on Active Section */}
          {activeSection === 'Dashboard' && (
            <div className="h-full">
              <Mailbord />
            </div>
          )}

          {activeSection === 'Plans' && (
            <div className="h-full">
              <AdminPlans />
            </div>
          )}

          {activeSection === 'Users' && (
            <div className="h-full">
              <Users />
            </div>
          )}

          {/* {activeSection === 'Analytics' && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow h-full">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                We're building powerful analytics and insights. Stay tuned for detailed reports and visual data tracking.
              </p>
            </div>
          )} */}
          {activeSection === 'Analytics' && (<Analytics />)}

          {activeSection === 'Inquiries' && (<ContactInquiries />)}

          {activeSection === 'Payments' && (<Payments />)}
          {/* {activeSection === 'Payments' && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow h-full">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Payments</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Payment management features are on the way. Soon, you'll be able to view and handle transactions effortlessly.
              </p>
            </div>
          )} */}

          {activeSection === 'Settings' && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow h-full">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Settings</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Customization and configuration options are coming soon. Get ready to personalize your experience!
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;