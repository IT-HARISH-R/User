import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LuUser, LuSparkles, LuUserPlus, LuStar, LuChartBar, LuZap } from "react-icons/lu";
import { useSelector } from "react-redux";
import { StarBackground } from "../components/StarBackground";
import ZodiacList from "../components/Home/ZodiacList";
import HeroSlider from "../components/Home/HeroSlider";
import LoveCalculator from "../components/Home/LoveCalculator";
import Footer from "../components/Home/Footer";

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Check if animations have already played
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Floating animation variants - always animate
  const floatingAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Page animation variants - only animate once
  const pageVariants = {
    initial: hasAnimated ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: hasAnimated ? 0 : 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Content animation variants - only animate once
  const containerVariants = {
    hidden: hasAnimated ? { opacity: 1 } : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: hasAnimated ? 0 : 0.1,
        delayChildren: hasAnimated ? 0 : 0.3
      }
    }
  };

  const itemVariants = {
    hidden: hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: hasAnimated ? 0 : 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
      >
        {/* Enhanced Star Background with Nebula Effect */}
        <StarBackground />

        {/* Nebula Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/10 pointer-events-none" />

        {/* Floating Planets Decorations - Always animate */}
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-20 left-10 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-sm opacity-40"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute bottom-40 right-16 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 blur-sm opacity-30"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 blur-sm opacity-50"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12 text-center flex-grow"
        >
          {/* 🌟 Main Header */}
          <motion.div variants={itemVariants} className="space-y-6 mb-12 sm:mb-16">
            <motion.div
              initial={hasAnimated ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: hasAnimated ? 0 : 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse" />
                <LuStar className="h-16 w-16 text-yellow-400 relative z-10 animate-spin-slow" />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-2xl">
                AstroApp
              </span>
            </h1>

            <motion.p
              initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: hasAnimated ? 0 : 0.5,
                duration: hasAnimated ? 0 : 0.8
              }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Discover your cosmic blueprint with{" "}
              <span className="text-cyan-300 font-semibold">AI-powered Vedic astrology</span>{" "}
              and personalized celestial guidance
            </motion.p>
          </motion.div>

          {/* 🎠 Hero Slider */}
          <motion.div variants={itemVariants} className="mb-16 sm:mb-20">
            <HeroSlider />
          </motion.div>

          {/* ✨ Feature Highlights */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
            {[
              { icon: LuChartBar, title: "Birth Chart Analysis", desc: "Detailed planetary positions", color: "from-blue-500 to-cyan-500" },
              { icon: LuZap, title: "Daily Insights", desc: "Personalized horoscopes", color: "from-purple-500 to-pink-500" },
              { icon: LuStar, title: "Future Predictions", desc: "Accurate Vedic forecasts", color: "from-orange-500 to-yellow-500" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: hasAnimated ? 0 : 0.9 + index * 0.1,
                  duration: hasAnimated ? 0 : 0.6
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="group p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 shadow-2xl text-center cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 🔯 Zodiac Section */}
          <motion.div variants={itemVariants} className="my-12 sm:my-16">
            <ZodiacList />
          </motion.div>

          {/* 🪄 CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-12 sm:mt-16 mb-10">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-2xl text-lg font-semibold flex items-center justify-center space-x-3 min-w-[200px] transform hover:scale-105 hover:shadow-blue-500/25"
                >
                  <LuUser className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>View Profile</span>
                </Link>

                <Link
                  to="/predict"
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-2xl text-lg font-semibold flex items-center justify-center space-x-3 min-w-[200px] transform hover:scale-105 hover:shadow-purple-500/25"
                >
                  <LuSparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Try Prediction</span>
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-2xl text-lg font-semibold flex items-center justify-center space-x-3 min-w-[200px] transform hover:scale-105 hover:shadow-green-500/25"
              >
                <LuUserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Start Cosmic Journey</span>
              </Link>
            )}
          </motion.div>

          {/* 💖 Love Calculator */}
          <motion.div
            initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: hasAnimated ? 0 : 0.8, delay: hasAnimated ? 0 : 0.3 }}
            className="w-full my-16 sm:my-20"
          >
            <LoveCalculator />
          </motion.div>

          {/* 🌠 Astro Info Cards */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 sm:gap-10 mb-20 px-4">
            {/* 🪐 Vedic Astrology Card */}
            <motion.div
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: hasAnimated ? 0 : 0.8, delay: hasAnimated ? 0 : 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 border border-blue-400/20 shadow-[0_0_25px_rgba(59,130,246,0.15)] backdrop-blur-2xl overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-300 to-indigo-400 bg-clip-text text-transparent mb-4">
                🪐 Vedic Astrology
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed z-10 relative">
                AstroApp follows the authentic <strong className="text-blue-300">Vedic astrology</strong> principles
                to calculate accurate planetary positions and birth charts. Receive
                <span className="text-purple-300"> personalized insights</span> that illuminate your path in love, career,
                and spiritual growth.
              </p>
            </motion.div>

            {/* ✨ Cosmic Predictions Card */}
            <motion.div
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: hasAnimated ? 0 : 0.8, delay: hasAnimated ? 0 : 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-violet-500/10 border border-pink-400/20 shadow-[0_0_25px_rgba(236,72,153,0.15)] backdrop-blur-2xl overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
                ✨ Cosmic Predictions
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed z-10 relative">
                Experience <span className="text-pink-300">daily, weekly, and yearly</span> predictions driven by
                real-time planetary alignments. Understand how cosmic energy influences
                your <strong className="text-purple-300">mood, relationships,</strong> and opportunities —
                powered by AI-enhanced accuracy.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer Component */}
      </motion.div>
      <Footer />
    </>
  );
};

export default HomePage;