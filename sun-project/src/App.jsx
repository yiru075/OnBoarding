import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './Footer/Footer'; 
import Header from './Header/Header';
import Home from './Home/Home';
import UVLevels from './UVLevels/UVLevels';
import PersonalizedPlan from './PersonalizedPlan/PersonalizedPlan';
import SunscreenReminder from './SunscreenReminder/SunscreenReminder';
import SunSafeClothing from './SunSafeClothing/SunSafeClothing';
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
        <Route path="/sunscreen-reminder" element={<SunscreenReminder />} />
        <Route path="/sun-safe-clothing" element={<SunSafeClothing />} />
      </Routes>
      <Footer />
      <ToastContainer /> 
    </Router>
  );
}

export default App;
