import React from "react";
import { motion } from "framer-motion";
import { LuMenu, LuPlus } from "react-icons/lu";

const ChatHeader = ({ currentChatId, toggleSidebar, createNewChat }) => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-800/80 backdrop-blur-xl border-b border-purple-500/20 p-4 lg:p-6"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors border border-purple-500/20 lg:hidden"
            >
              <LuMenu size={16} className="text-gray-300" />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {currentChatId ? "Cosmic Conversation ✨" : "New Chat"}
              </h2>
              <p className="text-gray-400 text-xs lg:text-sm mt-1">
                Ask your astrology questions in Tamil
              </p>
            </div>
          </div>
          <button
            onClick={createNewChat}
            className="lg:hidden p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all transform hover:scale-105"
            title="New Chat"
          >
            <LuPlus size={16} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;