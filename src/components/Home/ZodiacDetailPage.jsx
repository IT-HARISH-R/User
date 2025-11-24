import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { LuArrowLeft, LuSun, LuMoon, LuStar, LuCalendar } from "react-icons/lu";
import { StarBackground } from "../StarBackground";
import { fetchPredictions } from "../../redux/slices/zodiacSlice";

// 🌟 High-quality zodiac images from reliable sources
const zodiacImages = {
    aries: "https://tse1.mm.bing.net/th/id/OIP.oeSjmPTQRMZ_MzxXwTcC2wHaD5?pid=Api&P=0&h=180",
    taurus: "https://getwallpapers.com/wallpaper/full/3/4/8/1178193-new-taurus-zodiac-sign-wallpaper-1920x1080-for-samsung.jpg",
    gemini: "https://tse4.mm.bing.net/th/id/OIP.wQwUEyiScIntrLXW1mPErgHaE8?pid=Api&P=0&h=180",
    cancer: "https://tse3.mm.bing.net/th/id/OIP.rDGiOoJjZQS1VrzlxoqUKgHaD5?pid=Api&P=0&w=300&h=300",
    leo: "https://tse2.mm.bing.net/th/id/OIP.kJzJQTa9iSwY-RGzY1oGZwHaE8?pid=Api&P=0&h=180",
    virgo: "https://tse4.mm.bing.net/th/id/OIP.ihn4k9ZYMKmmWo_7KxxOvwHaE8?pid=Api&P=0&h=180",
    libra: "https://img.freepik.com/premium-photo/libra-zodiac-sign-horoscope-astrology_297535-4854.jpg",
    scorpio: "https://tse1.mm.bing.net/th/id/OIP.N9nCrEL3p4HXZlZhE8j84AHaE8?pid=Api&P=0&h=180",
    sagittarius: "https://tse1.mm.bing.net/th/id/OIP.hKvu9YfbhKjR6IBlnOVHdgHaD5?pid=Api&P=0&h=180",
    capricorn: "https://tse2.mm.bing.net/th/id/OIP.Y2mO2uKMlrL1cpPQhNDv-AHaD5?pid=Api&P=0&h=180",
    aquarius: "https://tse4.mm.bing.net/th/id/OIP.KvyRlOZ_lt3BeDd5q8cJyQHaD5?pid=Api&P=0&h=180",
    pisces: "https://tse2.mm.bing.net/th/id/OIP.W6SRFqJm4Bq7jtVZUB5aigHaD5?pid=Api&P=0&h=180"
};

// Zodiac icon images (for the symbol display)
const zodiacIcons = {
    aries: "https://images.astroyogi.com/strapicmsprod/assets/ARIES_04bdeca59e.svg",
    taurus: "https://images.astroyogi.com/strapicmsprod/assets/TAURUS_198b4c97e9.svg",
    gemini: "https://images.astroyogi.com/strapicmsprod/assets/GEMINI_9d35540bb9.svg",
    cancer: "https://images.astroyogi.com/strapicmsprod/assets/CANCER_364708b894.svg",
    leo: "https://images.astroyogi.com/strapicmsprod/assets/LEO_593adbf0e7.svg",
    virgo: "https://images.astroyogi.com/strapicmsprod/assets/VIRGO_fb766f0d08.svg",
    libra: "https://images.astroyogi.com/strapicmsprod/assets/LIBRA_c60a49cefb.svg",
    scorpio: "https://images.astroyogi.com/strapicmsprod/assets/SCORPIO_e6bde48051.svg",
    sagittarius: "https://images.astroyogi.com/strapicmsprod/assets/SAGITTARIUS_e0ed1cd1fd.svg",
    capricorn: "https://images.astroyogi.com/strapicmsprod/assets/CAPRICORN_ab2706bf23.svg",
    aquarius: "https://images.astroyogi.com/strapicmsprod/assets/AQUARIUS_4ad6eab3c3.svg",
    pisces: "https://images.astroyogi.com/strapicmsprod/assets/PISCES_4991a00d62.svg",
};

