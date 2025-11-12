import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const zodiacSigns = [
  { name: "Aries", img: "https://images.astroyogi.com/strapicmsprod/assets/ARIES_04bdeca59e.svg" },
  { name: "Taurus", img: "https://images.astroyogi.com/strapicmsprod/assets/TAURUS_198b4c97e9.svg" },
  { name: "Gemini", img: "https://images.astroyogi.com/strapicmsprod/assets/GEMINI_9d35540bb9.svg" },
  { name: "Cancer", img: "https://images.astroyogi.com/strapicmsprod/assets/CANCER_364708b894.svg" },
  { name: "Leo", img: "https://images.astroyogi.com/strapicmsprod/assets/LEO_593adbf0e7.svg" },
  { name: "Virgo", img: "https://images.astroyogi.com/strapicmsprod/assets/VIRGO_fb766f0d08.svg" },
  { name: "Libra", img: "https://images.astroyogi.com/strapicmsprod/assets/LIBRA_c60a49cefb.svg" },
  { name: "Scorpio", img: "https://images.astroyogi.com/strapicmsprod/assets/SCORPIO_e6bde48051.svg" },
  { name: "Sagittarius", img: "https://images.astroyogi.com/strapicmsprod/assets/SAGITTARIUS_e0ed1cd1fd.svg" },
  { name: "Capricorn", img: "https://images.astroyogi.com/strapicmsprod/assets/CAPRICORN_ab2706bf23.svg" },
  { name: "Aquarius", img: "https://images.astroyogi.com/strapicmsprod/assets/AQUARIUS_4ad6eab3c3.svg" },
  { name: "Pisces", img: "https://images.astroyogi.com/strapicmsprod/assets/PISCES_4991a00d62.svg" },
];

const ZodiacList = () => {
  return (
    <>
      <div className="text-center mb-8 sm:mb-12">
        <h3 className="text-3xl sm:text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500">
          Today's Zodiac Forecast
        </h3>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Choose your sign to reveal today's personalized horoscope and daily guidance
        </p>
        
        {/* Today's date display */}
        <div className="mt-4 inline-block bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/40 rounded-xl px-6 py-2">
          <p className="text-white font-semibold">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6 justify-center">
        {zodiacSigns.map((sign, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-4 hover:bg-purple-900/40 transition-all text-center shadow-xl backdrop-blur-sm relative overflow-hidden group"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-500/0 to-rose-500/0 group-hover:from-purple-600/20 group-hover:via-pink-500/20 group-hover:to-rose-500/20 transition-all duration-300"></div>
            
            <Link to={`/horoscope/${sign.name.toLowerCase()}`} className="relative z-10">
              <img
                src={sign.img}
                alt={sign.name}
                className="w-16 h-16 mx-auto mb-3 filter drop-shadow-lg group-hover:brightness-110 transition-all"
              />
              <p className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                {sign.name}
              </p>
              <p className="text-xs text-purple-300/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Today's Reading →
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default ZodiacList;