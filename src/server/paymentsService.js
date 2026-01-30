import api from './axios';

export const paymentsService = {
  // Get payments with filters
  async getPayments(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all parameters
      if (params.dateRange) queryParams.append('dateRange', params.dateRange);
      if (params.status) queryParams.append('status', params.status);
      if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/api/payments/?${queryParams.toString()}`);
      console.log("getPayments data", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Get payment details by ID
  async getPaymentDetails(paymentId) {
    try {
      const response = await api.get(`/api/payments/${paymentId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(paymentId, action, reason = '') {
    try {
      const response = await api.post(`/api/payments/${paymentId}/update-status/`, 
        { action, reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Export payments
  async exportPayments(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.dateRange) queryParams.append('dateRange', params.dateRange);
      if (params.status) queryParams.append('status', params.status);
      if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
      if (params.search) queryParams.append('search', params.search);

      const response = await api.get(`/api/payments/export/?${queryParams.toString()}`);
      console.log("exportPayments: ",response.data)
      return response.data;
    } catch (error) {
      console.error('Error exporting payments:', error);
      throw error;
    }
  },

  // Get payment analytics
  async getPaymentAnalytics() {
    try {
      const response = await api.get('/api/payments/analytics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw error;
    }
  }
};