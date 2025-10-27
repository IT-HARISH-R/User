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
import AdminPlans from './Page/AdminPlans';
import Dashboard from './Page/Dashboard';
import Users from './components/Dashboard/Users';
// import SettingsForm from './components/Dashboard/SettingsForm';
import Layout from './components/Layout';

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
        {/* 🌟 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={ <Layout><Profile /></Layout>} />
        <Route path="/predict" element={<AstroForm />} />
        <Route path="/history" element={<AstroHistory />} />
        <Route path="/plans" element={<Plans />} />

        {/* 🌟 Admin Routes (All wrapped inside Layout) */}
        <Route
          path="/admin"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <Layout>
              {/* <SettingsForm /> */}
            </Layout>
          }
        />
        <Route
          path="/admin/plans"
          element={
            <Layout>
              <AdminPlans />
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default App;
