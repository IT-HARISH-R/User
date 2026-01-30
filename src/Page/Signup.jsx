import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import authServices from "../server/authServices";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from "react-icons/ai";
import { User, Mail, Lock, Globe, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { indianCities } from "../data/indianCities";

export const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    birthMinute: "",
    birthPlace: "",
    language: "en"
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    birthMinute: "",
    birthPlace: "",
    language: "",
    general: ""
  });

  const [birthPlaceSuggestions, setBirthPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-suggest for birth place
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.birthPlace.length > 0) {
        fetchPlaceSuggestions(formData.birthPlace);
      } else {
        setBirthPlaceSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.birthPlace]);

  const fetchPlaceSuggestions = async (query) => {
    if (query.length < 1) {
      setBirthPlaceSuggestions([]);
      return;
    }

    const filteredSuggestions = indianCities.filter(place =>
      place.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions

    setBirthPlaceSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Clear general error when user modifies any field
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
      setShowErrorAlert(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Name is required";
      isValid = false;
    } else if (formData.username.length < 2) {
      newErrors.username = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } 
    // else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    //   newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    //   isValid = false;
    // }

    // Birth date validation
    const currentYear = new Date().getFullYear();
    if (!formData.birthYear) {
      newErrors.birthYear = "Birth year is required";
      isValid = false;
    } else if (parseInt(formData.birthYear) < currentYear - 120 || parseInt(formData.birthYear) > currentYear) {
      newErrors.birthYear = "Please enter a valid birth year";
      isValid = false;
    }

    if (!formData.birthMonth) {
      newErrors.birthMonth = "Birth month is required";
      isValid = false;
    }

    if (!formData.birthDay) {
      newErrors.birthDay = "Birth day is required";
      isValid = false;
    }

    // Validate complete date
    if (formData.birthYear && formData.birthMonth && formData.birthDay) {
      const day = parseInt(formData.birthDay);
      const month = parseInt(formData.birthMonth);
      const year = parseInt(formData.birthYear);
      const date = new Date(year, month - 1, day);
      
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        newErrors.birthDay = "Invalid date";
        isValid = false;
      } else if (date > new Date()) {
        newErrors.birthYear = "Birth date cannot be in the future";
        isValid = false;
      }
    }

    // Birth time validation
    if (!formData.birthHour) {
      newErrors.birthHour = "Birth hour is required";
      isValid = false;
    }

    if (!formData.birthMinute) {
      newErrors.birthMinute = "Birth minute is required";
      isValid = false;
    }

    // Birth place validation
    if (!formData.birthPlace.trim()) {
      newErrors.birthPlace = "Birth place is required";
      isValid = false;
    } else if (formData.birthPlace.length < 2) {
      newErrors.birthPlace = "Please enter a valid location";
      isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSuggestionClick = (suggestion) => {
    handleInputChange("birthPlace", suggestion);
    setShowSuggestions(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({
      email: "", password: "", username: "", birthYear: "", birthMonth: "",
      birthDay: "", birthHour: "", birthMinute: "", birthPlace: "", language: "", general: ""
    });
    setShowErrorAlert(false);
    setSuccessMessage("");

    if (!validateForm()) {
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);
    try {
      const res = await authServices.Register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        birth_year: formData.birthYear,
        birth_month: formData.birthMonth,
        birth_day: formData.birthDay,
        birth_hour: formData.birthHour,
        birth_minute: formData.birthMinute,
        birth_place: formData.birthPlace,
        language: formData.language,
      });

      console.log("Signup Response:", res.data);
      
      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Show success for 2 seconds then redirect
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please login to continue.",
            type: "success"
          }
        });
      }, 2000);

    } catch (err) {
      console.error("Signup Error:", err);
      
      let errorMessage = "Registration failed. Please try again.";
      const newErrors = {};

      if (err.response) {
        switch (err.response.status) {
          case 400:
            // Handle field-specific errors from backend
            if (err.response.data.email) {
              newErrors.email = Array.isArray(err.response.data.email) 
                ? err.response.data.email[0] 
                : err.response.data.email;
            }
            if (err.response.data.password) {
              newErrors.password = Array.isArray(err.response.data.password)
                ? err.response.data.password[0]
                : err.response.data.password;
            }
            if (err.response.data.username) {
              newErrors.username = Array.isArray(err.response.data.username)
                ? err.response.data.username[0]
                : err.response.data.username;
            }
            if (err.response.data.detail) {
              errorMessage = err.response.data.detail;
            }
            break;
          case 409:
            errorMessage = "An account with this email already exists";
            newErrors.email = errorMessage;
            break;
          case 422:
            errorMessage = "Invalid data provided";
            break;
          case 429:
            errorMessage = "Too many registration attempts. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.detail || 
                          err.response.data?.message || 
                          "Registration failed";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      newErrors.general = errorMessage;
      setErrors(prev => ({ ...prev, ...newErrors }));
      setShowErrorAlert(true);

    } finally {
      setLoading(false);
    }
  };

  // Generate dropdown options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
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
      {/* Error Alert */}
      {showErrorAlert && errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4"
        >
          <div className="bg-red-900/80 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <AiOutlineExclamationCircle className="text-red-300 mt-0.5 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-red-100 font-medium">Registration Error</p>
                <p className="text-red-200/80 text-sm mt-1">{errors.general}</p>
              </div>
              <button
                onClick={() => setShowErrorAlert(false)}
                className="text-red-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4"
        >
          <div className="bg-green-900/80 backdrop-blur-sm border border-green-500/50 rounded-xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <Sparkles className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-green-100 font-medium">Success!</p>
                <p className="text-green-200/80 text-sm mt-1">{successMessage}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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

        <form className="space-y-4" onSubmit={handleSignup} noValidate>
          {/* Username */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <User size={16} />
              Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border text-white outline-none transition-colors ${
                errors.username 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-indigo-500/20 focus:border-indigo-500"
              }`}
              placeholder="Enter your full name"
              required
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={loading}
            />
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
              >
                <AiOutlineExclamationCircle size={12} />
                {errors.username}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border text-white outline-none transition-colors ${
                errors.email 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-indigo-500/20 focus:border-indigo-500"
              }`}
              placeholder="you@gmail.com"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={loading}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
              >
                <AiOutlineExclamationCircle size={12} />
                {errors.email}
              </motion.p>
            )}
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
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border text-white outline-none pr-10 transition-colors ${
                  errors.password 
                    ? "border-red-500/50 focus:border-red-500" 
                    : "border-indigo-500/20 focus:border-indigo-500"
                }`}
                placeholder="Minimum 6 characters with uppercase, lowercase, and numbers"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={loading}
              />
              <div
                className={`absolute mt-6 right-3 transform -translate-y-1/2 cursor-pointer ${
                  loading ? "text-indigo-500/50" : "text-indigo-300 hover:text-indigo-200"
                }`}
                onClick={() => !loading && setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </div>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
              >
                <AiOutlineExclamationCircle size={12} />
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Preferred Language */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Globe size={16} />
              Preferred Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border text-white outline-none transition-colors ${
                errors.language 
                  ? "border-red-500/50" 
                  : "border-indigo-500/20"
              }`}
              required
              disabled={loading}
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
              <div className="flex-1">
                <select
                  value={formData.birthYear}
                  onChange={(e) => handleInputChange("birthYear", e.target.value)}
                  className={`w-full bg-white/5 border text-white rounded-lg px-2 py-2 transition-colors ${
                    errors.birthYear ? "border-red-500/50" : "border-indigo-500/20"
                  }`}
                  required
                  disabled={loading}
                >
                  <option className="bg-gray-800 text-white" value="">Year</option>
                  {years.map((y) => (
                    <option className="bg-gray-800 text-white" key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <select
                  value={formData.birthMonth}
                  onChange={(e) => handleInputChange("birthMonth", e.target.value)}
                  className={`w-full bg-white/5 border text-white rounded-lg px-2 py-2 transition-colors ${
                    errors.birthMonth ? "border-red-500/50" : "border-indigo-500/20"
                  }`}
                  required
                  disabled={loading}
                >
                  <option className="bg-gray-800 text-white" value="">Month</option>
                  {months.map((m) => (
                    <option className="bg-gray-800 text-white" key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <select
                  value={formData.birthDay}
                  onChange={(e) => handleInputChange("birthDay", e.target.value)}
                  className={`w-full bg-white/5 border text-white rounded-lg px-2 py-2 transition-colors ${
                    errors.birthDay ? "border-red-500/50" : "border-indigo-500/20"
                  }`}
                  required
                  disabled={loading}
                >
                  <option className="bg-gray-800 text-white" value="">Day</option>
                  {days.map((d) => (
                    <option className="bg-gray-800 text-white" key={d} value={d}>
                      {d.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
              >
                <AiOutlineExclamationCircle size={12} />
                {errors.birthYear || errors.birthMonth || errors.birthDay}
              </motion.p>
            )}
          </div>

          {/* Birth Time */}
          <div>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <Clock size={16} />
              Birth Time (HH : MM - 24hr format)
            </label>
            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <select
                  value={formData.birthHour}
                  onChange={(e) => handleInputChange("birthHour", e.target.value)}
                  className={`w-full bg-white/5 border text-white rounded-lg px-2 py-2 transition-colors ${
                    errors.birthHour ? "border-red-500/50" : "border-indigo-500/20"
                  }`}
                  required
                  disabled={loading}
                >
                  <option className="bg-gray-800 text-white" value="">Hour</option>
                  {hours.map((h) => (
                    <option className="bg-gray-800 text-white" key={h} value={h}>
                      {h.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <select
                  value={formData.birthMinute}
                  onChange={(e) => handleInputChange("birthMinute", e.target.value)}
                  className={`w-full bg-white/5 border text-white rounded-lg px-2 py-2 transition-colors ${
                    errors.birthMinute ? "border-red-500/50" : "border-indigo-500/20"
                  }`}
                  required
                  disabled={loading}
                >
                  <option className="bg-gray-800 text-white" value="">Minute</option>
                  {minutes.map((m) => (
                    <option className="bg-gray-800 text-white" key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {(errors.birthHour || errors.birthMinute) && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
              >
                <AiOutlineExclamationCircle size={12} />
                {errors.birthHour || errors.birthMinute}
              </motion.p>
            )}
          </div>

          {/* Birth Place with Auto-suggest */}
          <div className="relative" ref={suggestionsRef}>
            <label className="text-sm text-indigo-200/70 flex items-center gap-2">
              <MapPin size={16} />
              Birth Place
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border text-white outline-none transition-colors ${
                errors.birthPlace 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-indigo-500/20 focus:border-indigo-500"
              }`}
              placeholder="Enter your birth city, country"
              value={formData.birthPlace}
              onChange={(e) => handleInputChange("birthPlace", e.target.value)}
              onFocus={() => formData.birthPlace && setShowSuggestions(true)}
              disabled={loading}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && birthPlaceSuggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-indigo-500/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {birthPlaceSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-white hover:bg-indigo-600/30 cursor-pointer border-b border-indigo-500/10 last:border-b-0 flex items-center gap-2 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                  >
                    <MapPin size={14} className="text-indigo-300" />
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            
            {errors.birthPlace && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
              >
                <AiOutlineExclamationCircle size={12} />
                {errors.birthPlace}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full mt-2 py-3 rounded-xl text-white font-medium shadow-md transition-all ${
              loading
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-indigo-500/20"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing up...
              </div>
            ) : (
              <>
                <Sparkles size={18} className="inline mr-2" />
                Signup
              </>
            )}
          </motion.button>

          {/* Login Link */}
          <div className="pt-4 border-t border-indigo-600/20 text-center text-indigo-200/70">
            Already have an account?{" "}
            <Link 
              className="text-indigo-300 hover:underline hover:text-indigo-200 transition-colors" 
              to="/login"
            >
              Login
            </Link>
          </div>
        </form>
      </motion.div>

      {/* Footer glow */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[800px] h-[400px] rounded-full bg-gradient-to-r from-indigo-900/20 via-purple-900/10 to-transparent blur-3xl pointer-events-none opacity-80"></div>

      <style>{`
        .star { filter: drop-shadow(0 0 6px rgba(200,220,255,0.9)); }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        .animate-twinkle { animation: twinkle 3.6s infinite ease-in-out; }
        .animation-delay-200 { animation-delay: .2s; }
        .animation-delay-400 { animation-delay: .4s; }
        .animation-delay-600 { animation-delay: .6s; }
        .animation-delay-800 { animation-delay: .8s; }
        
        select:disabled, input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        select option {
          background-color: #1f2937;
        }
      `}</style>
    </div>
  );
};