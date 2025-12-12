// Mock payments service - replace with real API calls
export const paymentsService = {
  getPayments: async (params = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { dateRange = '30d', page = 1, limit = 10 } = params;
    
    // Generate mock payments data
    const generateMockPayments = () => {
      const payments = [];
      const statuses = ['completed', 'pending', 'failed', 'processing', 'refunded'];
      const methods = ['card', 'paypal', 'stripe', 'razorpay', 'bank_transfer', 'wallet'];
      const plans = ['Premium Monthly', 'Premium Yearly', 'Basic Plan', 'Enterprise', 'Trial'];
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com' },
        { id: 5, name: 'Michael Brown', email: 'michael@example.com' },
        { id: 6, name: 'Emily Davis', email: 'emily@example.com' },
        { id: 7, name: 'David Wilson', email: 'david@example.com' },
        { id: 8, name: 'Lisa Miller', email: 'lisa@example.com' },
        { id: 9, name: 'James Taylor', email: 'james@example.com' },
        { id: 10, name: 'Jennifer Anderson', email: 'jennifer@example.com' }
      ];

      // Generate payments based on date range
      let days = 30;
      switch (dateRange) {
        case '7d': days = 7; break;
        case '90d': days = 90; break;
        case '1y': days = 365; break;
        case 'all': days = 730; break;
      }

      for (let i = 0; i < limit; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * days));
        
        const user = users[Math.floor(Math.random() * users.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const method = methods[Math.floor(Math.random() * methods.length)];
        const plan = plans[Math.floor(Math.random() * plans.length)];
        
        const baseAmount = Math.floor(Math.random() * 200) + 20;
        const tax = baseAmount * 0.1;
        const fee = baseAmount * 0.03;
        const totalAmount = baseAmount + tax + fee;

        payments.push({
          id: `txn_${Date.now()}_${i}`,
          transactionId: `TXN${1000 + i}${Math.floor(Math.random() * 1000)}`,
          user: { ...user },
          amount: totalAmount,
          baseAmount,
          tax,
          fee,
          currency: 'USD',
          status,
          method,
          plan,
          duration: plan.includes('Monthly') ? 'Monthly' : plan.includes('Yearly') ? 'Yearly' : 'One-time',
          date: date.toISOString(),
          createdAt: date.toISOString(),
          updatedAt: date.toISOString()
        });
      }

      return payments;
    };

    const payments = generateMockPayments();
    
    return {
      payments,
      pagination: {
        page,
        limit,
        total: 150,
        totalPages: Math.ceil(150 / limit)
      },
      summary: {
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
        completedAmount: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
        pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
        totalTransactions: payments.length,
        successRate: (payments.filter(p => p.status === 'completed').length / payments.length * 100).toFixed(1)
      }
    };
  },

  approvePayment: async (paymentId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Approved payment:', paymentId);
    return { success: true, message: 'Payment approved successfully' };
  },

  refundPayment: async (paymentId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Refunded payment:', paymentId, 'Amount:', amount);
    return { success: true, message: 'Refund processed successfully' };
  },

  exportPayments: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Exporting payments with params:', params);
    return { success: true, url: '/exports/payments.csv' };
  }
};