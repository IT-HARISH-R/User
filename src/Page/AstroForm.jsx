import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Calendar, Clock, Sun, Moon, Key } from "lucide-react";
import astroServices from "../server/astroServices";
import { useDispatch, useSelector } from "react-redux";
import { cachePrediction } from "../redux/slices/astroSlice";

// --- STAR BACKGROUND COMPONENT ---
const Star = ({ style }) => (
  <div className="absolute bg-white rounded-full opacity-0 star-twinkle" style={style} />
);

const StarBackground = () => {
  const stars = [];
  for (let i = 0; i < 100; i++) {
    const size = Math.random() * 2 + 0.5;
    const style = {
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 2 + 1}s`,
    };
    stars.push(<Star key={i} style={style} />);
  }

  const starKeyframes = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    .star-twinkle {
      animation: twinkle infinite alternate ease-in-out;
    }
  `;

  return (
    <>
      <style>{starKeyframes}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars}
      </div>
    </>
  );
};

// --- ASTRO FORM COMPONENT ---
const AstroForm = () => {

  const dispatch = useDispatch();
  const cachedPredictions = useSelector((state) => state.astro.predictions);
  const { predictions, lastKey } = useSelector((state) => state.astro);

  const [formData, setFormData] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    model: "gemini-2.5-flash",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 👇 restore last prediction when component mounts
  React.useEffect(() => {
    if (lastKey && predictions[lastKey]) {
      console.log("✨ Restored last prediction from Redux memory");
      setResult(predictions[lastKey]);
    }
  }, [lastKey, predictions]);

  // --- Unique Cache Key ---
  const generateKey = (data) =>
    `${data.year}-${data.month}-${data.day}-${data.hour}-${data.minute}`;

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "month" && value > 12) value = "12";
    if (name === "day" && value > 31) value = "31";
    if (name === "hour" && value > 23) value = "23";
    if (name === "minute" && value > 59) value = "59";

    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    let { name, value } = e.target;
    if (value && value.length < 2) {
      value = value.padStart(2, "0");
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const key = generateKey(formData);

    // Check Redux Cache
    if (cachedPredictions[key]) {
      console.log("🪐 Loaded from Redux Cache");
      setResult(cachedPredictions[key]);
      setLoading(false);
      return;
    }

    try {
      const res = await astroServices.getPrediction(formData);
      setResult(res);
      dispatch(cachePrediction({ key, data: res }));
    } catch (err) {
      console.error(err);
      setError("Something went wrong with the cosmic connection, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-950 to-black relative overflow-hidden p-4">
      <StarBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl bg-black/70 p-8 sm:p-10 rounded-2xl border border-indigo-600/50 shadow-[0_0_60px_rgba(99,102,241,0.2)] backdrop-blur-lg text-white"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 flex items-center justify-center space-x-3">
          <Zap className="w-7 h-7" />
          <span>Cosmic Prediction Engine</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Inputs */}
          <div className="space-y-3">
            <label className="text-indigo-300 font-semibold flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Birth Date (YYYY / MM / DD)</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["year", "month", "day"].map((field) => (
                <input
                  key={field}
                  type="number"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-3 rounded-xl bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                  required
                />
              ))}
            </div>
          </div>

          {/* Time Inputs */}
          <div className="space-y-3">
            <label className="text-indigo-300 font-semibold flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Birth Time (HH:MM - 24 hour format)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["hour", "minute"].map((field) => (
                <input
                  key={field}
                  type="number"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-3 rounded-xl bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                  required
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full py-3 rounded-xl font-bold text-lg transition duration-300 ease-in-out mt-8
              ${loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-500/30"
              }`}
          >
            {loading ? (
              "Calculating Fate..."
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                Get Cosmic Prediction
              </span>
            )}
          </motion.button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-400 mt-6 text-center font-medium border border-red-500/50 bg-red-900/20 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6 p-6 rounded-xl border border-purple-600/50 bg-gray-900/50 shadow-inner"
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 flex items-center justify-between">
              🌟 Your Daily Cosmic Hint
            </h3>

            <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/50">
              <p
                className="text-indigo-100 whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: result.thanglish_explanation.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-700/50 space-y-2 text-sm text-gray-400">
              <p className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>
                  Julian Day:{" "}
                  <span className="text-white font-mono">
                    {result.astrology_data.julian_day}
                  </span>
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-orange-400" />
                <span>
                  Sun Longitude:{" "}
                  <span className="text-white font-mono">
                    {result.astrology_data.sun_longitude}
                  </span>
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-yellow-300" />
                <span>
                  Moon Longitude:{" "}
                  <span className="text-white font-mono">
                    {result.astrology_data.moon_longitude}
                  </span>
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AstroForm;
