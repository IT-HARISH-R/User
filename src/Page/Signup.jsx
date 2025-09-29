import React, { useState } from "react";
import { motion } from "framer-motion";
import authServices from "../server/authServices";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

export const Signup = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authServices.Login({ email, password });
      console.log("Login Response:", res.data);
      alert("Login Success ✅");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black relative overflow-hidden md:px-4">
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
            <h2 className="text-2xl font-semibold text-white">Astro Sign In</h2>
            <p className="text-sm text-indigo-200/80">Sign in to discover your daily cosmic hints ✨</p>
          </div>
        </div>

        {/* Login form */}
        <form className="space-y-4" onSubmit={handlLogin}>
          <div>
            <label className="text-sm text-indigo-200/70">username</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none"
              placeholder="you@gmail.com"
              required
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-indigo-200/70">Email</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none"
              placeholder="you@gmail.com"
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="text-sm text-indigo-200/70">Password</label>
            <div className="flex items-center">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none pr-10"
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

          <div className="flex items-center justify-end text-sm text-indigo-200/70">
            <a href="#" className="hover:underline">Forgot?</a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md"
            type="submit"
          >
            Signup
          </motion.button>


          <div className="pt-4 border-t border-indigo-600/20 text-center text-indigo-200/70">
            Already have an account?{" "}
            <Link className="text-indigo-300 hover:underline" to="/login">
              Login
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
      `}</style>
    </div>
  );
}
