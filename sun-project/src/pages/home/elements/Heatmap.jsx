import React from "react"
import "./Heatmap.css"
import { FaCheckCircle } from "react-icons/fa"
import melanomaImage from "./Rplot11.png"

const Heatmap = () => {
  return (
    <section className="heatmap">
      <div className="heatmap-content">
        <h2>Visualizing Data </h2>
        <p>
        In 2024, within the state of Victoria, the 25-29 age group had the highest melanoma incidence 
        at 9 cases per 100,000 people, followed by 6 cases per 100,000 in the 20-24 age group. The 15-19 
        age group faced the lowest risk, with 2 cases per 100,000. Prolonged sun exposure is a major factor, 
        making early prevention essential. Protect yourself by wearing sunscreen (SPF 50+), sunglasses, and 
        protective clothing, avoiding peak sun hours (10 AM - 4 PM), and regularly checking your skin for changes. 
        Stay sun-safe and take care of your skin!
        </p>

        {/* <ul className="heatmap-list" style={{ color: "black" }}>
          <li>
            <FaCheckCircle className="check-icon" />
            100% Free Heatmap Tool to Visualize Key Data Across Australia
          </li>
          <li>
            <FaCheckCircle className="check-icon" />
            Explore Trends with Interactive Mapping
          </li>
        </ul> */}

        {/* <button className="heatmap-button">Explore more</button> */}
      </div>

      <div className="heatmap-image">
        <img src={melanomaImage} alt="Australia Heatmap" />
      </div>
    </section>
  );
};

export default Heatmap
