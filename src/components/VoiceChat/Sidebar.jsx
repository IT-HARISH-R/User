import React from "react";
import { motion } from "framer-motion";
import { LuSparkles, LuMessageSquare, LuTrash2, LuPlus, LuX } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ 
  isSidebarOpen, 
  toggleSidebar, 
  chatList, 
  currentChatId, 
  openChat, 
  deleteChat, 
  createNewChat 
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ 
        x: isSidebarOpen ? 0 : -100, 
        opacity: isSidebarOpen ? 1 : 0 
      }}
      transition={{ duration: 0.3 }}
      className={`w-80 lg:w-80 bg-slate-800/90 backdrop-blur-xl border-r border-purple-500/20 flex flex-col fixed lg:relative z-50 h-full ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300`}
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50" />
              <LuSparkles className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-400 relative z-10" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Astro Chat
              </h1>
              <p className="text-xs text-gray-400">Cosmic Conversations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors border border-purple-500/20"
              title="Home"
            >
              <FaHome size={14} className="text-gray-300 lg:w-4 lg:h-4" />
            </Link>
            <button
              onClick={createNewChat}
              className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all transform hover:scale-105"
              title="New Chat"
            >
              <LuPlus size={14} className="text-white lg:w-4 lg:h-4" />
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors border border-purple-500/20 lg:hidden"
            >
              <LuX size={14} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4">
        {chatList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 py-8 lg:py-12"
          >
            <LuMessageSquare size={32} className="mx-auto mb-3 lg:mb-4 opacity-30 lg:w-12 lg:h-12" />
            <p className="text-base lg:text-lg mb-2">No chats yet</p>
            <p className="text-xs lg:text-sm">Start your cosmic journey!</p>
          </motion.div>
        ) : (
          chatList.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => openChat(chat.id)}
              className={`p-3 lg:p-4 rounded-xl cursor-pointer transition-all group relative mb-2 lg:mb-3 backdrop-blur-sm ${
                chat.id === currentChatId
                  ? "bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-400/50 shadow-lg shadow-purple-500/20"
                  : "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-purple-400/30"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-sm lg:text-base mb-1">
                    {chat.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {formatDate(chat.created_at)}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all"
                  title="Delete chat"
                >
                  <LuTrash2 size={12} className="text-red-400 lg:w-3.5 lg:h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;