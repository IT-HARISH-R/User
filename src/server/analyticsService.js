// Mock analytics service - replace with real API calls
export const analyticsService = {
  getAnalytics: async (params = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { timeRange = '7d' } = params;
    
    // Generate mock data based on time range
    const baseData = {
      overview: {
        totalUsers: 12542,
        previousTotalUsers: 11876,
        newUsers: 215,
        activeUsers: 4521,
        totalRevenue: 89250,
        previousRevenue: 78500,
        monthlyRevenue: 24500,
        avgOrderValue: 49.99,
        totalPredictions: 87643,
        previousPredictions: 81234,
        conversionRate: 8.5,
        previousConversionRate: 7.8,
        freeToPremiumRate: 12.3,
        totalTransactions: 1785,
        retentionRate: 85.2
      },
      predictions: {
        daily: 243,
        weekly: 1521,
        byType: ['love', 'career', 'finance', 'health']
      },
      platformStats: {
        web: {
          users: 8567,
          percentage: 68.5,
          avgSessionDuration: 425,
          bounceRate: 32.5
        },
        ios: {
          users: 3975,
          percentage: 31.5,
          avgSessionDuration: 520,
          bounceRate: 28.3
        }
      },
      deviceStats: {
        mobile: {
          users: 8932,
          percentage: 71.2
        },
        desktop: {
          users: 3610,
          percentage: 28.8
        }
      },
      predictionsByType: [
        { name: 'Love & Relationships', count: 24567, percentage: 28 },
        { name: 'Career & Business', count: 21876, percentage: 25 },
        { name: 'Finance & Wealth', count: 19765, percentage: 22.5 },
        { name: 'Health & Wellness', count: 15435, percentage: 17.6 },
        { name: 'General Predictions', count: 6000, percentage: 6.9 }
      ],
      topCountries: [
        { name: 'United States', code: 'US', users: 4235, percentage: 33.8, growth: 12.5 },
        { name: 'India', code: 'IN', users: 2876, percentage: 22.9, growth: 8.2 },
        { name: 'United Kingdom', code: 'UK', users: 1567, percentage: 12.5, growth: 15.3 },
        { name: 'Canada', code: 'CA', users: 987, percentage: 7.9, growth: 5.6 },
        { name: 'Australia', code: 'AU', users: 765, percentage: 6.1, growth: 9.8 },
        { name: 'Germany', code: 'DE', users: 543, percentage: 4.3, growth: 3.2 }
      ]
    };

    // Generate time series data based on time range
    const getDataPoints = (days) => {
      const data = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100) + 50
        });
      }
      return data;
    };

    // Adjust data based on time range
    let days = 7;
    switch (timeRange) {
      case '24h':
        days = 1;
        baseData.overview.newUsers = 85;
        baseData.predictions.daily = 243;
        break;
      case '30d':
        days = 30;
        baseData.overview.newUsers = 845;
        baseData.predictions.daily = 212;
        break;
      case '90d':
        days = 90;
        baseData.overview.newUsers = 2542;
        baseData.predictions.daily = 198;
        break;
      case '1y':
        days = 365;
        baseData.overview.newUsers = 15234;
        baseData.predictions.daily = 183;
        break;
    }

    return {
      ...baseData,
      userGrowth: getDataPoints(days),
      revenueTrend: getDataPoints(days).map(item => ({
        ...item,
        value: Math.floor(item.value * 10)
      }))
    };
  }
};