import React from "react";
import {
    Activity,
    Layers,
    Users,
    BarChart3,
    CreditCard,
    Settings,
    ChevronLeft,
    ChevronRight,
    Mail,
} from "lucide-react";

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    activeSection,
    setActiveSection,
    collapsed = false,
    setCollapsed
}) => {
    const navItems = [
        { name: "Dashboard", icon: <Activity size={20} />, badge: null },
        { name: "Inquiries", icon: <Mail size={20} />, badge: null },
        { name: "Plans", icon: <Layers size={20} />, badge: 3 },
        { name: "Users", icon: <Users size={20} />, badge: null },
        { name: "Analytics", icon: <BarChart3 size={20} />, badge: "New" },
        { name: "Payments", icon: <CreditCard size={20} />, badge: null },
        { name: "Settings", icon: <Settings size={20} />, badge: null },
    ];

    const handleNavClick = (itemName) => {
        setActiveSection(itemName);
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const sidebarWidth = collapsed ? "w-20" : "w-64";

    return (
        <>
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } ${sidebarWidth} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 bg-indigo-600 px-4">
                    {!collapsed && (
                        <h1 className="text-xl font-bold text-white">Astro Admin</h1>
                    )}


                    {/* Mobile close button - only visible on mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white transition-colors duration-200"
                        aria-label="Close sidebar"
                    >
                        <ChevronLeft size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6 space-y-1 px-3">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavClick(item.name)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${activeSection === item.name
                                ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border-r-2 border-indigo-600 dark:border-indigo-400 font-semibold"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                                } ${collapsed ? "justify-center px-2" : ""}`}
                            title={collapsed ? item.name : ""}
                        >
                            <div className={`flex-shrink-0 ${activeSection === item.name ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"}`}>
                                {item.icon}
                            </div>

                            {!collapsed && (
                                <span className="flex-1 text-left font-medium truncate">
                                    {item.name}
                                </span>
                            )}

                            {/* Badges */}
                            {!collapsed && item.badge && (
                                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${typeof item.badge === "number"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    }`}>
                                    {item.badge}
                                </span>
                            )}

                            {collapsed && item.badge && (
                                <div className="absolute top-2 right-2">
                                    <span className={`flex h-2 w-2 ${typeof item.badge === "number"
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                        } rounded-full`} />
                                </div>
                            )}
                        </button>
                    ))}
                </nav>

            </div>
        </>
    );
};

export default Sidebar;