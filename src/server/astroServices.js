// File: src/server/astroServices.js
import api from "./axios";

const astroServices = {
  getPrediction: async (data) => {
    try {
      const res = await api.post("data/compute/", data);
      return res.data;
    } catch (err) {
      console.error("Astro API error:", err.response?.data || err.message);
      throw err;
    }
  },

  // ------------------------------------------------
  // 1. VOICE CHAT API  (POST /chat/)
  // ------------------------------------------------
  sendVoice: async (formData) => {
    try {
      console.log(formData)
      const res = await api.post("voice/chat/", formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        timeout: 30000,
      });
      return res.data;
    } catch (err) {
      console.error("Voice API error:", err);
      throw err;
    }
  },

  // ------------------------------------------------
  // 2. CHAT LIST  (GET /chat/list/)
  // ------------------------------------------------
  getChats: async () => {
    try {
      const res = await api.get("voice/chat/list/");
      return res.data;
    } catch (err) {
      console.error("Get chats error:", err);
      throw err;
    }
  },

  // ------------------------------------------------
  // 3. CHAT MESSAGES  (GET /chat/<id>/messages/)
  // ------------------------------------------------
  getChatMessages: async (chatId) => {
    try {
      const res = await api.get(`voice/chat/${chatId}/messages/`);
      return res.data;
    } catch (err) {
      console.error("Get chat messages error:", err);
      throw err;
    }
  },

  // ------------------------------------------------
  // 4. DELETE CHAT (OPTIONAL — if you add backend delete)
  // ------------------------------------------------
  deleteChat: async (chatId) => {
    try {
      const res = await api.delete(`voice/chat/${chatId}/`);
      return res.data;
    } catch (err) {
      console.error("Delete chat error:", err);
      throw err;
    }
  },
};

export default astroServices;
