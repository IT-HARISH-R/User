import React from "react";
import { motion } from "framer-motion";
import { LuBot } from "react-icons/lu";

const LoadingIndicator = ({ isVoiceInput }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex  gap-3 lg:gap-4 mb-4 lg:mb-6"
    >
      <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 flex-shrink-0">
        <LuBot size={14} className="text-white lg:w-5 lg:h-5" />
      </div>
      <div className="max-w-[85%] lg:max-w-[70%]">
        <div className="px-4 py-3 lg:px-6 lg:py-4 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-bl-md border border-purple-500/20 shadow-lg shadow-purple-500/10">
          <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-300">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-medium">
              {isVoiceInput ? "Processing your voice..." : "Consulting the stars..."}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingIndicator;