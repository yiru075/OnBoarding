import React from "react"
import "./Header.css"
import { Link } from "react-router-dom"


const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span>UV</span> Index Alert
      </div>

      <nav className="header-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/uv-levels">UV Levels</Link></li>
          <li><Link to="/personalized-plan">Personalized Sun Safety Plan</Link></li>
          <li><Link to="/sunscreen-reminder">Sun Screen Reminder</Link></li>
          <li><Link to="/sun-safe-clothing">Advice for Clothing</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