const ZodiacDetailPage = () => {
    const { sign } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { date, predictions, loading, error } = useSelector(
        (state) => state.zodiac
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);


    useEffect(() => {
        dispatch(fetchPredictions());
    }, [dispatch]);

    const zodiacData = predictions?.find(
        (z) => z.sign.toLowerCase() === sign?.toLowerCase()
    );

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-white text-xl">
                Loading today's predictions...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-red-400 text-xl">
                {error}
            </div>
        );
    }

    if (!zodiacData) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-900 via-pink-900 to-black text-white">
                <h1 className="text-3xl font-bold mb-4">Sign Not Found</h1>
                <Link
                    to="/"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition"
                >
                    Back to Today's Zodiac
                </Link>
            </div>
        );
    }

    // Format readable date
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: 'long',
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen relative overflow-hidden flex justify-center items-center bg-gradient-to-b from-purple-900 via-pink-900 to-black text-white">
            <StarBackground />

            {/* ✨ Background Zodiac Image Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{
                    backgroundImage: `url(${zodiacImages[zodiacData.sign.toLowerCase()]})`,
                }}
            ></div>

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-4xl p-8 md:p-12 rounded-3xl border border-purple-400/40 bg-black/60 backdrop-blur-md text-center shadow-[0_0_80px_rgba(192,132,252,0.4)]"
            >
                {/* 🔙 Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center text-gray-300 hover:text-purple-400 transition group"
                >
                    <LuArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                </button>

                {/* 📅 Today's Date Badge */}
                <div className="absolute top-6 right-6 flex items-center bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-400/30 rounded-xl px-4 py-2">
                    <LuCalendar className="mr-2 h-4 w-4 text-purple-300" />
                    <span className="text-sm font-medium text-white">{formattedDate}</span>
                </div>

                {/* ♈ Header */}
                <div className="space-y-4 mb-8 pt-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-white capitalize">
                        {zodiacData.sign}
                    </h1>
                    <div className="flex items-center justify-center space-x-2 text-purple-300">
                        <LuStar className="h-5 w-5 animate-pulse" />
                        <p className="text-lg font-medium">Today's Horoscope</p>
                        <LuStar className="h-5 w-5 animate-pulse" />
                    </div>
                </div>

                {/* 🌠 Main Image Display */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl mb-8 group"
                >
                    <img
                        src={zodiacImages[zodiacData.sign.toLowerCase()]}
                        alt={zodiacData.sign}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Zodiac Symbol Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <img
                            src={zodiacIcons[zodiacData.sign.toLowerCase()]}
                            alt={`${zodiacData.sign} symbol`}
                            className="w-5h-56 h-56 filter drop-shadow-2xl"
                        />
                    </div>
                </motion.div>

                {/* ✨ Today's Horoscope Text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 rounded-2xl border border-purple-500/30 shadow-2xl space-y-6"
                >
                    <div className="flex justify-center space-x-4 text-3xl mb-4">
                        <LuSun className="text-yellow-400 animate-pulse" />
                        <LuMoon className="text-blue-300 animate-pulse delay-75" />
                        <LuStar className="text-purple-300 animate-pulse delay-150" />
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-2">
                            Today's Cosmic Guidance
                        </h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                    </div>

                    <p className="text-gray-100 text-lg leading-relaxed text-left bg-black/30 p-6 rounded-xl border border-purple-400/20">
                        {zodiacData.prediction_text}
                    </p>

                    <div className="mt-6 pt-6 border-t border-purple-400/20">
                        <p className="text-purple-300 text-sm font-medium">
                            ✨ Your day is filled with cosmic potential ✨
                        </p>
                    </div>
                </motion.div>

                {/* 🌌 Back to Today's Zodiac Button */}
                <div className="mt-10">
                    <Link
                        to="/"
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all text-lg font-semibold shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform duration-300"
                    >
                        View All Today's Signs
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ZodiacDetailPage;