import React, { useState, useEffect } from 'react';
import {
  Users, DollarSign, TrendingUp, TrendingDown, Activity,
  Calendar, Download, Filter, BarChart3, PieChart, LineChart,
  Eye, Clock, Target, Percent, Globe, Smartphone,
  Loader2, RefreshCw, ChevronUp, ChevronDown
} from 'lucide-react';
import { analyticsService } from '../../server/analyticsService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState({
    overview: {},
    userGrowth: [],
    revenueTrend: [],
    predictions: {},
    platformStats: {},
    topCountries: [],
    deviceStats: {},
    predictionsByType: []
  });

  // Time range options
  const timeRanges = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const analyticsData = await analyticsService.getAnalytics({ timeRange });
      setData(analyticsData);
      
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  // Format numbers
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate percentage change
  const getChange = (current, previous) => {
    if (!previous || previous === 0) return { value: 100, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change.toFixed(1)),
      isPositive: change >= 0
    };
  };

  // Render change indicator
  const renderChangeIndicator = (current, previous) => {
    const change = getChange(current, previous);
    return (
      <div className={`flex items-center gap-1 text-sm ${change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {change.isPositive ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>{change.value}%</span>
        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">vs previous</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track performance, growth, and user engagement
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Time Range Selector */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-auto"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={fetchAnalytics}
              disabled={refreshing}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatNumber(data.overview.totalUsers || 0)}
              </p>
              {renderChangeIndicator(
                data.overview.totalUsers || 0,
                data.overview.previousTotalUsers || 0
              )}
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">
              +{formatNumber(data.overview.newUsers || 0)} new
            </span>
            <span className="mx-2">•</span>
            <span>{formatNumber(data.overview.activeUsers || 0)} active</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(data.overview.totalRevenue || 0)}
              </p>
              {renderChangeIndicator(
                data.overview.totalRevenue || 0,
                data.overview.previousRevenue || 0
              )}
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">
              {formatCurrency(data.overview.monthlyRevenue || 0)} this month
            </span>
            <span className="mx-2">•</span>
            <span>{formatCurrency(data.overview.avgOrderValue || 0)} avg. order</span>
          </div>
        </div>

        {/* Predictions Generated */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Predictions Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatNumber(data.overview.totalPredictions || 0)}
              </p>
              {renderChangeIndicator(
                data.overview.totalPredictions || 0,
                data.overview.previousPredictions || 0
              )}
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatNumber(data.predictions?.daily || 0)} today</span>
            <span className="mx-2">•</span>
            <span>{formatNumber(data.predictions?.weekly || 0)} this week</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {(data.overview.conversionRate || 0).toFixed(1)}%
              </p>
              {renderChangeIndicator(
                data.overview.conversionRate || 0,
                data.overview.previousConversionRate || 0
              )}
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{(data.overview.freeToPremiumRate || 0).toFixed(1)}% free → premium</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">New user acquisition over time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total: {formatNumber(data.overview.totalUsers || 0)}</span>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {data.userGrowth?.length > 0 ? (
              <div className="text-center">
                <LineChart className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">User growth data loaded</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {data.userGrowth.length} data points
                </p>
              </div>
            ) : (
              <div className="text-center">
                <LineChart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No user growth data available</p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatNumber(data.overview.newUsers || 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">New Users</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {(data.overview.retentionRate || 0).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Retention Rate</div>
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily revenue over time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total: {formatCurrency(data.overview.totalRevenue || 0)}</span>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {data.revenueTrend?.length > 0 ? (
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Revenue data loaded</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {data.revenueTrend.length} data points
                </p>
              </div>
            ) : (
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data.overview.monthlyRevenue || 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Monthly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {formatNumber(data.overview.totalTransactions || 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform & Device Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Statistics */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Usage</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">User distribution by platform</p>
            </div>
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {data.platformStats?.web && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Web</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Desktop & Mobile Web</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {data.platformStats.web.percentage}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatNumber(data.platformStats.web.users)} users
                  </p>
                </div>
              </div>
            )}

            {data.platformStats?.ios && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">iOS App</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">iPhone & iPad</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {data.platformStats.ios.percentage}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatNumber(data.platformStats.ios.users)} users
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">Session Duration</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {Math.floor((data.platformStats?.avgSessionDuration || 0) / 60)}m {Math.round((data.platformStats?.avgSessionDuration || 0) % 60)}s
              </div>
            </div>
          </div>
        </div>

        {/* Device Statistics */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Device Distribution</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Usage by device type</p>
            </div>
            <Smartphone className="w-5 h-5 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            {data.deviceStats?.mobile && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Mobile</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {data.deviceStats.mobile.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${data.deviceStats.mobile.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatNumber(data.deviceStats.mobile.users)} users
                    </p>
                  </div>
                </div>
              </div>
            )}

            {data.deviceStats?.desktop && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Desktop</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {data.deviceStats.desktop.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${data.deviceStats.desktop.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatNumber(data.deviceStats.desktop.users)} users
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">Bounce Rate</div>
              <div className={`text-sm font-semibold ${(data.platformStats?.bounceRate || 0) < 30 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {(data.platformStats?.bounceRate || 0).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions by Type */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Predictions by Type</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Most popular prediction categories</p>
          </div>
          <PieChart className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.predictionsByType?.slice(0, 4).map((type, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-red-100 dark:bg-red-900/30' : 
                    index === 1 ? 'bg-blue-100 dark:bg-blue-900/30' : 
                    index === 2 ? 'bg-green-100 dark:bg-green-900/30' : 
                    'bg-purple-100 dark:bg-purple-900/30'}`}>
                    <Activity className={`w-4 h-4 ${index === 0 ? 'text-red-600 dark:text-red-400' : 
                      index === 1 ? 'text-blue-600 dark:text-blue-400' : 
                      index === 2 ? 'text-green-600 dark:text-green-400' : 
                      'text-purple-600 dark:text-purple-400'}`} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {type.percentage}%
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatNumber(type.count)} predictions
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${index === 0 ? 'bg-red-500' : 
                      index === 1 ? 'bg-blue-500' : 
                      index === 2 ? 'bg-green-500' : 
                      'bg-purple-500'}`}
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Countries */}
      {data.topCountries?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Countries</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">User distribution by country</p>
            </div>
            <Globe className="w-5 h-5 text-green-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Country</th>
                  <th className="pb-3 font-medium text-right">Users</th>
                  <th className="pb-3 font-medium text-right">Percentage</th>
                  <th className="pb-3 font-medium text-right">Growth</th>
                </tr>
              </thead>
              <tbody>
                {data.topCountries.slice(0, 5).map((country, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-xs font-bold">{country.code}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{country.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatNumber(country.users)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-gray-500 dark:text-gray-400">{country.percentage}%</span>
                    </td>
                    <td className="py-3 text-right">
                      <div className={`inline-flex items-center gap-1 ${country.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {country.growth >= 0 ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(country.growth)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;