import axios from "axios";

const API_KEY = "YOUR_SARVAM_API_KEY";

export const textToSpeech = async (text) => {
  try {
    const response = await axios.post(
      "https://api.sarvam.ai/text-to-speech",
      {
        text,
        voice: "meera",
        language: "en"
      },
      {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.audioUrl;
  } catch (err) {
    console.error("TTS ERROR:", err);
    return null;
  }
};

export const speechToText = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");

    const response = await axios.post(
      "https://api.sarvam.ai/speech-to-text",
      formData,
      {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data.text;
  } catch (err) {
    console.error("STT ERROR:", err);
    return null;
  }
};
