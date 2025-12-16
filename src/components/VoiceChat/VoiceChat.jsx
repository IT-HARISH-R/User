import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import astroServices from "../../server/astroServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);

  // Fetch chat list from backend
  const loadChatList = async () => {
    try {
      const res = await astroServices.getChats();
      setChatList(res);
    } catch (err) {
      console.error("Error loading chat list:", err);
    }
  };

  // Load a chat by id
  const openChat = async (chatId) => {
    try {
      setCurrentChatId(chatId);
      const res = await astroServices.getChatMessages(chatId);

      const formattedMessages = res.flatMap(msg => [
        ...(msg.user_text ? [{
          id: msg.id + '_user',
          type: "user",
          message: msg.user_text,
          timestamp: msg.created_at,
          isAudio: false,
        }] : []),
        ...(msg.ai_text ? [{
          id: msg.id + '_bot',
          type: "bot",
          message: msg.ai_text,
          timestamp: msg.created_at,
          isAudio: !!msg.tts_url,
          audioUrl: msg.tts_url,
        }] : [])
      ]);

      setChatHistory(formattedMessages);
      // Close sidebar on mobile when chat is opened
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      console.error("Error opening chat:", err);
      addMessage("bot", "❌ Error loading chat messages");
    }
  };

  // Create New Chat
  const createNewChat = () => {
    setCurrentChatId(null);
    setChatHistory([{
      id: 1,
      type: "bot",
      message: "🌟 Hello! I'm your cosmic astrology assistant! 🪐\n\nAsk me anything about your horoscope in Tamil. I can help you with:\n\n• Birth chart analysis\n• Planetary influences\n• Future insights\n• Love and career guidance",
      timestamp: new Date(),
      isAudio: false,
    }]);
    setUserInput("");
    // Close sidebar on mobile when new chat is created
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Delete chat
  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await astroServices.deleteChat(chatId);
      if (currentChatId === chatId) {
        createNewChat();
      }
      loadChatList();
    } catch (err) {
      console.error("Error deleting chat:", err);
      addMessage("bot", "❌ Error deleting chat");
    }
  };

  // Add message helper
  const addMessage = (type, message, audioUrl = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: new Date(),
      isAudio: !!audioUrl,
      audioUrl,
    };
    setChatHistory(prev => [...prev, newMessage]);
    return newMessage;
  };
  const user = useSelector((state) => state.auth.user);
  const nav = useNavigate()
  useEffect(() => {
    if (!user) {
      nav("/login")
    }
    loadChatList();
    createNewChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Text message sending
  const sendTextMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const text = userInput.trim();
    setUserInput("");

    // Add user message
    addMessage("user", text);

    setIsLoading(true);

    try {
      const formData = new FormData();
      const blob = new Blob([text], { type: 'text/plain' });
      formData.append("audio", blob, "text_input.txt");

      if (currentChatId) {
        formData.append("chat_id", currentChatId);
      }

      const response = await astroServices.sendVoice({ text: text });

      // Add bot response
      addMessage("bot", response.prediction, response.tts_audio_url);

      // Update chat list if new chat was created
      if (!currentChatId && response.chat_id) {
        setCurrentChatId(response.chat_id);
        setTimeout(loadChatList, 500);
      }

    } catch (err) {
      console.error("Send text error:", err);
      const errorMessage = err.response?.data?.error
        ? `❌ ${err.response.data.error}`
        : "❌ Error processing your message. Please try again.";
      addMessage("bot", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      setIsVoiceInput(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      addMessage("bot", "❌ Microphone access denied. Please allow microphone permissions.");
      setIsVoiceInput(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsVoiceInput(false);
    }
  };

  const sendAudio = async (audioFile) => {
    setIsLoading(true);

    // Add temporary user message
    const tempMessage = addMessage("user", "🎤 Recording your voice message...");

    try {
      const formData = new FormData();
      formData.append("audio", audioFile, "audio.webm");
      // formData.append("userInput", Text);

      if (currentChatId) {
        formData.append("chat_id", currentChatId);
      }

      const response = await astroServices.sendVoice(formData);

      // Update last user message with transcript
      setChatHistory(prev => {
        const updated = [...prev];
        const lastUserMsg = updated.findLast(msg => msg.id === tempMessage.id);
        if (lastUserMsg) {
          lastUserMsg.message = response.message || "🎤 Voice message";
        }
        return updated;
      });

      // Add bot response
      addMessage("bot", response.prediction, response.tts_audio_url);

      // Update chat list if new chat was created
      if (!currentChatId && response.chat_id) {
        setCurrentChatId(response.chat_id);
        setTimeout(loadChatList, 500);
      }

    } catch (err) {
      console.error("Send audio error:", err);
      const errorMessage = err.response?.data?.error
        ? `❌ ${err.response.data.error}`
        : "❌ Error processing your voice message. Please try again.";

      // Update the temporary message with error
      setChatHistory(prev => {
        const updated = [...prev];
        const lastUserMsg = updated.findLast(msg => msg.id === tempMessage.id);
        if (lastUserMsg) {
          lastUserMsg.message = errorMessage;
          lastUserMsg.type = "bot"; // Change to bot message for error
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle voice recording
  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Audio playback
  const playAudio = (audioUrl, messageId) => {
    if (!audioRef.current) return;

    // If clicking the same audio, toggle play/pause
    if (currentPlayingAudio === messageId) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop current audio and play new one
    if (audioRef.current.src) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current.src = audioUrl;
    setCurrentPlayingAudio(messageId);

    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error('Error playing audio:', error);
      setCurrentPlayingAudio(null);
      setIsPlaying(false);
    });

    audioRef.current.onended = () => {
      setCurrentPlayingAudio(null);
      setIsPlaying(false);
    };

    audioRef.current.onerror = () => {
      console.error('Audio playback error');
      setCurrentPlayingAudio(null);
      setIsPlaying(false);
    };
  };

  // Floating animation
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-20 left-10 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-sm opacity-40"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute bottom-40 right-16 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 blur-sm opacity-30"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 blur-sm opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/10" />
      </div>

      <audio ref={audioRef} className="hidden" />

      <div className="flex h-screen relative z-10 pt-16">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          chatList={chatList}
          currentChatId={currentChatId}
          openChat={openChat}
          deleteChat={deleteChat}
          createNewChat={createNewChat}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <ChatHeader
            currentChatId={currentChatId}
            toggleSidebar={toggleSidebar}
            createNewChat={createNewChat}
          />

          {/* Chat Messages */}
          <MessageList
            chatHistory={chatHistory}
            isLoading={isLoading}
            isVoiceInput={isVoiceInput}
            currentPlayingAudio={currentPlayingAudio}
            isPlaying={isPlaying}
            playAudio={playAudio}
            chatContainerRef={chatContainerRef}
          />

          {/* Input Area */}
          <InputArea
            userInput={userInput}
            setUserInput={setUserInput}
            sendTextMessage={sendTextMessage}
            isRecording={isRecording}
            isLoading={isLoading}
            toggleVoiceRecording={toggleVoiceRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;