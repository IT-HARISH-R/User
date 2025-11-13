// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { LuStar, LuMail, LuPhone, LuMapPin, LuInstagram, LuTwitter, LuFacebook, LuArrowUp } from "react-icons/lu";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const floatingOrb = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <footer className="relative  overflow-hidden">
      {/* Nebula Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none bg-black" />
      <div className="absolute -top-20 -left-20 w-80 h-80  rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute  rounded-full blur-md opacity-70 animate-pulse" />
                <LuStar className="h-8 w-8 text-amber-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                AstroApp
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your cosmic companion for Vedic astrology, AI-powered predictions, and celestial love insights.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              {[LuInstagram, LuTwitter, LuFacebook].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.4 }}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-gray-300 hover:text-white hover:bg-indigo-500/30 transition"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Services" },
                { to: "/predict", label: "Get Prediction" },
                { to: "/blog", label: "Cosmic Blog" },
                { to: "/love-calculator", label: "Love Calculator" },
                { to: "/zodiac", label: "Zodiac Signs" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-indigo-300 transition duration-300 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    <span className="ml-2">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <LuMail className="h-4 w-4 text-indigo-400" />
                <span>support@astroapp.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <LuPhone className="h-4 w-4 text-violet-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <LuMapPin className="h-4 w-4 text-purple-400" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Stay Cosmic</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get daily horoscopes & love tips in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-2"
          >
            <span>© {new Date().getFullYear()}</span>
            <span className="text-indigo-300 font-semibold">AstroApp</span>
            <span>• Guided by the stars, powered by AI ✴</span>
          </motion.p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:text-white hover:bg-indigo-500/30 transition"
          >
            <LuArrowUp className="h-4 w-4" />
            <span>Back to Top</span>
          </motion.button>
        </div>
      </div>

      {/* Floating Orbs (Decorative) */}
      <motion.div
        variants={floatingOrb}
        animate="animate"
        className="absolute top-10 left-20 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 blur-md opacity-30"
      />
      <motion.div
        variants={floatingOrb}
        animate="animate"
        className="absolute bottom-20 right-32 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 blur-md opacity-30"
      />
      <motion.div
        variants={floatingOrb}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 blur-md opacity-40"
      />
    </footer>
  );
};

export default Footer;