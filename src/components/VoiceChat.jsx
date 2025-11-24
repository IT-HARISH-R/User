// File: src/components/VoiceChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuMic, LuMicOff, LuSend, LuUser, LuBot, LuVolume2 } from 'react-icons/lu';
import astroServices from '../server/astroServices';
import { textToSpeech } from '../server/sarvam';

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const chatContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    setChatHistory([
      {
        id: 1,
        type: 'bot',
        message: "Hello! I'm your astrology assistant. Ask me anything!",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        sendAudio(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) sendAudio(file);
  };

  const sendAudio = async (audioFile) => {
    setIsLoading(true);

    setChatHistory(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      message: '🎤 Voice message',
      timestamp: new Date(),
      isAudio: false
    }]);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile, "audio.webm");

      // Backend call - expecting JSON response with tts_audio_url
      const response = await astroServices.sendVoice(formData);

      const aiText = response.message || response.prediction;
      const audioUrl = response.tts_audio_url;

      // Add bot message with audio URL
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        message: aiText,
        timestamp: new Date(),
        isAudio: true,
        audioUrl: audioUrl // This is the URL from backend
      }]);

    } catch (err) {
      console.error("SEND AUDIO ERROR:", err);
      // Add error message to chat
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        message: "Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
        isAudio: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (url) => {
    if (!audioRef.current) return;
    
    // Stop any currently playing audio
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    
    // Set new audio source
    audioRef.current.src = url;
    
    // Play the audio
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    
    // Handle when audio ends
    audioRef.current.onended = () => {
      setIsPlaying(false);
    };
    
    // Handle errors during playback
    audioRef.current.onerror = () => {
      console.error('Audio playback error');
      setIsPlaying(false);
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        className="hidden" 
        preload="auto"
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          Cosmic Voice Assistant
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-full hidden lg:block">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><LuBot /> Chat History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {chatHistory.filter(m => m.type === 'bot').map(m => (
                <div key={m.id} className="p-3 bg-white/5 rounded-lg text-sm border border-white/10 line-clamp-2 cursor-pointer">
                  {m.message}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div ref={chatContainerRef} className="bg-white/5 rounded-2xl border border-white/10 p-6 h-96 overflow-y-auto">
              <AnimatePresence>
                {chatHistory.map((chat) => (
                  <motion.div key={chat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 mb-4 ${chat.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${chat.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                      {chat.type === 'user' ? <LuUser /> : <LuBot />}
                    </div>

                    <div className="max-w-[80%]">
                      <div className={`px-4 py-2 rounded-2xl ${chat.type === 'user' ? 'bg-blue-600' : 'bg-white/10'}`}>
                        <p className="text-sm">{chat.message}</p>

                        {chat.isAudio && chat.audioUrl && (
                          <div className="mt-2 flex items-center gap-2">
                            <button 
                              onClick={() => isPlaying ? stopAudio() : playAudio(chat.audioUrl)}
                              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-full text-xs transition-colors"
                            >
                              {isPlaying ? (
                                <>
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                  Stop Audio
                                </>
                              ) : (
                                <>
                                  <LuVolume2 size={12} /> 
                                  Play Audio
                                </>
                              )}
                            </button>
                            {isPlaying && (
                              <span className="text-xs text-gray-400">Playing...</span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(new Date(chat.timestamp))}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500">
                    <LuBot />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="px-4 py-2 rounded-2xl bg-white/10">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        Processing your voice message...
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button 
                onClick={isRecording ? stopRecording : startRecording} 
                className={`p-4 rounded-full transition-all ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'}`}
                disabled={isLoading}
              >
                {isRecording ? <LuMicOff size={22} /> : <LuMic size={22} />}
              </button>

              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileUpload} 
                className="hidden" 
                id="audioUpload" 
                disabled={isLoading}
              />
              <label 
                htmlFor="audioUpload" 
                className={`px-4 py-2 rounded-xl border cursor-pointer transition-colors ${isLoading ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
              >
                Upload Audio
              </label>

              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;