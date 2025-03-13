import React from "react"
import "./Features.css"
import { FaTshirt, FaSun, FaCalendarCheck, FaStar } from "react-icons/fa"


const features = [
  {
    icon: <FaTshirt className="feature-icon" />,
    title: "Clothing Recommendations",
    description: "Check the disease so you can easily choose the right specialist.",
  },
  {
    icon: <FaSun className="feature-icon" />,
    title: "Heat and UV Trends",
    description: "Choose a specialist according to your disease complaints.",
  },
  {
    icon: <FaCalendarCheck className="feature-icon" />,
    title: "Your Sun Safety Plan",
    description: "Make a schedule with the doctor concerned so you can start the examination.",
  },
  {
    icon: <FaStar className="feature-icon" />,
    title: "UV & Health Insights",
    description: "After conducting an examination with a specialist we can help find the right healing method.",
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
