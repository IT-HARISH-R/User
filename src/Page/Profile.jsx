import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout, UpdateUser } from "../redux/slices/authSlice"; // optional update action
import authServices from "../server/authServices";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    birth_year: user?.birth_year || "",
    birth_month: user?.birth_month || "",
    birth_day: user?.birth_day || "",
    birth_hour: user?.birth_hour || "",
    birth_minute: user?.birth_minute || "",
  });

  const handleLogout = () => {
    dispatch(logout());
    alert("Logged out successfully");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await authServices.updateProfile(formData); // call API
      if (res.status === 200) {
        alert("Profile updated successfully!");
        dispatch(UpdateUser(res.data)); // update redux state
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black text-indigo-200">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold">No Profile Data ⚠️</h2>
          <p className="mt-2 text-indigo-300">Please login to see your profile.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black relative overflow-hidden md:px-4">
      {/* Profile Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full sm:max-w-lg mx-auto bg-gradient-to-br from-black/50 via-indigo-950/50 to-transparent border border-indigo-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-lg"
      >
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg text-2xl font-bold text-white cursor-pointer"
          >
            {user.username ? user.username[0].toUpperCase() : "U"}
          </motion.div>
          {editMode ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-4 text-2xl font-semibold text-white bg-black/30 px-2 rounded"
            />
          ) : (
            <h2 className="mt-4 text-2xl font-semibold text-white">
              {user.username || "Unnamed User"}
            </h2>
          )}
          <p className="text-indigo-300">{user.email}</p> {/* email not editable */}
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-3 text-indigo-200/80">
          <motion.div className="flex justify-between border-b border-indigo-600/20 pb-2 px-2 rounded">
            <span>ID</span>
            <span>{user.id}</span> {/* ID not editable */}
          </motion.div>

          <motion.div className="flex justify-between border-b border-indigo-600/20 pb-2 px-2 rounded">
            <span>Role</span>
            <span>{user.role}</span> {/* Role not editable */}
          </motion.div>

          {/* Editable fields */}
          {["first_name", "last_name", "birth_day", "birth_month", "birth_year", "birth_hour", "birth_minute"].map((field, idx) => (
            <motion.div
              key={idx}
              className="flex justify-between border-b border-indigo-600/20 pb-2 px-2 rounded"
            >
              <span>{field.replace("_", " ").toUpperCase()}</span>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="bg-black/30 px-1 rounded text-white w-20 text-right"
                />
              ) : (
                <span>{formData[field] || "-"}</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex space-x-3">
          {editMode ? (
            <>
              <motion.button
                onClick={handleSave}
                className="flex-1 py-2 rounded-xl bg-green-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                Save
              </motion.button>
              <motion.button
                onClick={() => setEditMode(false)}
                className="flex-1 py-2 rounded-xl bg-gray-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setEditMode(true)}
              className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
            >
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
