import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import authServices from "../server/authServices";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import Loading from "../components/Loading";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) navigate(from);
  }, [user, navigate, from]);

  const validateForm = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => {
    setErrors({ email: "", password: "", general: "" });
    setShowErrorAlert(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await authServices.Login({ email, password });

      console.log("Login Response:", res.data);

      // Store tokens
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);

      // Get user profile
      const profileRes = await authServices.getProfile();
      console.log("Profile Data:", profileRes.data);

      // Dispatch login action with user data
      dispatch(login(profileRes.data));

      // Show success message
      showToast("Login successful! Redirecting...", "success");

      // Navigate to previous page or home
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (err) {
      console.error("Login Error:", err);

      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        // Handle different HTTP status codes
        switch (err.response.status) {
          case 400:
            errorMessage = "Invalid email or password format";
            if (err.response.data.email) {
              setErrors(prev => ({ ...prev, email: err.response.data.email[0] }));
            }
            if (err.response.data.password) {
              setErrors(prev => ({ ...prev, password: err.response.data.password[0] }));
            }
            break;
          case 401:
            errorMessage = "Invalid email or password";
            setErrors(prev => ({
              ...prev,
              general: "The email or password you entered is incorrect"
            }));
            break;
          case 403:
            errorMessage = "Account is inactive or blocked";
            setErrors(prev => ({
              ...prev,
              general: "Your account is not active. Please contact support."
            }));
            break;
          case 404:
            errorMessage = "User not found";
            setErrors(prev => ({
              ...prev,
              general: "No account found with this email address"
            }));
            break;
          case 429:
            errorMessage = "Too many attempts";
            setErrors(prev => ({
              ...prev,
              general: "Too many login attempts. Please try again later."
            }));
            break;
          case 500:
            errorMessage = "Server error";
            setErrors(prev => ({
              ...prev,
              general: "Server error. Please try again later."
            }));
            break;
          default:
            if (err.response.data.detail) {
              errorMessage = err.response.data.detail;
            } else if (err.response.data.message) {
              errorMessage = err.response.data.message;
            }
            setErrors(prev => ({ ...prev, general: errorMessage }));
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } else {
        // Other errors
        errorMessage = "An unexpected error occurred";
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }

      setShowErrorAlert(true);
      showToast(errorMessage, "error");

    } finally {
      setLoading(false);
    }
  };

  // Toast notification function
  const showToast = (message, type = "info") => {
    // You can integrate a proper toast library here (like react-toastify)
    // For now, using a simple alert
    if (type === "error") {
      alert(` ${message}`);
    } else if (type === "success") {
      alert(` ${message}`);
    } else {
      alert(`${message}`);
    }
  };

  if (loading) return <Loading text="Logging in..." />;

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
                <p className="text-red-100 font-medium">Login Error</p>
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

      {/* twinkling stars layer */}
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
          <g className="opacity-70">
            <line x1="20%" y1="30%" x2="30%" y2="40%" stroke="#8ab4ff66" strokeWidth="0.8" className="animate-line" />
            <line x1="30%" y1="40%" x2="45%" y2="28%" stroke="#8ab4ff66" strokeWidth="0.8" className="animate-line animation-delay-300" />
            <line x1="45%" y1="28%" x2="62%" y2="38%" stroke="#8ab4ff66" strokeWidth="0.8" className="animate-line animation-delay-600" />
            <circle cx="20%" cy="30%" r="1.2" fill="#cfe2ff" />
            <circle cx="30%" cy="40%" r="1.2" fill="#cfe2ff" />
            <circle cx="45%" cy="28%" r="1.2" fill="#cfe2ff" />
            <circle cx="62%" cy="38%" r="1.2" fill="#cfe2ff" />
          </g>
        </svg>
      </div>

      {/* centered card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full sm:max-w-md mx-auto bg-gradient-to-br from-black/60 via-indigo-950/60 to-transparent border border-indigo-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12C5 8 8 6 12 6s7 2 9 6" stroke="#06132f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8" cy="13" r="1" fill="#06132f" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Astro Login</h2>
            <p className="text-sm text-indigo-200/80">Login to discover your daily cosmic hints ✨</p>
          </div>
        </div>

        {/* Login form */}
        <form className="space-y-4" onSubmit={handleLogin} noValidate>
          {/* Email Field */}
          <div>
            <label className="text-sm text-indigo-200/70">Email</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border placeholder-indigo-300 text-white outline-none transition-colors ${errors.email
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-indigo-500/20 focus:border-indigo-500"
                }`}
              placeholder="you@gmail.com"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: "" }));
                }
              }}
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

          {/* Password Field */}
          <div className="relative">
            <label className="text-sm text-indigo-200/70">Password</label>
            <div className="flex items-center">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border placeholder-indigo-300 text-white outline-none pr-10 transition-colors ${errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-indigo-500/20 focus:border-indigo-500"
                  }`}
                placeholder="Your secret constellation"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: "" }));
                  }
                }}
                disabled={loading}
              />
              <div
                className={`absolute right-3 mt-7 transform -translate-y-1/2 cursor-pointer ${loading ? "text-indigo-500/50" : "text-indigo-300 hover:text-indigo-200"
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

          <div className="flex items-center justify-end text-sm text-indigo-200/70">
            <Link to="/forgot-password" className="hover:underline hover:text-indigo-300 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full mt-2 py-3 rounded-xl text-white font-medium shadow-md transition-all ${loading
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-indigo-500/20"
              }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </motion.button>

          <div className="pt-4 border-t border-indigo-600/20 text-center text-indigo-200/70">
            Don't have an account?{" "}
            <Link
              className="text-indigo-300 hover:underline hover:text-indigo-200 transition-colors"
              to="/signup"
            >
              Create one
            </Link>
          </div>
        </form>
      </motion.div>

      {/* footer constellation glow */}
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

        @keyframes draw-line {
          from { stroke-dasharray: 0 200; }
          to { stroke-dasharray: 200 0; }
        }
        .animate-line { stroke-dasharray: 0 200; animation: draw-line 1.4s ease forwards; }
        
        /* Disabled state */
        input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};