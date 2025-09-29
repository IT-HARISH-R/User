import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user); 

  if (!user) return <div className="p-6 text-white">Loading profile...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black">
      <div className="bg-black/70 p-8 rounded-2xl border border-indigo-600/30 shadow-2xl w-full max-w-md backdrop-blur-md text-white">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="space-y-3">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>First Name:</strong> {user.first_name || "NA"}</p>
          <p><strong>Last Name:</strong> {user.last_name || "NA"}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
