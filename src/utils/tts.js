// src/utils/tts.js
// Simple TTS helper using the browser SpeechSynthesis API.
// Exports: isSupported(), speak(text, opts), stop(), getVoices()

/**
 * Check if SpeechSynthesis API is supported
 */
export function isSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let _voices = [];
let _voicesLoaded = false;

function loadVoices() {
  return new Promise((resolve) => {
    if (_voicesLoaded && _voices.length) return resolve(_voices);
    const synth = window.speechSynthesis;

    const tryLoad = () => {
      _voices = synth.getVoices() || [];
      if (_voices.length) {
        _voicesLoaded = true;
        resolve(_voices);
      } else {
        // some browsers populate voices asynchronously
        setTimeout(() => {
          _voices = synth.getVoices() || [];
          _voicesLoaded = _voices.length > 0;
          resolve(_voices);
        }, 100);
      }
    };

    tryLoad();

    // Also listen for the voiceschanged event
    synth.onvoiceschanged = () => {
      _voices = synth.getVoices() || [];
      _voicesLoaded = _voices.length > 0;
      resolve(_voices);
    };
  });
}

/**
 * Speak text with TTS
 * @param {string} text - The text to speak
 * @param {Object} opts - Options
 * @param {string} [opts.lang] - Language code (e.g. 'en-US', 'ta-IN')
 * @param {string} [opts.voice] - Specific voice name
 * @param {number} [opts.rate=1] - Speaking rate (0.1 - 10)
 * @param {number} [opts.pitch=1] - Pitch (0 - 2)
 * @param {number} [opts.volume=1] - Volume (0 - 1)
 * @param {Function} [opts.onEnd] - Callback when speech ends
 * @param {Function} [opts.onError] - Callback when error occurs
 */
export async function speak(text = "", opts = {}) {
  if (!isSupported()) {
    console.warn("TTS not supported in this browser.");
    return;
  }
  if (!text) return;

  const synth = window.speechSynthesis;

  // stop any current speech (optional)
  if (synth.speaking) {
    synth.cancel();
  }

  const voices = await loadVoices();

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = typeof opts.rate === "number" ? opts.rate : 1;
  utter.pitch = typeof opts.pitch === "number" ? opts.pitch : 1;
  utter.volume = typeof opts.volume === "number" ? opts.volume : 1;
  utter.lang = opts.lang || "";

  if (opts.voice) {

    const match = voices.find((v) => v.name === opts.voice || v.voiceURI === opts.voice);
    if (match) utter.voice = match;
  } else if (opts.lang) {
    const matchLang = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(opts.lang.toLowerCase()));
    if (matchLang) utter.voice = matchLang;
  }

  utter.onend = (e) => {
    if (typeof opts.onEnd === "function") opts.onEnd(e);
  };
  utter.onerror = (e) => {
    if (typeof opts.onError === "function") opts.onError(e);
  };

  synth.speak(utter);
  return utter;
}

export function stop() {
  if (!isSupported()) return;
  window.speechSynthesis.cancel();
}


export async function getVoices() {
  if (!isSupported()) return [];
  const v = await loadVoices();
  return v;
}
