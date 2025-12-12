import api from "./axios";

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('api/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async () => {
    try {
      const response = await api.get('api/dashboard/recent-activities/');
      console.log("Get recent activities", response)
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async () => {
    try {
      const response = await api.get('api/dashboard/revenue-analytics/');
      console.log("Get revenue analytics", response)
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  },

  // Get subscription plans
  getSubscriptionPlans: async () => {
    try {
      const response = await api.get('subscriptions/plans/');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Get all subscriptions (admin only)
  getAllSubscriptions: async () => {
    try {
      const response = await api.get('subscriptions/admin/subscriptions/');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  // Get all payments (admin only)
  getAllPayments: async () => {
    try {
      const response = await api.get('subscriptions/admin/payments/');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }
};