import React, { useEffect } from 'react'
import { Routes, Route, Router } from "react-router-dom";
import Home from './Page/Home';
import { Login } from './Page/Login';
import { Signup } from './Page/Signup';
import Menu from './components/Menu';
import Profile from './Page/Profile';
import AstroForm from './Page/AstroForm';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/slices/authSlice';
import authServices from './server/authServices';
import AudioRecorder from './components/AudioRecorder';
import AstroHistory from './Page/AstroHistory';
import Plans from './Page/Plans';
import AdminPlans from './Page/AdminPlans';
import { StarBackground } from './components/StarBackground';
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // 🔹 Condition check
        if (!user && token) {
          const profileRes = await authServices.getProfile();
          console.log("Profile Data:", profileRes.data);

          dispatch(login(profileRes.data));
        } else {
          console.log("🪐 Skipped fetching — user exists or token missing");
        }
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [dispatch, user]);
  

  return (

    <>

      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/predict" element={<AstroForm />} />
        {/* <Route path="/audio" element={<AudioRecorder />} /> */}
        <Route path="/history" element={<AstroHistory />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/admin/plans" element={<AdminPlans />} />



      </Routes>
    </>

  )
}

export default App