import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import authServices from "../server/authServices";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { User, Mail, Lock, Globe, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { indianCities } from "../data/indianCities";

export const Signup = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthPlaceSuggestions, setBirthPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock function for place suggestions - replace with actual API
  const fetchPlaceSuggestions = async (query) => {
    if (query.length < 1) {
      setBirthPlaceSuggestions([]);
      return;
    }

    // Mock data - replace with actual geocoding API like Google Places, MapBox, etc.
    const mockSuggestions = indianCities.filter(place =>
      place.toLowerCase().includes(query.toLowerCase())
    );

    setBirthPlaceSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (birthPlace) {
        fetchPlaceSuggestions(birthPlace);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [birthPlace]);

  const handlSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authServices.Register({
        email,
        password,
        username,
        birth_year: birthYear,
        birth_month: birthMonth,
        birth_day: birthDay,
        birth_hour: birthHour,
        birth_minute: birthMinute,
        birth_place: birthPlace,
        language,
      });
      console.log("Signup Response:", res.data);
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      alert(
        err.response?.data?.email ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Signup Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setBirthPlace(suggestion);
    setShowSuggestions(false);
    setBirthPlaceSuggestions([]);
  };

  // Generate dropdown options
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Language options
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ta", label: "Tamil" },
    { value: "hi", label: "Hindi" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black relative overflow-hidden md:px-4">
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="star animate-twinkle" cx="10%" cy="20%" r="1.7" fill="url(#g1)" />
          <circle className="star animate-twinkle animation-delay-200" cx="25%" cy="60%" r="1.2" fill="url(#g1)" />
          <circle className="star animate-twinkle animation-delay-400" cx="70%" cy="10%" r="1.5" fill="url(#g1)" />
          <circle className="star animate-twinkle animation-delay-600" cx="85%" cy="55%" r="1.0" fill="url(#g1)" />
          <circle className="star animate-twinkle animation-delay-800" cx="40%" cy="30%" r="1.4" fill="url(#g1)" />
        </svg>
      </div>

      {/* Signup card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full sm:max-w-md mx-auto bg-gradient-to-br from-black/60 via-indigo-950/60 to-transparent border border-indigo-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Astro Signup</h2>
            <p className="text-sm text-indigo-200/80">Register to discover your cosmic vibes ✨</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handlSignup}>
          {/* Username */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <User size={16} />
              Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 text-white outline-none"
              placeholder="Name"
              required
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 text-white outline-none"
              placeholder="you@gmail.com"
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Lock size={16} />
              Password
            </label>
            <div className="flex items-center">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 text-white outline-none pr-10"
                placeholder="Your secret constellation"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute mt-6 right-3 transform -translate-y-1/2 text-indigo-300 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </div>
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Globe size={16} />
              Preferred Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 text-white outline-none"
              required
            >
              {languageOptions.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-gray-800 text-white">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* 🌙 Birth Details */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Calendar size={16} />
              Birth Date (YYYY / MM / DD)
            </label>
            <div className="flex gap-2 mt-2">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="flex-1 bg-white/5 border border-indigo-500/20 text-white rounded-lg px-2 py-2"
                required
              >
                <option className="bg-gray-800 text-white" value="">Year</option>
                {years.map((y) => (
                  <option className="bg-gray-800 text-white" key={y} value={y}>{y} </option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="flex-1 bg-white/5 border border-indigo-500/20 text-white rounded-lg px-2 py-2"
                required
              >
                <option className="bg-gray-800 text-white" value="">Month</option>
                {months.map((m) => (
                  <option className="bg-gray-800 text-white" key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="flex-1 bg-white/5 border border-indigo-500/20 text-white rounded-lg px-2 py-2"
                required
              >
                <option className="bg-gray-800 text-white" value="">Day</option>
                {days.map((d) => (
                  <option className="bg-gray-800 text-white" key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Clock size={16} />
              Birth Time (HH : MM - 24hr format)
            </label>
            <div className="flex gap-2 mt-2">
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className="flex-1 bg-white/5 border border-indigo-500/20 text-white rounded-lg px-2 py-2"
                required
              >
                <option className="bg-gray-800 text-white" value="">Hour</option>
                {hours.map((h) => (
                  <option className="bg-gray-800 text-white" key={h} value={h}>{h.toString().padStart(2, "0")}</option>
                ))}
              </select>
              <select
                value={birthMinute}
                onChange={(e) => setBirthMinute(e.target.value)}
                className="flex-1 bg-white/5 border border-indigo-500/20 text-white rounded-lg px-2 py-2"
                required
              >
                <option className="bg-gray-800 text-white" value="">Minute</option>
                {minutes.map((m) => (
                  <option className="bg-gray-800 text-white" key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Birth Place with Auto-suggest */}
          <div className="relative">
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <MapPin size={16} />
              Birth Place
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 text-white outline-none"
              placeholder="Enter your birth city, country"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              onFocus={() => birthPlaceSuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && birthPlaceSuggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-indigo-500/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {birthPlaceSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-white hover:bg-indigo-600/30 cursor-pointer border-b border-indigo-500/10 last:border-b-0 flex items-center gap-2"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MapPin size={14} className="text-indigo-300" />
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing up...
              </>
            ) : (
              <>
               
                Signup
              </>
            )}
          </motion.button>

          <div className="pt-4 border-t border-indigo-600/20 text-center text-indigo-200/70">
            Already have an account?{" "}
            <Link className="text-indigo-300 hover:underline" to="/login">
              Login
            </Link>
          </div>
        </form>
      </motion.div>

      <style>{`
        .star { filter: drop-shadow(0 0 6px rgba(200,220,255,0.9)); }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        .animate-twinkle { animation: twinkle 3.6s infinite ease-in-out; }
      `}</style>
    </div>
  );
};