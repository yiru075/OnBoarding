import React from "react";
import "./Information.css"; 


const statsData = [
  {
    number: "900+",
    title: "Verified Specialist",
    desc: "Highly Verified",
  },
  {
    number: "45000+",
    title: "Happy Customers",
    desc: "Highly Performance",
  },
  {
    number: "99,7%",
    title: "Positive Feedback",
    desc: "Customers Approve",
  },
];

const Information = () => {
  return (
    <section className="stats-section">
      <h2 className="stats-title">Insert some interesting data to include into landing page</h2>
      <div className="stats-container">
        {statsData.map((item, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-top-border"></div>
            <h3 className="stat-number">{item.number}</h3>
            <div className="stat-title">{item.title}</div>
            <div className="stat-desc">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Information;
