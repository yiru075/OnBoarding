import React from "react"
import "./Heatmap.css"
import { FaCheckCircle } from "react-icons/fa"

const Heatmap = () => {
  return (
    <section className="heatmap">
      <div className="heatmap-content">
        <h4>Australia Heatmap</h4>
        <h2>Visualizing Data Across the Continent</h2>
        <p>
          Explore real-time and historical heatmaps of Australia, showcasing trends in weather patterns, 
          population density, internet connectivity, and more. These interactive maps provide valuable 
          insights for researchers, businesses, and policymakers.
        </p>

        <ul className="heatmap-list">
          <li>
            <FaCheckCircle className="check-icon" />
            100% Free Heatmap Tool to Visualize Key Data Across Australia
          </li>
          <li>
            <FaCheckCircle className="check-icon" />
            Explore Trends with Interactive Mapping
          </li>
        </ul>

        <button className="heatmap-button">Explore more</button>
      </div>

      <div className="heatmap-image">
        {/* <img src={heatmapImage} alt="Australia Heatmap" /> */}
      </div>
    </section>
  );
};

export default Heatmap
