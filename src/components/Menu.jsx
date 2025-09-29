import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("profile");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // <- parse JSON
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        setUser(null);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("profile");
    setUser(null); // update state so menu updates immediately
    alert("Logged out ✅");
    navigate("/login");
  };

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

          {/* Menu Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-indigo-300 transition-colors">Home</Link>

            {user ? (
              <>
                <Link to="/profile" className="hover:text-indigo-300 transition-colors">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-300 transition-colors">Login</Link>
                <Link to="/signup" className="hover:text-indigo-300 transition-colors">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu (optional) */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
