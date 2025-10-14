import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Menu = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white">
              AstroApp
            </Link>
          </div>

          {/* Center Menu Links (Home + Prediction) */}
          <div className="flex-1 flex justify-center space-x-6 items-center">
            <Link to="/" className="hover:text-indigo-300 transition-colors">
              Home
            </Link>

            {user && (
              <Link
                to="/predict"
                className="hover:text-indigo-300 transition-colors"
              >
                Prediction
              </Link>
            )}
            <Link to="/audio" className="hover:text-indigo-300 transition-colors">
              audio
            </Link>
          </div>

          {/* Right Side (Profile / Auth Links) */}
          <div className="flex space-x-6 items-center">
            {user ? (
              <Link
                to="/profile"
                className="hover:text-indigo-300 transition-colors"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
