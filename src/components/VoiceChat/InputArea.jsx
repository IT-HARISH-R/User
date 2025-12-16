import React from "react";
import { motion } from "framer-motion";
import { LuMic, LuMicOff, LuSend } from "react-icons/lu";

const InputArea = ({
  userInput,
  setUserInput,
  sendTextMessage,
  isRecording,
  isLoading,
  toggleVoiceRecording
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className=" bg-slate-900/40 backdrop-blur-sm p-4 lg:p-6"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Text Input with Send and Voice Buttons */}
        <div className="flex gap-3 mb-3 lg:mb-4">
          <div className="flex-1 relative items-center">
            <motion.textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your astrology question in Tamil or use voice input..."
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 pr-20 lg:pr-28 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 text-sm lg:text-base min-h-[60px] max-h-[120px] scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-600"
              rows="2"
              disabled={isLoading || isRecording}
              whileFocus={{ scale: 1.02 }}
            />

            {/* Action Buttons Container */}
            <div className="absolute right-2 lg:right-3 bottom-2 lg:bottom-3 flex gap-2">
              {/* Voice Record Button */}
              <motion.button
                onClick={toggleVoiceRecording}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-xl transition-all duration-300 shadow-lg ${isRecording
                    ? "bg-gradient-to-r from-red-600 to-pink-600 animate-pulse shadow-red-500/25"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/25"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isRecording ? "Stop Recording" : "Start Voice Recording"}
              >
                {isRecording ? (
                  <LuMicOff size={18} className="text-white" />
                ) : (
                  <LuMic size={18} className="text-white" />
                )}
              </motion.button>

              {/* Send Button */}
              <motion.button
                onClick={sendTextMessage}
                disabled={!userInput.trim() || isLoading || isRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25"
                title="Send Message"
              >
                <LuSend size={18} className="text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-300 text-sm font-medium">
              Recording... Click microphone to stop
            </span>
          </motion.div>
        )}

        {/* Input Instructions */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            💡 Press Enter to send • Shift+Enter for new line • Click microphone for voice input
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InputArea;