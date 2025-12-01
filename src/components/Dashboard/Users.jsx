import React, { useEffect, useState } from "react";
import {
  Loader2, User, Mail, Calendar, Search, Filter, Edit,
  Trash2, Shield, ShieldOff, ChevronDown, Eye, Crown,
  CreditCard, MapPin, Globe, Star, MoreVertical, CheckCircle,
  XCircle, Smartphone, RefreshCw, Activity, ChevronLeft,
  ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react";
import authServices from "../../server/authServices";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedUser, setExpandedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1); 

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authServices.getAllUser();
      if (response?.data) {
        setUsers(response.data);
        // Calculate total pages
        const totalFiltered = filterAndSortUsers(response.data).length;
        setTotalPages(Math.ceil(totalFiltered / usersPerPage));
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filterAndSortUsers = (userList = users) => {
    return userList
      .filter((user) => {
        const matchesSearch =
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
          roleFilter === "all" || user.role === roleFilter;

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "premium" && user.is_premium) ||
          (statusFilter === "free" && !user.is_premium);

        const matchesPlan =
          planFilter === "all" || user.plan_type === planFilter;

        return matchesSearch && matchesRole && matchesStatus && matchesPlan;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.date_joined) - new Date(a.date_joined);
          case "oldest":
            return new Date(a.date_joined) - new Date(b.date_joined);
          case "name":
            return (a.username || "").localeCompare(b.username || "");
          case "predictions":
            return (b.predictions?.length || 0) - (a.predictions?.length || 0);
          default:
            return 0;
        }
      });
  };

  // Get current users for the current page
  const filteredUsers = filterAndSortUsers();
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Update total pages when filters change
  useEffect(() => {
    const totalFiltered = filteredUsers.length;
    setTotalPages(Math.ceil(totalFiltered / usersPerPage));
    
    // Reset to page 1 if current page doesn't exist
    if (currentPage > Math.ceil(totalFiltered / usersPerPage) && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, usersPerPage, currentPage]);

  // Handlers
  const handleToggleSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(u => u._id || u.id));
    }
  };

  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    // Implement edit functionality
  };

  const handleToggleRole = (user) => {
    console.log("Toggle role for:", user);
    // Implement role toggle
  };

  const handleTogglePremium = (user) => {
    console.log("Toggle premium for:", user);
    // Implement premium toggle
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 4 pages and last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page and last 4 pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show pages around current page
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const getPredictionsCount = (user) => {
    return user.predictions?.length || 0;
  };

  const getAge = (user) => {
    if (!user.birth_year) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - user.birth_year;
  };

  // Generate a unique ID for each user if not present
  const getUserId = (user, idx) => {
    return user._id || user.id || `user-${idx}`;
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage user accounts, roles, and subscriptions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {users.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Users</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {users.filter(u => u.is_premium).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Premium</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {users.filter(u => u.role === "admin").length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Admins</div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {selectedUsers.length === currentUsers.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Plans</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">A → Z</option>
            <option value="predictions">Most Predictions</option>
          </select>

          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <User className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            {searchTerm || roleFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "No users have been added yet."}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setStatusFilter("all");
              setPlanFilter("all");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* User Cards/Table */}
          <div className="space-y-4">
            {currentUsers.map((user, idx) => {
              const userId = getUserId(user, idx);
              const isExpanded = expandedUser === userId;

              return (
                <div
                  key={userId}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${isExpanded
                      ? "border-indigo-500 dark:border-indigo-400"
                      : "border-gray-200 dark:border-gray-700"
                    } overflow-hidden transition-all duration-300 hover:shadow-md`}
                >
                  {/* User Header */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: User Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center relative">
                            {user.profile_image ? (
                              <img
                                src={user.profile_image}
                                alt={user.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-7 h-7 text-white" />
                            )}
                            {user.is_premium && (
                              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                <Crown className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {user.username || "Unnamed User"}
                            </h3>
                            {user.is_premium && (
                              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-full">
                                PREMIUM
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4" />
                              <span className="truncate max-w-[200px]">{user.email}</span>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {user.date_joined
                                  ? new Date(user.date_joined).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                  : "N/A"}
                              </span>
                            </div>

                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}>
                              {user.role?.toUpperCase() || "USER"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Stats and Actions */}
                      <div className="flex items-center gap-4">
                        {/* Quick Stats */}
                        <div className="hidden md:flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {getPredictionsCount(user)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Predictions</div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {getAge(user)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Age</div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {user.language?.toUpperCase() || "EN"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Language</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedUser(isExpanded ? null : userId)}
                            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition"
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""
                              }`} />
                          </button>

                          <button
                            onClick={() => handleTogglePremium(user)}
                            className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-lg transition"
                          >
                            {user.is_premium ? <Star className="w-5 h-5 fill-yellow-400" /> : <Star className="w-5 h-5" />}
                          </button>

                          <button
                            onClick={() => handleToggleRole(user)}
                            className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition"
                          >
                            {user.role === "admin" ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                          </button>

                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Personal Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Full Name</span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {user.first_name || user.last_name
                                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                  : 'Not Provided'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Birth Date</span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {user.birth_day && user.birth_month && user.birth_year
                                  ? `${user.birth_day}/${user.birth_month}/${user.birth_year}`
                                  : 'Not Provided'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Birth Time</span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {user.birth_hour && user.birth_minute
                                  ? `${user.birth_hour}:${user.birth_minute.toString().padStart(2, '0')}`
                                  : 'Not Provided'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Location & Plan */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location & Plan
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-500 dark:text-gray-400">Location</span>
                              <span className="text-gray-900 dark:text-white font-medium break-words">
                                {user.birth_place || 'Not Provided'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Language</span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {user.language?.toUpperCase() || 'EN'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Plan Type</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${user.plan_type === 'premium'
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}>
                                {user.plan_type?.toUpperCase() || 'FREE'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Activity Statistics
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                {getPredictionsCount(user)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Predictions</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {user.last_active ? 'Active' : 'Inactive'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                            </div>
                          </div>
                          <button className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                            View Full Activity
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Enhanced Pagination */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Results Info */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">
                  {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)}
                </span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredUsers.length}</span> users
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 min-w-[40px] rounded-lg transition-colors ${currentPage === pageNum
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Page */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>

              {/* Page Size Selector (Optional) */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Rows per page:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{usersPerPage}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{filteredUsers.length}</div>
              <div className="text-sm opacity-90">Filtered Users</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">
                {filteredUsers.filter(u => u.is_premium).length}
              </div>
              <div className="text-sm opacity-90">Premium Users</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">
                {filteredUsers.reduce((sum, user) => sum + getPredictionsCount(user), 0)}
              </div>
              <div className="text-sm opacity-90">Total Predictions</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;