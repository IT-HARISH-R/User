import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

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
      {/* twinkling background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="star" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="star animate-twinkle" cx="15%" cy="20%" r="1.4" fill="url(#star)" />
          <circle className="star animate-twinkle animation-delay-400" cx="70%" cy="15%" r="1.6" fill="url(#star)" />
          <circle className="star animate-twinkle animation-delay-800" cx="45%" cy="65%" r="1.2" fill="url(#star)" />
        </svg>
      </div>

      {/* Profile card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full sm:max-w-lg mx-auto bg-gradient-to-br from-black/60 via-indigo-950/60 to-transparent border border-indigo-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            {user.username || "Unnamed User"}
          </h2>
          <p className="text-indigo-300">{user.email}</p>
        </div>

        <div className="mt-6 space-y-3 text-indigo-200/80">
          <div className="flex justify-between border-b border-indigo-600/20 pb-2">
            <span>ID</span>
            <span>{user.id}</span>
          </div>
          <div className="flex justify-between border-b border-indigo-600/20 pb-2">
            <span>First Name</span>
            <span>{user.first_name || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-indigo-600/20 pb-2">
            <span>Last Name</span>
            <span>{user.last_name || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Role</span>
            <span className="px-2 py-1 rounded bg-indigo-600/30">
              {user.role || "User"}
            </span>
          </div>
        </div>
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
      `}</style>
    </div>
  );
};

export default Profile;
