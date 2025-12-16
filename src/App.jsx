import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './Page/Home';
import { Login } from './Page/Login';
import { Signup } from './Page/Signup';
import Menu from './components/Menu';
import Profile from './Page/Profile';
import AstroForm from './Page/AstroForm';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/slices/authSlice';
import authServices from './server/authServices';
import AstroHistory from './Page/AstroHistory';
import Plans from './Page/Plans';
// import AdminPlans from './components/AdminPlans';
import Dashboard from './Page/Dashboard';
import Users from './components/Dashboard/Users';
// import SettingsForm from './components/Dashboard/SettingsForm';
import Layout from './components/Layout';
import TodayPredictions from './components/TodayPredictions';
import ZodiacDetailPage from './components/Home/ZodiacDetailPage';
import  VoiceChat  from './components/voice-chat/VoiceChat';
import FuturePredictions from './components/Home/FuturePredictions';
import Contact from './Page/Contact';



const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!user && token) {
          const profileRes = await authServices.getProfile();
          console.log("Profile Data:", profileRes.data);
          dispatch(login(profileRes.data));
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
        {/* 🌟 Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/horoscope/:sign" element={<Layout><ZodiacDetailPage /></Layout>} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/Contact" element={<Layout><Contact /></Layout>} />
        <Route path="/predict" element={<AstroForm />} />
        <Route path="/history" element={<AstroHistory />} />
        <Route path="/plans" element={<Plans />} />

        <Route path="/chat" element={<VoiceChat />} />
        <Route path="/future" element={<FuturePredictions />} />
        <Route path="/today" element={<Layout><TodayPredictions /></Layout>} />


        {/* 🌟 Admin Routes (All wrapped inside Layout) */}
        <Route path="/admin" element={<Layout> <Dashboard /> </Layout>} />

      </Routes>
    </>
  );
};

export default App;
