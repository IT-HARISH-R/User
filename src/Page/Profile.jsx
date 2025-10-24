import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout, UpdateUser } from "../redux/slices/authSlice";
import authServices from "../server/authServices";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    birth_year: "",
    birth_month: "",
    birth_day: "",
    birth_hour: "",
    birth_minute: "",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        birth_year: user.birth_year || "",
        birth_month: user.birth_month || "",
        birth_day: user.birth_day || "",
        birth_hour: user.birth_hour || "",
        birth_minute: user.birth_minute || "",
      });
      setPreviewImage(user.profile_image || null);
      setLoading(false);
    }
  }, [user]);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewImage && profileFile) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage, profileFile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    alert("Logged out successfully");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      console.log("Selected file:", file);
      setProfileFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();

      // Append non-file fields
      const fieldsToSend = [
        "username",
        "first_name",
        "last_name",
        "birth_year",
        "birth_month",
        "birth_day",
        "birth_hour",
        "birth_minute",
      ];
      fieldsToSend.forEach((key) => {
        if (formData[key] != null && formData[key] !== "") {
          data.append(key, formData[key].toString());
        }
      });

      // Append file only if selected
      if (profileFile) {
        data.append("profile_image", profileFile);
      }

      // Debug FormData contents
      for (let [key, value] of data.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      const res = await authServices.updateProfile(data);
      if (res.status === 200) {
        alert("Profile updated successfully!");
        dispatch(UpdateUser(res.data.user));
        setEditMode(false);
      }
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      console.error("updateProfile error:", errorMsg);
      alert(JSON.stringify(errorMsg));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black text-indigo-200">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold">Loading Profile...</h2>
        </motion.div>
      </div>
    );
  }

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

  const fieldLabels = {
    first_name: "First Name",
    last_name: "Last Name",
    birth_day: "Birth Day",
    birth_month: "Birth Month",
    birth_year: "Birth Year",
    birth_hour: "Birth Hour",
    birth_minute: "Birth Minute",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black relative overflow-hidden md:px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full sm:max-w-lg mx-auto bg-gradient-to-br from-black/50 via-indigo-950/50 to-transparent border border-indigo-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-lg"
      >
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center shadow-lg text-2xl font-bold text-white cursor-pointer overflow-hidden"
          >
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.username[0].toUpperCase()
            )}
          </motion.div>

          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3 text-sm text-white"
            />
          )}

          {editMode ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-4 text-2xl font-semibold text-white bg-black/30 px-2 rounded"
            />
          ) : (
            <h2 className="mt-4 text-2xl font-semibold text-white">{user.username || "Unnamed User"}</h2>
          )}
          <p className="text-indigo-300">{user.email}</p>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-3 text-indigo-200/80">
          <motion.div className="flex justify-between border-b border-indigo-600/20 pb-2 px-2 rounded">
            <span>ID</span>
            <span>{user.id}</span>
          </motion.div>

          <motion.div className="flex justify-between border-b border-indigo-600/20 pb-2 px-2 rounded">
            <span>Role</span>
            <span>{user.role}</span>
          </motion.div>

          {Object.keys(fieldLabels).map((field, idx) => (
            <motion.div
              key={idx}
              className="flex justify-between border-b border-indigo-600/20 pb-2 px-2 rounded"
            >
              <span>{fieldLabels[field]}</span>
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
                disabled={saving}
                className={`flex-1 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all ${saving ? "bg-green-400 cursor-not-allowed" : "bg-green-500 text-white"
                  }`}
              >
                {saving ? (
                  <div className="flex justify-center items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
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
