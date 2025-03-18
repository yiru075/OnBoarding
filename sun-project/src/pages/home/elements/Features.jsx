import React from "react"
import "./Features.css"
import { FaTshirt, FaSun, FaCalendarCheck, FaStar } from "react-icons/fa"


const features = [
  {
    icon: <FaTshirt className="feature-icon" />,
    title: "Clothing Recommendations",
    description: "Check the clothing suggestion to keep you safe under the sun exposure.",
  },
  {
    icon: <FaSun className="feature-icon" />,
    title: "Heat and UV Trends",
    description: "Know what the UV index is before going outdoors.",
  },
  {
    icon: <FaCalendarCheck className="feature-icon" />,
    title: "Your Sun Safety Plan",
    description: "Equip a better understanding of your skin and get a right way to protect.",
  },
  {
    icon: <FaStar className="feature-icon" />,
    title: "UV & Health Insights",
    description: "Advices and resources from specialists.",
  }
];

const Features = () => {
  return (
    <section className="features">
      <h2>how to stay safe under the sun</h2>
      <div className="feature-list">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            {/* Top Orange Border */}
            <div className="feature-top-border"></div> 
            {feature.icon}
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
