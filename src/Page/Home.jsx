import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LuSparkles, LuUser, LuInfo, LuStar } from "react-icons/lu";

// A component to create the twinkling star background
const StarBackground = () => {
  const stars = [];
  for (let i = 0; i < 150; i++) {
    const style = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 0.5}px`,
      height: `${Math.random() * 2 + 0.5}px`,
      animationDelay: `${Math.random() * 5}s`,
    };
    stars.push(
      <div
        key={i}
        className="absolute rounded-full bg-white opacity-0 animate-twinkle"
        style={style}
      />
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}
      </style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars}
      </div>
    </>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-b from-gray-900 via-indigo-900 to-black">
      <StarBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 p-10 rounded-2xl border border-indigo-600/30 w-full max-w-3xl backdrop-blur-md text-white text-center space-y-8
                   shadow-[0_0_60px_rgba(99,102,241,0.5)] bg-black/70"
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">
          🔮 AstroApp
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-light">
          Welcome to the cosmos! Discover personalized insights, daily horoscopes, and powerful predictions powered by Vedic Astrology.
        </p>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-indigo-600/20 flex flex-col items-start space-y-2">
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              <LuInfo className="text-indigo-400" />
              <span>About</span>
            </h2>
            <p className="text-gray-400 text-sm">
              This platform helps you calculate planetary positions, generate your horoscope, and provide insights based on Vedic astrology.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-indigo-600/20 flex flex-col items-start space-y-2">
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              <LuStar className="text-purple-400" />
              <span>Predictions</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Try out our prediction feature to know your daily horoscope, life insights, and planetary influences on your journey.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-6">
          <Link
            to="/profile"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 transition shadow-lg text-lg flex items-center justify-center space-x-2"
          >
            <LuUser className="h-5 w-5" />
            <span>View Profile</span>
          </Link>
          <Link
            to="/predict"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition shadow-lg text-lg flex items-center justify-center space-x-2"
          >
            <LuSparkles className="h-5 w-5" />
            <span>Try Prediction</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;