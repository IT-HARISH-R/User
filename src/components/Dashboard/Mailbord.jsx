import React from 'react';

const Mailbord = () => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="h-8 w-8 text-indigo-600 dark:text-indigo-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 13.5a6 6 0 110-12 6 6 0 010 12z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">1,234</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="h-8 w-8 text-green-600 dark:text-green-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v2H4V4zm2 4h12v2H6V8zm0 4h8v2H6v-2zm0 4h4v2H6v-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">$45,678</p>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="h-8 w-8 text-blue-600 dark:text-blue-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                10-4.48 10-10S17.52 2 12 2zm0 
                18c-4.42 0-8-3.58-8-8s3.58-8 
                8-8 8 3.58 8 8-3.58 8-8 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">89</p>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="h-8 w-8 text-red-600 dark:text-red-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94a7 7 0 11-14 0 7 7 0 0114 0zM12 9v6m-3-3h6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">23</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">Jane Smith</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">Updated profile</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">2025-10-26</td>
                <td className="px-4 py-2">
                  <span className="text-green-600 dark:text-green-400">Completed</span>
                </td>
              </tr>
              <tr className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">Mark Johnson</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">Created project</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">2025-10-25</td>
                <td className="px-4 py-2">
                  <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
                </td>
              </tr>
              <tr className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">Emily Davis</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">Deleted task</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">2025-10-24</td>
                <td className="px-4 py-2">
                  <span className="text-red-600 dark:text-red-400">Failed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Overview Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Sales Overview</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Chart Placeholder (Implement Chart.js here)</p>
        </div>
      </div>
    </>
  );
};

export default Mailbord;
