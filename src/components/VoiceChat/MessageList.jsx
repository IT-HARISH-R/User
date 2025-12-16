import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";

const MessageList = ({ 
  chatHistory, 
  isLoading, 
  isVoiceInput, 
  currentPlayingAudio, 
  isPlaying, 
  playAudio, 
  chatContainerRef 
}) => {
  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-3  lg:p-6 bg-slate-900/40 backdrop-blur-sm"
    >
      <div className="max-w-4xl mx-auto w-full pt-10">
        <AnimatePresence>
          {chatHistory.map((chat) => (
            <MessageBubble
              key={chat.id}
              chat={chat}
              currentPlayingAudio={currentPlayingAudio}
              isPlaying={isPlaying}
              playAudio={playAudio}
            />
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <LoadingIndicator isVoiceInput={isVoiceInput} />
        )}
      </div>
    </div>
  );
};

export default MessageList;