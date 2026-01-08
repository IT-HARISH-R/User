import React, { useEffect, useState } from "react";
import {
  Loader2, Mail, User, Calendar, Search,
  Trash2, Reply, Archive, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  CheckCircle, XCircle, MessageSquare, RefreshCw, Clock,
} from "lucide-react";
import contactServices from "../../server/contactServices";

const ContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedInquiry, setExpandedInquiry] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReply, setCurrentReply] = useState({ id: null, email: "", subject: "" });
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    replied: 0,
    archived: 0
  });
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  // Fetch inquiries from backend
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await contactServices.getInquiries();
      console.log("API Response:", response);

      if (response) {
        // The response now comes directly as { data: [], stats: {} }
        let inquiriesData = [];
        let statsData = { total: 0, new: 0, replied: 0, archived: 0 };

        if (response.data && Array.isArray(response.data)) {
          inquiriesData = response.data;
          if (response.stats) {
            setStats(response.stats);
          } else {
            calculateStats(inquiriesData);
          }
        } else if (Array.isArray(response)) {
          // Fallback: if response is directly an array
          inquiriesData = response;
          calculateStats(inquiriesData);
        } else {
          console.error("Unexpected response structure:", response);
          setError("Unexpected data format received from server");
          return;
        }

        setInquiries(inquiriesData);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setError("Failed to load inquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!Array.isArray(data)) {
      console.error("calculateStats expected array but got:", data);
      return;
    }

    const total = data.length;
    const newCount = data.filter(i => !i.status || i.status === 'new').length;
    const repliedCount = data.filter(i => i.status === 'replied').length;
    const archivedCount = data.filter(i => i.status === 'archived').length;

    setStats({
      total,
      new: newCount,
      replied: repliedCount,
      archived: archivedCount
    });
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Filter and sort inquiries
  const filterAndSortInquiries = () => {
    if (!Array.isArray(inquiries)) {
      console.error("inquiries is not an array:", inquiries);
      return [];
    }

    return inquiries
      .filter((inquiry) => {
        const matchesSearch =
          inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inquiry.user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (inquiry.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || (inquiry.status || 'new') === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
          case "oldest":
            return new Date(a.created_at || 0) - new Date(b.created_at || 0);
          case "email":
            return (a.email || "").localeCompare(b.email || "");
          default:
            return 0;
        }
      });
  };

  // Get current inquiries for pagination
  const filteredInquiries = filterAndSortInquiries();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  // Handlers
  const handleMarkAsReplied = async (id) => {
    try {
      await contactServices.markAsReplied(id);
      fetchInquiries();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    }
  };

  const handleArchive = async (id) => {
    try {
      await contactServices.archiveInquiry(id);
      fetchInquiries();
    } catch (err) {
      console.error("Error archiving:", err);
      setError("Failed to archive inquiry");
    }
  };

  const handleDelete = async (id) => {
    const inquiry = inquiries.find(i => i.id === id);

    if (!window.confirm(`Are you sure you want to delete inquiry from ${inquiry?.name || inquiry?.email}?`)) {
      return;
    }

    try {
      await contactServices.deleteInquiry(id);
      fetchInquiries();
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      setError("Failed to delete inquiry");
    }
  };

  const handleReply = (inquiry) => {
    setCurrentReply({
      id: inquiry.id,
      email: inquiry.email,
      subject: `Re: ${inquiry.subject}`
    });
    setReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Please enter a reply message");
      return;
    }

    setSendingReply(true);
    setError("");

    try {
      // Send actual email through backend
      const emailData = {
        message: replyMessage,
        subject: currentReply.subject
      };

      const response = await contactServices.markAsRepliedWithEmail(currentReply.id, emailData);

      console.log("Email sent successfully:", response);

      // Show success message
      setError(""); // Clear any previous errors

      // Show success notification
      const successMsg = "Reply email sent successfully!";
      setError(successMsg);

      // Refresh inquiries list
      await fetchInquiries();

      // Close modal after delay
      setTimeout(() => {
        setReplyModalOpen(false);
        setReplyMessage("");
        setCurrentReply({ id: null, email: "", subject: "" });
        setError("");
      }, 1500);

    } catch (err) {
      console.error("Error sending reply:", err);

      // Extract error message from response
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send reply email";

      setError(`Error: ${errorMessage}`);

      // Don't close modal on error
    } finally {
      setSendingReply(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const actualStatus = status || 'new';
    const config = {
      new: { label: "New", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: "New" },
      replied: { label: "Replied", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: "✓" },
      archived: { label: "Archived", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200", icon: "📁" }
    };

    const { label, color } = config[actualStatus] || config.new;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }
    } catch (e) {
      return "Invalid date";
    }
  };

  // Get initial for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Get color for avatar based on email
  const getAvatarColor = (email) => {
    const colors = [
      "bg-gradient-to-r from-indigo-500 to-purple-500",
      "bg-gradient-to-r from-pink-500 to-rose-500",
      "bg-gradient-to-r from-green-500 to-emerald-500",
      "bg-gradient-to-r from-blue-500 to-cyan-500",
      "bg-gradient-to-r from-orange-500 to-red-500",
    ];
    const index = email ? email.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Debug: Log current state
  useEffect(() => {
    console.log("Current inquiries state:", inquiries);
  }, [inquiries]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contact Inquiries
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage and respond to customer messages
            </p>
          </div>
        </div>

        <button
          onClick={fetchInquiries}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl text-red-800 dark:text-red-300">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-90">Total Inquiries</div>
            </div>
            <Mail className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{stats.new}</div>
              <div className="text-sm opacity-90">New Messages</div>
            </div>
            <MessageSquare className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{stats.replied}</div>
              <div className="text-sm opacity-90">Replied</div>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{stats.archived}</div>
              <div className="text-sm opacity-90">Archived</div>
            </div>
            <Archive className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, subject, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="email">A → Z (Email)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin w-12 h-12 text-blue-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading inquiries...</p>
        </div>
      ) : !Array.isArray(inquiries) || inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <Mail className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No inquiries found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            No contact inquiries have been submitted yet.
          </p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>

          {/* Inquiries List */}
          <div className="space-y-4 mb-6">
            {currentItems.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedInquiry === inquiry.id
                  ? "border-blue-500 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-700"
                  } overflow-hidden transition-all duration-300 hover:shadow-md`}
              >
                {/* Inquiry Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: User Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 ${getAvatarColor(inquiry.email)} rounded-full flex items-center justify-center text-white font-bold`}>
                          {getInitial(inquiry.name)}
                        </div>
                        {inquiry.user && (
                          <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {inquiry.name || "Unknown"}
                          </h3>
                          <StatusBadge status={inquiry.status} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">{inquiry.email || "No email"}</span>
                          </div>

                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(inquiry.created_at)}</span>
                          </div>

                          {inquiry.user && (
                            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                              <User className="w-4 h-4" />
                              <span>{inquiry.user.username}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {inquiry.subject || "No subject"}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                            {inquiry.message || "No message"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReply(inquiry)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                        title="Reply"
                      >
                        <Reply className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleMarkAsReplied(inquiry.id)}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition"
                        title="Mark as Replied"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
                        className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedInquiry === inquiry.id ? "rotate-180" : ""
                          }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedInquiry === inquiry.id && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Message Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message Details
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {inquiry.message || "No message content"}
                          </p>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Received: {inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : "Unknown"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleReply(inquiry)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Reply className="w-4 h-4" />
                            Reply
                          </button>

                          <button
                            onClick={() => handleMarkAsReplied(inquiry.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Replied
                          </button>

                          <button
                            onClick={() => handleArchive(inquiry.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                            Archive
                          </button>

                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>

                        {/* User Info if available */}
                        {inquiry.user && (
                          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                              Registered User
                            </h5>
                            <div className="text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Username:</span>
                                <span className="font-medium">{inquiry.user.username}</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                <span className="font-medium">{inquiry.user.email}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredInquiries.length > itemsPerPage && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Results Info */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">
                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInquiries.length)}
                  </span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredInquiries.length}</span> inquiries
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 min-w-[40px] rounded-lg transition-colors ${currentPage === pageNum
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reply Modal */}
      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Send Email Reply</h3>
                <button
                  onClick={() => {
                    if (!sendingReply) {
                      setReplyModalOpen(false);
                      setReplyMessage("");
                      setCurrentReply({ id: null, email: "", subject: "" });
                      setError("");
                    }
                  }}
                  disabled={sendingReply}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Success/Error message inside modal */}
              {error && (
                <div className={`mb-4 p-3 rounded-lg ${error.includes("Error:")
                  ? "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                  : "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                  }`}>
                  <div className="flex items-center">
                    {error.includes("Error:") ? (
                      <XCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    <span className="text-sm">{error.replace("Error: ", "")}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To:
                  </label>
                  <input
                    type="email"
                    value={currentReply.email}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={currentReply.subject}
                    onChange={(e) => setCurrentReply(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Reply Message:
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Type your professional reply here..."
                    disabled={sendingReply}
                  />
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>• This will send an HTML email to the customer</p>
                  <p>• The inquiry status will automatically be marked as "Replied"</p>
                  <p>• You can include rich formatting using line breaks and paragraphs</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      if (!sendingReply) {
                        setReplyModalOpen(false);
                        setReplyMessage("");
                        setCurrentReply({ id: null, email: "", subject: "" });
                        setError("");
                      }
                    }}
                    disabled={sendingReply}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {sendingReply ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Sending Email...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Send Reply Email
                      </>
                    )}
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

export default ContactInquiries;