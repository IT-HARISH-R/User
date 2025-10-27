import React from "react";
import {
  Activity,
  Layers,
  Users,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection }) => {
  const navItems = [
    { name: "Dashboard", icon: <Activity /> },
    { name: "Plans", icon: <Layers /> },
    { name: "Users", icon: <Users /> },
    { name: "Analytics", icon: <BarChart3 /> },
    { name: "Payments", icon: <CreditCard /> },
    { name: "Settings", icon: <Settings /> },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
    >
      <div className="flex items-center justify-center h-16 bg-indigo-600">
        <h1 className="text-xl font-bold text-white">Astro Admin</h1>
      </div>
      <nav className="mt-6 space-y-2 px-4">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveSection(item.name);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-700 ${
              activeSection === item.name
                ? "bg-indigo-100 dark:bg-gray-700 font-medium"
                : ""
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
