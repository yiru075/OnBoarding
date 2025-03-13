import React from "react";
import "./Plan.css"; 
import { FaCheckCircle } from "react-icons/fa"; 
import planImage from "../assets/picture/sunglasses.jpg"; 

const Plan = () => {
  return (
    <section className="plan">
      <div className="plan-image">
        <img src={planImage} alt="Sun Safety Plan" />
      </div>

      <div className="plan-content">
        <h4>Personalize a plan to protect your skin</h4>
        <h2>Get your tailored plan for sun safety</h2>
        <p>
          A personalized sun safety plan ensures that you're protected from harmful UV exposure 
          while still maintaining a healthy balance of vitamin D.
        </p>

        <ul className="plan-list">
          <li>
            <FaCheckCircle className="check-icon" />
            <strong>Build life-long sun safe habits</strong>
          </li>
          <li>
            <FaCheckCircle className="check-icon" />
            <strong>Tailored to your skin type and lifestyle</strong>
          </li>
        </ul>

        <button className="plan-button">Get your personalized sun-safety plan now</button>
      </div>
    </section>
  );
};

export default Plan;
