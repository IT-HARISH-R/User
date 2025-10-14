import React, { useState } from "react";

// ⚡ Add in index.html (inside <head>)
// <script src="https://code.responsivevoice.org/responsivevoice.js?key=YOUR_KEY_OPTIONAL"></script>

const VoiceAstro = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);

  // 🎙️ Voice to Text
  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "ta-IN"; // Tamil input
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 Voice input:", transcript);
      setText(transcript);
      setListening(false);

      // 👉 Instead of using transcript directly, you can modify or test it here
      // Example: testing fixed text or transforming before speak
      const testText = `Harish sonna text: ${transcript}`; // example
      setResponse(testText);

      // 🔊 Speak the modified text
      if (window.responsiveVoice) {
        window.responsiveVoice.speak(testText, "Tamil Female", { rate: 1 });
      } else {
        console.warn("ResponsiveVoice not loaded!");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🔮 Astro Voice Assistant</h1>

      <button
        onClick={startListening}
        disabled={listening}
        className={`px-5 py-3 rounded-xl text-lg ${
          listening ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {listening ? "🎧 Listening..." : "🎤 Start Voice Input"}
      </button>

      <div className="mt-6 text-center">
        <p className="text-gray-300">🗣️ You said: {text}</p>
        <p className="text-green-400 mt-2">✨ Prediction: {response}</p>
      </div>
    </div>
  );
};

export default VoiceAstro;
