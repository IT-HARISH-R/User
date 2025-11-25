import React from "react";
import { motion } from "framer-motion";
import { LuUser, LuBot, LuPlay, LuPause } from "react-icons/lu";

const MessageBubble = ({ chat, currentPlayingAudio, isPlaying, playAudio }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 lg:gap-4 mb-4 lg:mb-6 ${chat.type === "user" ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-8 h-8 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          chat.type === "user" 
            ? "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/25" 
            : "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/25"
        }`}
      >
        {chat.type === "user" ? 
          <LuUser size={14} className="text-white lg:w-5 lg:h-5" /> : 
          <LuBot size={14} className="text-white lg:w-5 lg:h-5" />
        }
      </motion.div>

      {/* Message Bubble */}
      <div className={`max-w-[85%] lg:max-w-[70%] ${chat.type === "user" ? "text-right" : ""}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`px-4 py-3 lg:px-6 lg:py-4 rounded-3xl backdrop-blur-sm ${
            chat.type === "user"
              ? "bg-gradient-to-br from-blue-600/80 to-cyan-600/80 rounded-br-md shadow-lg shadow-blue-500/20"
              : "bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-bl-md border border-purple-500/20 shadow-lg shadow-purple-500/10"
          }`}
        >
          <p className="text-xs lg:text-sm whitespace-pre-wrap leading-relaxed">
            {chat.message}
          </p>

          {/* Audio Playback Controls */}
          {chat.isAudio && chat.audioUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 lg:mt-4 flex items-center gap-2 lg:gap-3"
            >
              <button
                onClick={() => playAudio(chat.audioUrl, chat.id)}
                className={`flex items-center gap-2 lg:gap-3 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm transition-all backdrop-blur-sm ${
                  currentPlayingAudio === chat.id && isPlaying
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-105 shadow-lg shadow-purple-500/25"
                    : "bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-500/15"
                }`}
              >
                {currentPlayingAudio === chat.id && isPlaying ? (
                  <>
                    <LuPause size={12} className="lg:w-3.5 lg:h-3.5" />
                    <span className="hidden xs:inline">Pause Audio</span>
                  </>
                ) : (
                  <>
                    <LuPlay size={12} className="lg:w-3.5 lg:h-3.5" />
                    <span className="hidden xs:inline">Play Audio</span>
                  </>
                )}
              </button>
              
              {currentPlayingAudio === chat.id && (
                <span className="text-xs text-purple-300 font-medium hidden sm:inline">
                  {isPlaying ? "🔊 Playing..." : "⏸️ Paused"}
                </span>
              )}
            </motion.div>
          )}
        </motion.div>
        
        {/* Timestamp */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-xs text-gray-400 mt-1 lg:mt-2 ${chat.type === "user" ? "text-right" : ""}`}
        >
          {formatTime(chat.timestamp)}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;