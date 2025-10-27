import React, { useEffect, useState } from "react";

import {
  Loader2, User, Mail, Calendar, Search, Filter, Edit, Trash2, Shield, ShieldOff
} from "lucide-react";
import authServices from "../../server/authServices";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await authServices.getAllUser();
      if (response?.data) setUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Action handlers
  const handleEditUser = (u) => console.log("Edit", u);
  const handleDeleteUser = (u) => { if(window.confirm(`Delete ${u.username}?`)) console.log("Delete", u); };
  const handleToggleRole = (u) => console.log("Toggle role", u);

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
        {/* <Navbar /> */}

        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your team members and accounts</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{users.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400 mt-2" />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                {/* <option value="user">User</option>
                <option value="moderator">Moderator</option> */}
              </select>
            </div>
          </div>

          {/* Loader */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {searchTerm || roleFilter !== "all" ? "Adjust your search or filter." : "No users added yet."}
              </p>
            </div>
          ) : (
            // Responsive Table / Card
            <div className="space-y-4">
              {filteredUsers.map((user, idx) => (
                <div key={user._id || idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:flex sm:items-center sm:justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">{user.username || user.name || "Unnamed User"}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email || "No email"}</div>
                    </div>
                  </div>

                  {/* Role & Joined */}
                  <div className="flex items-center gap-4 mt-2 sm:mt-0 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                      user.role === "moderator" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                      "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                    </span>

                    <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'}) : "N/A"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2 sm:mt-0 justify-end flex-wrap">
                    <button onClick={() => handleToggleRole(user)} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition">
                      {user.role === "admin" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleEditUser(user)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteUser(user)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
