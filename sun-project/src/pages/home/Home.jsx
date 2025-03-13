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
          <h1>Think You're Too Young for Skin Cancer?</h1>
          <h2>
            <span>Think Again!</span>
          </h2>
          <p>
            Every moment under the sun adds up. With some of the <strong>highest UV levels</strong> in the world, Australia faces a skin cancer crisis, and young adults are at serious risk—even if you don’t see the damage yet.
          </p>
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
