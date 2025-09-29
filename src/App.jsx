import React from 'react'
import { Routes, Route, Router } from "react-router-dom";
import Home from './Page/Home';
import { Login } from './Page/Login';
import { Signup } from './Page/Signup';
import Menu from './components/Menu';
import Profile from './Page/profile';
import AstroForm from './Page/AstroForm';
const App = () => {
  return (

    <>

      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/predict" element={<AstroForm />} />

      </Routes>
    </>

  )
}

export default App