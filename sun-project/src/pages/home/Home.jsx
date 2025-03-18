import './Home.css'
import React from 'react'
import homeImage from '../../assets/picture/home_image.jpg'
import Features from './elements/Features.jsx'
import Heatmap from './elements/Heatmap.jsx'
import Plan from './elements/Plan.jsx'

const Home = () => {
  return (
    <div>
      <section className="home">
        <div className="home-content">
          <h1>Victoria ranks <span style={{ color: 'orange' }}>3rd in melanoma skin cancer</span> rates nationwide</h1>
          <h2>
            <span>Skin cancer is preventable, stay sun-safe and get regular check-ups.</span>
          </h2>
          <button className="cta-button">Protect your skin today</button>
        </div>

        <div className="home-image">
          <img src={homeImage} alt="Woman under the sun" />
          <div className="home-background"></div>
        </div>
      </section>
      <Features />
      <Heatmap />
      <Plan />
    </div>
  );
};

export default Home;
