import React, { useState } from "react";
import { motion } from "framer-motion";
import authServices from "../server/auth/authServices";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== password2) return alert("Passwords do not match ❌");

    try {
      const res = await authServices.Register({ username, email, password, password2 });
      console.log("Register Response:", res.data);
      alert("Signup Success ✅");
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Signup Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black relative overflow-hidden">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-br from-black/60 via-indigo-950/60 to-transparent border border-indigo-600/30 rounded-2xl p-8 shadow-2xl backdrop-blur-md"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">AstroSignup</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            required
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}



// <div className="relative">
//             <label className="text-sm text-indigo-200/70">Password</label>
//             <motion.input
//               whileFocus={{ scale: 1.01 }}
//               className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-indigo-500/20 placeholder-indigo-300 text-white outline-none pr-10"
//               placeholder="Your secret constellation"
//               type={showPassword ? "text" : "password"}
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <div
//               className="absolute top-1/2 right-3 transform -translate-y-1/2 text-indigo-300 cursor-pointer"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//             </div>
//           </div>
