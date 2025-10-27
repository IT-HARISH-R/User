import React from "react";
import { Users as UsersIcon, Layers, Activity, DollarSign } from "lucide-react";
import Users from "./Users";
const MainContent = ({ activeSection }) => {
  const stats = [
    { title: "Active Users", value: "1,245", icon: <UsersIcon className="w-5 h-5" />, change: "+8.3%" },
    { title: "Total Plans", value: "6", icon: <Layers className="w-5 h-5" />, change: "+2.1%" },
    { title: "API Requests", value: "18,450", icon: <Activity className="w-5 h-5" />, change: "+5.8%" },
    { title: "Revenue", value: "$42,670", icon: <DollarSign className="w-5 h-5" />, change: "+12.4%" },
  ];

  const topPlans = [
    { name: "Astro Basic", users: 420, revenue: "$8,940" },
    { name: "Astro Pro", users: 320, revenue: "$14,230" },
    { name: "Astro Enterprise", users: 210, revenue: "$19,480" },
  ];

  const recentLogs = [
    { user: "Arun Kumar", action: "activated Premium plan", time: "5m ago" },
    { user: "Priya S", action: "added new project", time: "12m ago" },
    { user: "Ravi Teja", action: "updated billing info", time: "25m ago" },
    { user: "Divya L", action: "renewed subscription", time: "1h ago" },
  ];

  if (activeSection === "Dashboard") {
    return (
      <>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Welcome back, Admin 👋
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, idx) => (
            <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.value}</h3>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-gray-700 rounded-full text-indigo-600 dark:text-indigo-300">
                  {item.icon}
                </div>
              </div>
              <p className="mt-3 text-sm text-green-500">{item.change} from last week</p>
            </div>
          ))}
        </div>

        {/* Recent Activity + Top Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex justify-between">
                  <p className="text-sm text-gray-800 dark:text-gray-300">
                    <span className="font-semibold">{log.user}</span> {log.action}
                  </p>
                  <p className="text-xs text-gray-500">{log.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Plans</h3>
            {topPlans.map((plan, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{plan.name}</p>
                  <p className="text-xs text-gray-500">{plan.users} users</p>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{plan.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ✅ If "Users" clicked, show Users.jsx
  if (activeSection === "Users") {
    return <Users />;
  }

  // Default fallback
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{activeSection}</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Content for <strong>{activeSection}</strong> coming soon...
      </p>
    </div>
  );
};

export default MainContent;
