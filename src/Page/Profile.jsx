import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout, UpdateUser } from "../redux/slices/authSlice";
import authServices from "../server/authServices";
import {
  Edit3,
  Save,
  X,
  LogOut,
  Upload,
  User,
  Mail,
  Calendar,
  Clock,
  Loader
} from "lucide-react";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

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
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, etc.).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setProfileFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, profile_image: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    }

    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value.toString());
      });

      if (profileFile) {
        data.append("profile_image", profileFile);
      }

      const res = await authServices.updateProfile(data);
      if (res.status === 200) {
        dispatch(UpdateUser(res.data.user));
        setEditMode(false);
        setProfileFile(null);
        setErrors({});

        // Show success message
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
      alert(`❌ ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
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
    setProfileFile(null);
    setErrors({});
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const fieldConfig = [
    { name: "username", label: "Username", icon: <User size={18} />, required: true },
    { name: "first_name", label: "First Name", icon: <User size={18} />, required: true },
    { name: "last_name", label: "Last Name", icon: <User size={18} />, required: true },
    { name: "birth_year", label: "Birth Year", icon: <Calendar size={18} /> },
    { name: "birth_month", label: "Birth Month", icon: <Calendar size={18} /> },
    { name: "birth_day", label: "Birth Day", icon: <Calendar size={18} /> },
    { name: "birth_hour", label: "Birth Hour", icon: <Clock size={18} /> },
    { name: "birth_minute", label: "Birth Minute", icon: <Clock size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-400 flex items-center justify-center text-white text-4xl font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {editMode && (
                  <label className="absolute bottom-2 right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                {editMode ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full max-w-md bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-xl font-semibold"
                      placeholder="Enter username"
                    />
                    {errors.username && (
                      <p className="text-red-200 text-sm">{errors.username}</p>
                    )}
                  </div>
                ) : (
                  <h2 className="text-3xl font-bold">{user?.username}</h2>
                )}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-white/80">
                  <Mail size={18} />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-white/80">
                  <Calendar size={18} />
                  <span>Joined {new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Profile Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldConfig.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      {field.icon}
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {editMode ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${errors[field.name]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400"
                            }`}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                        {errors[field.name] && (
                          <p className="text-red-500 text-sm">{errors[field.name]}</p>
                        )}
                      </div>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700 border border-transparent">
                        {formData[field.name] || (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center justify-center gap-2 flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${saving
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                      } text-white`}
                  >
                    {saving ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 flex-1 py-3 px-6 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center gap-2 flex-1 py-3 px-6 rounded-lg font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Edit3 size={20} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;