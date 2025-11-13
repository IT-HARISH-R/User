import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuHeart, LuCalculator, LuSparkles } from "react-icons/lu";
import Zodiac from "../../server/Zodiac";

const LoveCalculator = () => {
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const res = await Zodiac.LoveMatch({ name1, name2 });
            setResult(res.data);
        } catch (err) {
            console.error("Love calculation error:", err);
            setResult({
                message: "Error connecting to server 😢",
                love_score: null
            });
        } finally {
            setLoading(false);
        }
    };

    // Enhanced animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    // Enhanced Result Animations
    const resultContainerVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: 30 
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                staggerChildren: 0.15
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -20,
            transition: {
                duration: 0.4,
                ease: "easeIn"
            }
        }
    };

    const scoreCircleVariants = {
        hidden: { 
            scale: 0, 
            rotate: -180,
            opacity: 0 
        },
        visible: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3
            }
        }
    };

    const scoreTextVariants = {
        hidden: { 
            scale: 0.5, 
            opacity: 0,
            textShadow: "0 0 0px rgba(255,255,255,0)" 
        },
        visible: {
            scale: 1,
            opacity: 1,
            textShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 20px rgba(255,255,255,0.8)",
                "0 0 10px rgba(255,255,255,0.4)"
            ],
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.5,
                textShadow: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }
            }
        }
    };

    const messageVariants = {
        hidden: { 
            opacity: 0, 
            y: 20,
            scale: 0.95 
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.7
            }
        }
    };

    const heartVariants = {
        floating: (i) => ({
            y: [0, -25, 0],
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            scale: [1, 1.3, 1],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            opacity: [0.6, 1, 0.6],
            transition: {
                duration: 2.5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
            }
        })
    };

    const confettiVariants = {
        hidden: { 
            scale: 0, 
            opacity: 0,
            y: 0 
        },
        visible: (i) => ({
            scale: [0, 1, 0.8],
            opacity: [0, 1, 0],
            y: [-50, -150],
            x: [0, (i - 2) * 40],
            rotate: [0, i % 2 === 0 ? 180 : -180],
            transition: {
                duration: 1.5,
                ease: "easeOut",
                delay: i * 0.1
            }
        })
    };

    const pulseRingVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: [1, 1.4, 1],
            opacity: [0.8, 0, 0.8],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "from-green-400 to-emerald-500";
        if (score >= 60) return "from-yellow-400 to-amber-500";
        if (score >= 40) return "from-orange-400 to-red-500";
        return "from-pink-500 to-rose-500";
    };

    const getScoreMessage = (score) => {
        if (score >= 90) return "Divine Cosmic Connection! ✨";
        if (score >= 80) return "Perfect Celestial Match! 🌟";
        if (score >= 70) return "Strong Cosmic Bond! 💫";
        if (score >= 60) return "Good Celestial Harmony! 🌙";
        if (score >= 50) return "Moderate Cosmic Connection! ⭐";
        if (score >= 40) return "Developing Celestial Bond! 🌌";
        return "Cosmic Energy Needs Alignment! 🌠";
    };

    return (
        <>
            {/* 💫 Cosmic Match CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-center my-12 sm:my-16"
            >
                {/* Main Heading */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-red-400">
                            Discover Your Cosmic Connection
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Unveil the celestial bond that connects two souls through the power of Vedic astrology
                    </p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="flex justify-center items-center space-x-4 mb-8">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-pink-400 text-xl"
                    >
                        ✨
                    </motion.div>
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 max-w-4xl mx-auto"
                >
                    {[
                        { number: "10K+", label: "Love Matches Analyzed", emoji: "💑" },
                        { number: "98%", label: "Accuracy Rate", emoji: "🎯" },
                        { number: "24/7", label: "Cosmic Guidance", emoji: "🌌" }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                transition: { duration: 0.2 }
                            }}
                            className="p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-pink-500/30 text-center group cursor-pointer"
                        >
                            <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                {stat.emoji}
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-2">
                                {stat.number}
                            </div>
                            <div className="text-sm sm:text-base text-gray-400 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call-to-Action Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="mb-8"
                >
                    <p className="text-lg sm:text-xl text-cyan-200 font-semibold mb-4">
                        Ready to explore your celestial compatibility?
                    </p>
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-2xl text-pink-400"
                    >
                        ↓
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Love Calculator Form */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative my-16 sm:my-20 w-full max-w-2xl mx-auto"
            >
                {/* Background Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 rounded-3xl blur-3xl -z-10" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/20 rounded-full blur-2xl animate-pulse delay-1000" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
                >
                    {/* Header */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mb-4"
                        >
                            <LuHeart className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-2">
                            Cosmic Love Calculator
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Discover your celestial compatibility with our AI-powered love analysis
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleSubmit}
                        className="space-y-6 mb-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name1}
                                    onChange={(e) => setName1(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Partner's Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter partner's name"
                                    value={name2}
                                    onChange={(e) => setName2(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 0 30px rgba(236, 72, 153, 0.3)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <LuSparkles className="h-5 w-5" />
                                    </motion.div>
                                    <span>Calculating Cosmic Energy...</span>
                                </>
                            ) : (
                                <>
                                    <LuCalculator className="h-5 w-5" />
                                    <span>Check Compatibility</span>
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Enhanced Results Section */}
                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                variants={resultContainerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="mt-6 p-8 rounded-3xl bg-gradient-to-br from-pink-500/15 to-rose-500/15 border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                            >
                                {/* Confetti Effect for High Scores */}
                                {result.love_score >= 80 && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                custom={i}
                                                variants={confettiVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="absolute text-2xl"
                                                style={{
                                                    top: "50%",
                                                    left: "50%",
                                                }}
                                            >
                                                {["✨", "🌟", "💫", "⭐", "🎉", "🎊", "💖", "❤️"][i]}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {result.love_score !== null && result.love_score !== undefined ? (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="text-center relative z-10"
                                    >
                                        {/* Score Circle with Enhanced Animation */}
                                        <div className="relative inline-flex items-center justify-center mb-6">
                                            {/* Pulsing Ring */}
                                            <motion.div
                                                variants={pulseRingVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="absolute inset-0 border-4 rounded-full"
                                                style={{ 
                                                    borderColor: result.love_score >= 80 ? '#10b981' : 
                                                                result.love_score >= 60 ? '#f59e0b' : 
                                                                '#ec4899' 
                                                }}
                                            />
                                            
                                            <motion.div
                                                variants={scoreCircleVariants}
                                                className={`inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-r ${getScoreColor(result.love_score)} shadow-2xl relative`}
                                            >
                                                <motion.span
                                                    variants={scoreTextVariants}
                                                    className="text-3xl font-black text-white"
                                                >
                                                    {result.love_score}%
                                                </motion.span>
                                            </motion.div>
                                        </div>

                                        {/* Score Title */}
                                        <motion.h3
                                            variants={messageVariants}
                                            className="text-2xl font-bold text-white mb-3"
                                        >
                                            {getScoreMessage(result.love_score)}
                                        </motion.h3>

                                        {/* Compatibility Message */}
                                        <motion.p
                                            variants={messageVariants}
                                            className="text-gray-200 text-lg leading-relaxed mb-6"
                                        >
                                            {result.message || "The stars have spoken about your cosmic connection!"}
                                        </motion.p>

                                        {/* Enhanced Animated Hearts */}
                                        <motion.div
                                            variants={containerVariants}
                                            className="flex justify-center space-x-3"
                                        >
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    custom={i}
                                                    variants={heartVariants}
                                                    animate="floating"
                                                    className="text-2xl"
                                                    style={{
                                                        color: result.love_score >= 80 ? '#10b981' : 
                                                               result.love_score >= 60 ? '#f59e0b' : 
                                                               '#ec4899'
                                                    }}
                                                >
                                                    {result.love_score >= 80 ? "💚" : 
                                                     result.love_score >= 60 ? "💛" : "❤️"}
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        {/* Additional Info based on Score */}
                                        <motion.div
                                            variants={messageVariants}
                                            className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                                        >
                                            <p className="text-sm text-gray-300">
                                                {result.love_score >= 80 
                                                    ? "🌟 Your cosmic energies are perfectly aligned! This is a rare celestial connection."
                                                    : result.love_score >= 60
                                                    ? "✨ Strong potential for growth and harmony. The stars favor your bond."
                                                    : "🌙 A beautiful journey ahead. Every cosmic connection has its unique magic."
                                                }
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        variants={messageVariants}
                                        className="text-center"
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="text-4xl mb-4"
                                        >
                                            ❌
                                        </motion.div>
                                        <div className="text-rose-400 text-xl font-semibold mb-3">
                                            Cosmic Calculation Failed
                                        </div>
                                        <p className="text-gray-300 text-lg">
                                            {result.message}
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setResult(null)}
                                            className="mt-4 px-6 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-white font-medium transition-colors duration-300"
                                        >
                                            Try Again
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </>
    );
};

export default LoveCalculator;