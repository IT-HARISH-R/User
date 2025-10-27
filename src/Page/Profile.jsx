import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout, UpdateUser } from "../redux/slices/authSlice";
import authServices from "../server/authServices";
// import Sidebar from "../components/Dashboard/Sidebar";
// import Navbar from "../components/Dashboard/Navbar";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
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
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setProfileFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (profileFile) data.append("profile_image", profileFile);

      const res = await authServices.updateProfile(data);
      if (res.status === 200) {
        dispatch(UpdateUser(res.data.user));
        setEditMode(false);
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    window.location.href = "/login";
  };

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
    <div className="flex">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        {/* <Navbar /> */}

        <div className="p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8"
          >
            {/* Profile Header */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute bottom-0 right-0 text-xs cursor-pointer"
                  />
                )}
              </div>

              {editMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-3 text-xl font-semibold border-b border-gray-300 outline-none text-center"
                />
              ) : (
                <h2 className="mt-3 text-xl font-semibold text-gray-800">
                  {user?.username}
                </h2>
              )}
              <p className="text-gray-500">{user?.email}</p>
            </div>

            {/* Profile Info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(fieldLabels).map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    {fieldLabels[field]}
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="mt-1 px-3 py-2 border rounded-md text-gray-800 outline-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                      {formData[field] || "-"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex-1 py-2 rounded-lg font-medium ${
                      saving
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
