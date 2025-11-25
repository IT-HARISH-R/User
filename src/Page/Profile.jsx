import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout, UpdateUser } from "../redux/slices/authSlice";
import authServices from "../server/authServices";
import { indianCities } from "../data/indianCities";
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
  Loader,
  Crown,
  Globe,
  Shield,
  Sparkles,
  MapPin
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
  const [birthPlaceSuggestions, setBirthPlaceSuggestions] = useState([]);
  const [showBirthPlaceSuggestions, setShowBirthPlaceSuggestions] = useState(false);

  // Language options
  const languageOptions = [
    { value: "en", label: "English", emoji: "🇺🇸" },
    { value: "ta", label: "Tamil", emoji: "🇮🇳" },
    { value: "hi", label: "Hindi", emoji: "🇮🇳" },
  ];

  // Generate dropdown options
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: i + 1 }));
  const days = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: i + 1 }));
  const hours = Array.from({ length: 24 }, (_, i) => ({ value: i, label: i.toString().padStart(2, "0") }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, "0") }));

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
        birth_place: user.birth_place || "",
        language: user.language || "en",
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

    // Handle birth place suggestions
    if (name === "birth_place") {
      if (value.length > 1) {
        const filtered = indianCities.filter(city =>
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 10); // Show top 10 suggestions
        setBirthPlaceSuggestions(filtered);
        setShowBirthPlaceSuggestions(true);
      } else {
        setBirthPlaceSuggestions([]);
        setShowBirthPlaceSuggestions(false);
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBirthPlaceSelect = (place) => {
    setFormData(prev => ({ ...prev, birth_place: place }));
    setBirthPlaceSuggestions([]);
    setShowBirthPlaceSuggestions(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
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
        setBirthPlaceSuggestions([]);
        setShowBirthPlaceSuggestions(false);

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
      birth_place: user.birth_place || "",
      language: user.language || "en",
    });
    setPreviewImage(user.profile_image || null);
    setProfileFile(null);
    setErrors({});
    setBirthPlaceSuggestions([]);
    setShowBirthPlaceSuggestions(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: "from-red-500 to-pink-600", icon: <Shield size={14} />, label: "Admin" },
      astrologer: { color: "from-purple-500 to-indigo-600", icon: <Sparkles size={14} />, label: "Astrologer" },
      customer: { color: "from-blue-500 to-cyan-600", icon: <User size={14} />, label: "Customer" }
    };

    const config = roleConfig[role] || roleConfig.customer;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (isPremium, planType) => {
    const isPremiumUser = isPremium || planType === "premium";
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
        isPremiumUser ? "from-yellow-500 to-orange-600" : "from-gray-500 to-gray-700"
      }`}>
        {isPremiumUser && <Crown size={14} />}
        {isPremiumUser ? "Premium" : "Free"}
      </span>
    );
  };

  // Safe formatting functions
  const formatBirthDateTime = () => {
    if (formData.birth_year && formData.birth_month && formData.birth_day) {
      const date = `${formData.birth_year}-${String(formData.birth_month).padStart(2, '0')}-${String(formData.birth_day).padStart(2, '0')}`;
      
      // Safely check for birth time
      const hasBirthTime = formData.birth_hour != null && formData.birth_minute != null;
      const time = hasBirthTime 
        ? ` at ${String(formData.birth_hour).padStart(2, '0')}:${String(formData.birth_minute).padStart(2, '0')}`
        : '';
      
      return date + time;
    }
    return null;
  };

  // Safe value getter for display
  const getDisplayValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return value;
  };

  // Safe string conversion for form fields
  const getSafeString = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="relative px-8 py-12 text-white">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {editMode && (
                  <label className="absolute bottom-2 right-2 bg-white/90 text-indigo-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-white transition-all duration-300 backdrop-blur-sm">
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
                
                {/* Edit overlay */}
                {editMode && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Upload size={24} className="text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-3">
                  {editMode ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-2xl font-bold"
                        placeholder="Enter username"
                      />
                      {errors.username && (
                        <p className="text-red-200 text-sm">{errors.username}</p>
                      )}
                    </div>
                  ) : (
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {user?.username}
                    </h2>
                  )}
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {getRoleBadge(user?.role)}
                    {getPlanBadge(user?.is_premium, user?.plan_type)}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                      <Sparkles size={14} />
                      {user?.predictions?.length || 0} Predictions
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-white/80">
                    <Mail size={18} />
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-white/80">
                    <Calendar size={18} />
                    <span>Joined {new Date(user?.date_joined).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {formatBirthDateTime() && (
                    <div className="flex items-center justify-center md:justify-start gap-3 text-white/80">
                      <Clock size={18} />
                      <span>Born {formatBirthDateTime()}</span>
                    </div>
                  )}
                  {formData.birth_place && (
                    <div className="flex items-center justify-center md:justify-start gap-3 text-white/80">
                      <MapPin size={18} />
                      <span>From {formData.birth_place}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <User size={24} />
                Personal Information
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 text-sm"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                      <User size={16} />
                      Basic Information
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">First Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="first_name"
                            value={getSafeString(formData.first_name)}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter first name"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-transparent">
                            {getDisplayValue(formData.first_name) || <span className="text-gray-400">Not provided</span>}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="last_name"
                            value={getSafeString(formData.last_name)}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter last name"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-transparent">
                            {getDisplayValue(formData.last_name) || <span className="text-gray-400">Not provided</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Language Preference */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                      <Globe size={16} />
                      Language Preference
                    </label>
                    {editMode ? (
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      >
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value} className="bg-gray-800 text-white">
                            {lang.emoji} {lang.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-transparent">
                        {languageOptions.find(lang => lang.value === formData.language)?.emoji}{" "}
                        {languageOptions.find(lang => lang.value === formData.language)?.label}
                      </div>
                    )}
                  </div>
                </div>

                {/* Birth Details */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <Calendar size={16} />
                    Birth Details
                  </label>
                  <div className="space-y-4">
                    {/* Birth Date */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Birth Date</label>
                      <div className="grid grid-cols-3 gap-2">
                        {editMode ? (
                          <>
                            <select
                              name="birth_year"
                              value={getSafeString(formData.birth_year)}
                              onChange={handleChange}
                              className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="" className="bg-gray-800">Year</option>
                              {years.map((year) => (
                                <option key={year} value={year} className="bg-gray-800">
                                  {year}
                                </option>
                              ))}
                            </select>
                            <select
                              name="birth_month"
                              value={getSafeString(formData.birth_month)}
                              onChange={handleChange}
                              className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="" className="bg-gray-800">Month</option>
                              {months.map((month) => (
                                <option key={month.value} value={month.value} className="bg-gray-800">
                                  {month.label}
                                </option>
                              ))}
                            </select>
                            <select
                              name="birth_day"
                              value={getSafeString(formData.birth_day)}
                              onChange={handleChange}
                              className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="" className="bg-gray-800">Day</option>
                              {days.map((day) => (
                                <option key={day.value} value={day.value} className="bg-gray-800">
                                  {day.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <div className="col-span-3 px-4 py-3 bg-white/5 rounded-xl text-white">
                            {formData.birth_year && formData.birth_month && formData.birth_day 
                              ? `${formData.birth_year}-${String(formData.birth_month).padStart(2, '0')}-${String(formData.birth_day).padStart(2, '0')}`
                              : <span className="text-gray-400">Not provided</span>
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Birth Time */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Birth Time (24h)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {editMode ? (
                          <>
                            <select
                              name="birth_hour"
                              value={getSafeString(formData.birth_hour)}
                              onChange={handleChange}
                              className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="" className="bg-gray-800">Hour</option>
                              {hours.map((hour) => (
                                <option key={hour.value} value={hour.value} className="bg-gray-800">
                                  {hour.label}
                                </option>
                              ))}
                            </select>
                            <select
                              name="birth_minute"
                              value={getSafeString(formData.birth_minute)}
                              onChange={handleChange}
                              className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="" className="bg-gray-800">Minute</option>
                              {minutes.map((minute) => (
                                <option key={minute.value} value={minute.value} className="bg-gray-800">
                                  {minute.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <div className="col-span-2 px-4 py-3 bg-white/5 rounded-xl text-white">
                            {formData.birth_hour != null && formData.birth_minute != null
                              ? `${String(formData.birth_hour).padStart(2, '0')}:${String(formData.birth_minute).padStart(2, '0')}`
                              : <span className="text-gray-400">Not provided</span>
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Birth Place */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Birth Place</label>
                      {editMode ? (
                        <div className="relative">
                          <input
                            type="text"
                            name="birth_place"
                            value={getSafeString(formData.birth_place)}
                            onChange={handleChange}
                            onFocus={() => {
                              if (formData.birth_place && formData.birth_place.length > 1) {
                                const filtered = indianCities.filter(city =>
                                  city.toLowerCase().includes(formData.birth_place.toLowerCase())
                                ).slice(0, 10);
                                setBirthPlaceSuggestions(filtered);
                                setShowBirthPlaceSuggestions(true);
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => setShowBirthPlaceSuggestions(false), 200);
                            }}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter birth place (e.g., Chennai, Tamil Nadu, India)"
                          />
                          {showBirthPlaceSuggestions && birthPlaceSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                              {birthPlaceSuggestions.map((place, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-3 hover:bg-purple-600/50 cursor-pointer text-white border-b border-white/5 last:border-b-0 transition-colors duration-200"
                                  onClick={() => handleBirthPlaceSelect(place)}
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-purple-400" />
                                    {place}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-white/5 rounded-xl text-white border border-transparent">
                          {getDisplayValue(formData.birth_place) || <span className="text-gray-400">Not provided</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editMode && (
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center justify-center gap-3 flex-1 py-4 px-8 rounded-xl font-semibold transition-all duration-300 ${
                    saving
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  } text-white`}
                >
                  {saving ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Saving Changes...
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
                  className="flex items-center justify-center gap-3 flex-1 py-4 px-8 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 mt-6 py-4 px-8 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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