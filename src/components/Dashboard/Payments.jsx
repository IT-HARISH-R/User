import React, { useState, useEffect } from 'react';
import {
  DollarSign, CreditCard, Calendar, CheckCircle, XCircle,
  AlertCircle, Filter, Search, Download, Eye, MoreVertical,
  Loader2, RefreshCw, TrendingUp, TrendingDown, ExternalLink,
  Clock, User, Building, Smartphone, Globe, ChevronDown,
  FileText, Receipt, Shield, Lock, Unlock, Mail, Ban
} from 'lucide-react';
import { paymentsService } from '../../server/paymentsService';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [downloading, setDownloading] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(null);

  // Date range options
  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { value: 'refunded', label: 'Refunded', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
  ];

  // Payment method options
  const paymentMethodOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'card', label: 'Credit Card', icon: CreditCard },
    { value: 'paypal', label: 'PayPal', icon: Building },
    { value: 'stripe', label: 'Stripe', icon: CreditCard },
    { value: 'razorpay', label: 'Razorpay', icon: Building },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Building },
    { value: 'wallet', label: 'Wallet', icon: CreditCard }
  ];

  // Fetch payments data
  const fetchPayments = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const data = await paymentsService.getPayments({
        dateRange,
        page: currentPage,
        limit: paymentsPerPage,
        status: statusFilter,
        paymentMethod: paymentMethodFilter,
        search: searchTerm
      });

      // FIX: Check if data exists and has payments array
      setPayments(data.payments || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }

    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments data. Please try again.');
      setPayments([]); // Set to empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [dateRange, currentPage, statusFilter, paymentMethodFilter]);

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount && amount !== 0) return `$0.00`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
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
        hour12: true
      });
    } catch (e) {
      return 'Invalid time';
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${option.color}`}>
        {status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
        {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'processing' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
        {option.label}
      </span>
    );
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    const option = paymentMethodOptions.find(opt => opt.value === method);
    if (!option || !option.icon) return <CreditCard className="w-4 h-4" />;
    const Icon = option.icon;
    return <Icon className="w-4 h-4" />;
  };

  // Calculate summary stats - FIXED: Add null check
  const calculateStats = () => {
    if (!payments || payments.length === 0) {
      return {
        totalAmount: 0,
        totalCompleted: 0,
        totalTransactions: 0,
        completedCount: 0,
        pendingCount: 0,
        failedCount: 0,
        successRate: 0,
        avgTransaction: 0
      };
    }

    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalCompleted = completedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'processing');
    const failedPayments = payments.filter(p => p.status === 'failed');

    return {
      totalAmount,
      totalCompleted,
      totalTransactions: payments.length,
      completedCount: completedPayments.length,
      pendingCount: pendingPayments.length,
      failedCount: failedPayments.length,
      successRate: payments.length > 0 ? (completedPayments.length / payments.length * 100).toFixed(1) : 0
    };
  };

  // Filter payments - FIXED: Add null check
  const filteredPayments = (payments || []).filter(payment => {
    const matchesSearch =
      searchTerm === '' ||
      (payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = paymentMethodFilter === 'all' || payment.method === paymentMethodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = calculateStats();






  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
  };

  // Handle download invoice
  const handleDownloadInvoice = async (payment) => {
    try {
      // Create invoice data
      const invoiceData = {
        invoiceNumber: `INV-${payment.id}-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        paymentId: payment.id,
        transactionId: payment.transaction_id,
        customer: payment.user?.username || 'Customer',
        customerEmail: payment.user?.email || '',
        plan: payment.plan?.name || 'N/A',
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: paymentMethodOptions.find(m => m.value === payment.method)?.label || payment.method,
        paymentDate: formatDate(payment.date),
        paymentTime: formatTime(payment.date)
      };

      // Create HTML invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company-info h1 { color: #4f46e5; margin: 0; }
            .invoice-info { text-align: right; }
            .invoice-details { margin: 30px 0; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { font-weight: bold; width: 200px; }
            .amount { font-size: 24px; font-weight: bold; color: #4f46e5; text-align: right; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-info">
                <h1>Astroverse</h1>
                <p>Payment Invoice</p>
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <p>${invoiceData.invoiceNumber}</p>
                <p>Date: ${invoiceData.date}</p>
              </div>
            </div>
            
            <div class="invoice-details">
              <div class="detail-row">
                <div class="detail-label">Payment ID:</div>
                <div>${invoiceData.paymentId}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Transaction ID:</div>
                <div>${invoiceData.transactionId}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Customer Name:</div>
                <div>${invoiceData.customer}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Customer Email:</div>
                <div>${invoiceData.customerEmail}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Plan:</div>
                <div>${invoiceData.plan}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Payment Method:</div>
                <div>${invoiceData.paymentMethod}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Payment Date:</div>
                <div>${invoiceData.paymentDate} ${invoiceData.paymentTime}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div>${invoiceData.status.toUpperCase()}</div>
              </div>
            </div>
            
            <div class="amount">
              Total Amount: ${formatCurrency(invoiceData.amount, invoiceData.currency)}
            </div>
            
            <div class="footer">
              <p>Thank you for your payment!</p>
              <p>This is a computer-generated invoice and does not require a signature.</p>
              <p>For any queries, contact: support@astroverse.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceData.invoiceNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError('Failed to download invoice');
    }
  };

  // Handle export payments
  const handleExportPayments = async () => {
    try {
      setDownloading(true);
      const exportData = await paymentsService.exportPayments({
        dateRange,
        status: statusFilter,
        paymentMethod: paymentMethodFilter,
        search: searchTerm
      });

      // Convert to CSV
      const headers = [
        'Transaction ID',
        'User',
        'Email',
        'Plan',
        'Amount',
        'Currency',
        'Payment Method',
        'Status',
        'Date',
        'Gateway Payment ID'
      ];

      const csvRows = [
        headers.join(','),
        ...exportData.data.map(item => [
          `"${item['Transaction ID']}"`,
          `"${item['User']}"`,
          `"${item['Email']}"`,
          `"${item['Plan']}"`,
          item['Amount'],
          `"${item['Currency']}"`,
          `"${item['Payment Method']}"`,
          `"${item['Status']}"`,
          `"${item['Date']}"`,
          `"${item['Gateway Payment ID']}"`
        ].join(','))
      ];

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `payments-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Error exporting payments:', err);
      setError('Failed to export payments');
    } finally {
      setDownloading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchPayments();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 text-center max-w-md mb-4">{error}</p>
        <button
          onClick={fetchPayments}
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage transactions, refunds, and payment processing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPayments}
            disabled={downloading || payments.length === 0}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export Report</span>
              </>
            )}
          </button>
          <button
            onClick={fetchPayments}
            disabled={refreshing}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(stats.totalCompleted)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalTransactions}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
                  {stats.completedCount} completed
                </span>
                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                  {stats.pendingCount} pending
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.successRate}%
              </p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Avg. Transaction Value */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Transaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(stats.totalTransactions > 0 ? stats.totalAmount / stats.totalTransactions : 0)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Highest: {formatCurrency(199)}</span>
                <span>•</span>
                <span>Lowest: {formatCurrency(9.99)}</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, email, transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Date Range */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredPayments.length} transactions
              </span>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No transactions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No transactions recorded yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 sm:px-6 py-3 font-medium">Transaction</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">User</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Amount</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Method</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Date</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {payment.transaction_id || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.plan?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {payment.user?.username || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {payment.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.duration || 'One-time'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded">
                          {getPaymentMethodIcon(payment.method)}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {paymentMethodOptions.find(m => m.value === payment.method)?.label || payment.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(payment.date)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(payment.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-300">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Payment Details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transaction ID: {selectedPayment.transaction_id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Payment Information */}
              <div className="space-y-6">
                {/* Amount & Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedPayment.plan?.name}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Name</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedPayment.user?.username || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Email</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedPayment.user?.email || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">User ID</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedPayment.user?.id || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(selectedPayment.method)}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {paymentMethodOptions.find(m => m.value === selectedPayment.method)?.label || selectedPayment.method}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Date & Time</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedPayment.date)} {formatTime(selectedPayment.date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Duration</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedPayment.duration || 'One-time'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transaction Details
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Base Amount</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(selectedPayment.amount * 0.9, selectedPayment.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Tax</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(selectedPayment.amount * 0.05, selectedPayment.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Processing Fee</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(selectedPayment.amount * 0.05, selectedPayment.currency)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-900 dark:text-white">Total Amount</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>



                  {/* Download Invoice button */}
                  <button
                    onClick={() => handleDownloadInvoice(selectedPayment)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;