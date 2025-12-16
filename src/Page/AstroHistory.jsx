import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaStar, FaHistory, FaUserAstronaut } from "react-icons/fa";
import { GiMoon, GiSun } from "react-icons/gi";

const AstroHistory = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Format ISO date string to professional format
  const formatCreatedAt = (isoString) => {
    if (!isoString) return "No date available";

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "Invalid date";

      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleString("en-US", options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date error";
    }
  };

  const predictionsArray = user?.predictions || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)",
      borderColor: "rgba(99, 102, 241, 0.5)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden px-4 py-8 bg-gradient-to-br from-gray-900 via-indigo-950/80 to-purple-900 pt-24">
      <StarBackground starDensity={0.002} twinkleSpeed={3} />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl border border-indigo-500/20">
                <FaHistory className="text-2xl text-indigo-300" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Cosmic Archives
                </h2>
                <p className="text-gray-400 mt-1">Your celestial journey through time</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40 rounded-full">
                <FaStar className="text-yellow-400 text-xs" />
                <span className="text-gray-300">{predictionsArray.length} Prediction{predictionsArray.length !== 1 ? 's' : ''}</span>
              </div>
              {user?.name && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40 rounded-full">
                  <FaUserAstronaut className="text-indigo-400 text-xs" />
                  <span className="text-gray-300">{user.name}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800/60 to-gray-900/60 hover:from-gray-700/60 hover:to-gray-800/60 text-white rounded-2xl font-semibold shadow-xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Return</span>
          </button>
        </div>

        {predictionsArray.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 space-y-6"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 flex items-center justify-center">
              <FaHistory className="text-4xl text-gray-500" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-300">No Cosmic Records Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your astrological predictions will appear here once you start exploring the cosmos.
              </p>
            </div>
            <button
              onClick={() => navigate("/predict")}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
              Begin Your Journey
            </button>
          </motion.div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {predictionsArray.map((data, index) => {
              if (!data) return null;

              const displayTime = formatCreatedAt(data.created_at);
              const isRecent = data.created_at && (new Date() - new Date(data.created_at)) < 24 * 60 * 60 * 1000;

              // Check if this prediction has birth info
              const hasBirthInfo =
                data.birth_day !== null &&
                data.birth_month !== null &&
                data.birth_year !== null &&
                data.birth_hour !== null &&
                data.birth_minute !== null;

              // Safely get celestial data
              const julianDay = data.julian_day !== undefined ? data.julian_day : "N/A";
              const moonLongitude = data.moon_longitude !== undefined ? data.moon_longitude : "N/A";
              const sunLongitude = data.sun_longitude !== undefined ? data.sun_longitude : "N/A";

              return (
                <motion.li
                  key={data.id || index}
                  variants={itemVariants}
                  whileHover="hover"

                  className="group relative overflow-hidden"
                >
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500/30 rounded-br-xl"></div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>

                  <div className="relative p-6 bg-gradient-to-br from-gray-800/40 via-gray-900/40 to-gray-800/40 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                    {/* Prediction Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${isRecent ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800/60 border border-gray-700/50'}`}>
                          <span className={`text-sm font-semibold ${isRecent ? 'text-green-300' : 'text-gray-400'}`}>
                            #{predictionsArray.length - index}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-300 font-medium">{displayTime}</p>
                          {isRecent && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                              Recent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Birth Info Section */}
                    {hasBirthInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-5 bg-gradient-to-br from-gray-900/60 to-gray-900/40 rounded-xl border border-gray-700/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <FaUserAstronaut className="text-indigo-300" />
                          </div>
                          <h3 className="text-lg font-bold text-indigo-200">Celestial Coordinates</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Birth Date</p>
                                <p className="text-gray-300 font-medium">
                                  {`${data.birth_year}-${String(data.birth_month).padStart(2, "0")}-${String(data.birth_day).padStart(2, "0")}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <FaClock className="text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Birth Time</p>
                                <p className="text-gray-300 font-medium">
                                  {`${String(data.birth_hour).padStart(2, "0")}:${String(data.birth_minute).padStart(2, "0")}`}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <GiSun className="text-yellow-400" />
                              <div>
                                <p className="text-xs text-gray-500">Sun Longitude</p>
                                <p className="text-gray-300 font-medium font-mono">
                                  {sunLongitude}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <GiMoon className="text-blue-300" />
                              <div>
                                <p className="text-xs text-gray-500">Moon Longitude</p>
                                <p className="text-gray-300 font-medium font-mono">
                                  {moonLongitude}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Prediction Content */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <FaStar className="text-purple-300" />
                        </div>
                        <h3 className="text-lg font-bold text-purple-200">Celestial Insight</h3>
                      </div>

                      <div className="p-5 bg-gray-900/30 rounded-xl border border-gray-700/30">
                        {data.thanglish_explanation ? (
                          <div
                            className="text-gray-100 leading-relaxed prose prose-invert max-w-none space-y-3"
                            dangerouslySetInnerHTML={{
                              __html: data.thanglish_explanation
                                .replace(/\*\*(.*?)\*\*/g, '<span class="text-indigo-300 font-bold">$1</span>')
                                .replace(/\n/g, '<br/>')
                            }}
                          />
                        ) : (
                          <p className="text-gray-400 italic">No prediction content available.</p>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-700/30 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span>Recorded</span>
                      </div>

                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </motion.div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh'
            }}
            animate={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh'
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AstroHistory;