import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black">
      <div className="bg-black/70 p-10 rounded-2xl border border-indigo-600/30 shadow-2xl w-full max-w-3xl backdrop-blur-md text-white text-center space-y-6">
        
        {/* Title */}
        <h1 className="text-4xl font-bold"> Astro</h1>
        <p className="text-lg text-gray-300">
          Welcome! Discover insights from Vedic Astrology, explore your
          horoscope, and get personalized predictions.
        </p>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-indigo-600/20">
            <h2 className="text-2xl font-semibold mb-2"> About</h2>
            <p className="text-gray-300 text-sm">
              This platform helps you calculate planetary positions, generate
              your horoscope, and provide insights based on Vedic astrology.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-indigo-600/20">
            <h2 className="text-2xl font-semibold mb-2"> Predictions</h2>
            <p className="text-gray-300 text-sm">
              Try out our prediction feature to know your daily horoscope, life
              insights, and planetary influences.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6 mt-6">
          {/* <Link
            to="/profile"
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition shadow-lg"
          >
            View Profile
          </Link> */}
          <Link
            to="/predict"
            className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition shadow-lg"
          >
            Try Prediction
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
