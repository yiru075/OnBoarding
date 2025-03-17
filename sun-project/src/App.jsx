import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/footer/Footer'; 
import Header from './components/header/Header';
import Home from './pages/home/Home';
import UVLevels from './pages/UV_levels/UVLevels';
import PersonalizedPlan from './pages/personalized_plan/PersonalizedPlan';
import SunscreenReminder from './pages/sunscreen_reminder/SunscreenReminder';
import SunSafeClothing from './pages/sun_safe_clothing/SunSafeClothing';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uv-levels" element={<UVLevels />} />
        <Route path="/personalized-plan" element={<PersonalizedPlan />} />
        {/* <Route path="/sunscreen-reminder" element={<SunscreenReminder />} /> */}
        <Route path="/sun-safe-clothing" element={<SunSafeClothing />} />
      </Routes>
      <Footer />
      <ToastContainer /> 
    </Router>
  );
}

export default App;
