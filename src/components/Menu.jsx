import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    alert("Logged out successfully");
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
                <Link to="/predict" className="hover:text-indigo-300 transition-colors">prediction</Link>
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
        </div>
      </div>
    </nav>
  );
};

export default Menu;
