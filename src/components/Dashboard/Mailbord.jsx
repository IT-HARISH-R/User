import React, { useState, useEffect } from 'react';
import {
  Users, DollarSign, BarChart3, Clock, TrendingUp, Activity,
  RefreshCw, AlertCircle, Loader
} from 'lucide-react';
import { dashboardService } from '../../server/dashboardService';

const Mailbord = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [statsData, activitiesData, revenueData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getRevenueAnalytics()
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
      setRevenueData(revenueData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      return 'Invalid time';
    }
  };

  // Get status badge with proper Tailwind classes
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        text: 'Completed'
      },
      active: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        text: 'Active'
      },
      processing: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        text: 'Processing'
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        text: 'Pending'
      },
      failed: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        text: 'Failed'
      },
      canceled: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        text: 'Canceled'
      },
      expired: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        text: 'Expired'
      }
    };

    const config = statusConfig[status] || {
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      text: status
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Get avatar initials
  const getAvatarInitials = (username) => {
    if (!username) return "U";
    const parts = username.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  // Get avatar color based on username
  const getAvatarColor = (username) => {
    const colors = [
      'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
      'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
      'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    ];

    if (!username) return colors[0];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Calculate percentage change for display
  const getPercentageChange = (value) => {
    if (!value && value !== 0) return '0%';
    const isPositive = value >= 0;
    const color = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const sign = isPositive ? '+' : '';

    return (
      <span className={`text-xs ${color} mt-1`}>
        <TrendingUp className="inline h-3 w-3 mr-1" />
        {sign}{value}
      </span>
    );
  }; 

  if (loading) {
    return (
      <div className="flex flex-col  items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 mb-4 text-center max-w-md">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard Overview</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Welcome to your astrology dashboard
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="
          flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-md
          hover:from-blue-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-indigo-500">
          <div className="flex items-start">
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                {stats?.users?.total?.toLocaleString() || '0'}
              </p>
              {getPercentageChange(stats?.users?.growth_rate)}
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-green-500">
          <div className="flex items-start">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                {formatCurrency(revenueData?.metrics?.total_revenue)}
              </p>
              {getPercentageChange(revenueData?.metrics?.revenue_growth)}
            </div>
          </div>
        </div>

        {/* Horoscopes Generated */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-blue-500">
          <div className="flex items-start">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Predictions Generated</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                {stats?.predictions?.total?.toLocaleString() || '0'}
              </p>
              {getPercentageChange(stats?.predictions?.growth_rate)}
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-purple-500">
          <div className="flex items-start">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                {revenueData?.metrics?.active_subscriptions || '0'}
              </p>
              {getPercentageChange(revenueData?.metrics?.subscription_growth)}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Daily Predictions',
            value: stats?.predictions?.today || '0',
            icon: <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
            bgColor: 'bg-orange-100 dark:bg-orange-900',
            borderColor: 'border-l-orange-500'
          },
          {
            title: 'Weekly Predictions',
            value: stats?.predictions?.week || '0',
            icon: <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
            bgColor: 'bg-teal-100 dark:bg-teal-900',
            borderColor: 'border-l-teal-500'
          },
          {
            title: 'New Users Today',
            value: stats?.users?.new_today || '0',
            icon: <Activity className="h-5 w-5 text-red-600 dark:text-red-400" />,
            bgColor: 'bg-red-100 dark:bg-red-900',
            borderColor: 'border-l-red-500'
          },
          {
            title: "Today's Revenue",
            value: formatCurrency(revenueData?.metrics?.todays_revenue),
            icon: <span className="text-green-600 dark:text-green-400 font-bold">$</span>,
            bgColor: 'bg-green-100 dark:bg-green-900',
            borderColor: 'border-l-green-500'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 ${stat.borderColor} border-l-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Revenue Overview</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last {revenueData?.labels?.length || 0} days
            </span>
          </div>
          <div className="h-64 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
            {revenueData?.labels?.length > 0 ? (
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-indigo-500" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Revenue data loaded</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total: {formatCurrency(revenueData.total)}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Data will appear here once available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Activity Chart */}
        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User Activity</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">Real-time</span>
          </div>
          <div className="h-64 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-3 text-blue-500" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">User Engagement</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Active users: {stats?.users?.active?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div> */}

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">


        {recentActivities.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header with search */}
            <div className="px-6 py-4 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Activity</h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                      <th className="px-6 py-3 font-medium whitespace-nowrap">User</th>
                      <th className="px-6 py-3 font-medium whitespace-nowrap">Activity</th>
                      <th className="px-6 py-3 font-medium whitespace-nowrap">Date & Time</th>
                      <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentActivities.slice(0, 5).map((activity, index) => {
                      // Helper function to get relative date
                      const getRelativeDate = (dateString) => {
                        if (!dateString) return { date: 'N/A', isRecent: false };

                        const activityDate = new Date(dateString);
                        const today = new Date();
                        const yesterday = new Date();
                        yesterday.setDate(today.getDate() - 1);

                        // Reset time for comparison
                        const activityDateOnly = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());
                        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const yesterdayDateOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

                        if (activityDateOnly.getTime() === todayDateOnly.getTime()) {
                          return { date: 'Today', isRecent: true };
                        } else if (activityDateOnly.getTime() === yesterdayDateOnly.getTime()) {
                          return { date: 'Yesterday', isRecent: false };
                        } else {
                          const daysDifference = Math.floor((todayDateOnly - activityDateOnly) / (1000 * 60 * 60 * 24));

                          if (daysDifference < 7) {
                            // Within 7 days, show day name
                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            return {
                              date: dayNames[activityDate.getDay()],
                              isRecent: false
                            };
                          } else if (daysDifference < 30) {
                            // Within 30 days, show "X days ago"
                            return {
                              date: `${daysDifference} days ago`,
                              isRecent: false
                            };
                          } else {
                            // Older than 30 days, show formatted date
                            return {
                              date: formatDate(activity.timestamp),
                              isRecent: false
                            };
                          }
                        }
                      };

                      const relativeDate = getRelativeDate(activity.timestamp);

                      return (
                        <tr
                          key={activity.id || index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`h-9 w-9 rounded-full flex items-center justify-center mr-3 ${getAvatarColor(activity.user)}`}>
                                <span className="text-sm font-medium">
                                  {getAvatarInitials(activity.user)}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {activity.user || 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {activity.type ? activity.type.replace(/_/g, ' ') : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="text-gray-800 dark:text-gray-200 truncate">
                                {activity.description || 'No description'}
                              </p>
                              {activity.details && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                  {activity.details}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-800 dark:text-gray-200 font-medium">
                                  {relativeDate.date}
                                </span>
                                {relativeDate.isRecent && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Recent
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(activity.timestamp)} IST
                                </span>
                                {/* Show exact date on hover */}
                                <div className="relative">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 bottom-full mb-1 px-2 py-1 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                                    {formatDate(activity.timestamp)}
                                  </div>
                                  <svg className="w-3 h-3 ml-1 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(activity.status)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              User activities will appear here
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Popular Service',
            value: 'Future Predictions',
            description: 'Most requested service this month',
            gradient: 'from-indigo-500 to-purple-600',
            textColor: 'text-indigo-100'
          },
          {
            title: 'Active Users',
            value: stats?.users?.active?.toLocaleString() || '0',
            description: 'Currently active users',
            gradient: 'from-green-500 to-teal-600',
            textColor: 'text-green-100'
          },
          {
            title: 'Weekly Revenue',
            value: formatCurrency(revenueData?.metrics?.weekly_revenue),
            description: 'Revenue generated this week',
            gradient: 'from-orange-500 to-red-600',
            textColor: 'text-orange-100'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.gradient} p-6 rounded-xl shadow text-white`}
          >
            <h4 className="text-lg font-semibold mb-2">{stat.title}</h4>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className={`text-sm ${stat.textColor}`}>{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mailbord;