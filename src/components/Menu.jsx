import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu as MenuIcon, X } from "lucide-react";

const Menu = () => {
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Main links
  const links = [
    { to: "/", label: "Home" },
    { to: "/plans", label: "Plans" },
    user && { to: "/predict", label: "Prediction" },
    user?.role === "admin" && { to: "/admin/plans", label: "Admin Plans" },
    // user?.role === "admin" && { to: "/admin", label: "Admin " },
    // { to: "/audio", label: "Audio" },
  ].filter(Boolean);

  // Auth links
  const authLinks = user
    ? [ user?.role === "admin" ?{ to: "/admin", label: "Dashboard " }:{ to: "/profile", label: "Profile" }]
    : [
        { to: "/login", label: "Login" },
        { to: "/signup", label: "Sign Up" },
      ];

  // Link rendering
  const renderLink = (link) => {
    const isActive = location.pathname === link.to;

    return (
      <Link
        key={link.to}
        to={link.to}
        className={`
          relative px-4 py-2 rounded-lg font-medium transition-all duration-300
          hover:bg-indigo-700 hover:scale-105 hover:text-white
          ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50" : "text-gray-200"}
        `}
        onClick={() => setIsOpen(false)}
      >
        {link.label}
        {isActive && (
          <span className="absolute left-0 bottom-0 w-full h-1 bg-indigo-400 rounded-full animate-slide-in"></span>
        )}
      </Link>
    );
  };

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 text-white shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors"
            >
              AstroApp
            </Link>
          </div>

          {/* Hamburger button (mobile) */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-indigo-300 focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <MenuIcon size={26} />}
            </button>
          </div>

          {/* Menu links (desktop) */}
          <div className="hidden lg:flex flex-1 justify-center space-x-4 items-center">
            {links.map(renderLink)}
          </div>

          {/* Auth/Profile links (desktop) */}
          <div className="hidden lg:flex space-x-4 items-center">
            {authLinks.map(renderLink)}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-indigo-900/95 backdrop-blur-sm border-t border-indigo-700 px-4 py-4 flex flex-col gap-3">
          {links.map(renderLink)}
          <div className="border-t border-indigo-700 pt-3 flex flex-col gap-2">
            {authLinks.map(renderLink)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
