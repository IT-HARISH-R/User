import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    alert("Logged out successfully 🚀");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black text-indigo-200">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold">No Profile Data ⚠️</h2>
          <p className="mt-2 text-indigo-300">Please login to see your profile.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black relative overflow-hidden md:px-4">
      {/* twinkling background + floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="star" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="star animate-twinkle" cx="10%" cy="25%" r="1.5" fill="url(#star)" />
          <circle className="star animate-twinkle animation-delay-400" cx="80%" cy="20%" r="1.6" fill="url(#star)" />
          <circle className="star animate-twinkle animation-delay-800" cx="50%" cy="60%" r="1.2" fill="url(#star)" />
          {/* Sun & Moon icons */}
          <text x="20%" y="10%" className="text-yellow-400 text-3xl animate-pulse">🌞</text>
          <text x="75%" y="15%" className="text-gray-200 text-2xl animate-pulse animation-delay-400">🌙</text>
          <text x="45%" y="70%" className="text-indigo-300 text-xl animate-pulse animation-delay-800">✨</text>
        </svg>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full sm:max-w-lg mx-auto bg-gradient-to-br from-black/50 via-indigo-950/50 to-transparent border border-indigo-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-lg"
      >
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg text-2xl font-bold text-white cursor-pointer"
          >
            {user.username ? user.username[0].toUpperCase() : "U"}
          </motion.div>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            {user.username || "Unnamed User"}
          </h2>
          <p className="text-indigo-300">{user.email}</p>
        </div>

        <div className="mt-6 space-y-3 text-indigo-200/80">
          {[
            { label: "ID", value: user.id },
            { label: "First Name", value: user.first_name || "-" },
            { label: "Last Name", value: user.last_name || "-" },
            { label: "Role", value: user.role || "User" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, shadow: "0 0 15px rgba(79,70,229,0.5)" }}
              className="flex justify-between border-b border-indigo-600/20 pb-2 px-2 rounded"
            >
              <span>{item.label}</span>
              <span>{item.value}</span>
            </motion.div>
          ))}
        </div>

        {/* 🔥 Logout button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full mt-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
        >
          Logout
        </motion.button>
      </motion.div>

      {/* Glow effect */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[800px] h-[400px] rounded-full bg-gradient-to-r from-indigo-900/20 via-purple-900/10 to-transparent blur-3xl pointer-events-none opacity-80"></div>

      <style>{`
        .star { filter: drop-shadow(0 0 6px rgba(200,220,255,0.9)); }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        .animate-twinkle { animation: twinkle 3.6s infinite ease-in-out; }
        .animation-delay-400 { animation-delay: .4s; }
        .animation-delay-800 { animation-delay: .8s; }
        .animate-pulse { animation: pulse 2s infinite alternate; }
        @keyframes pulse { 0% { opacity: 0.6; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Profile;
