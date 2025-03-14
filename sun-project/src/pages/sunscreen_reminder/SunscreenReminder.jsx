import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SunscreenReminder.css"

const SunscreenReminder = () => {
  const savedInterval = localStorage.getItem("reminderInterval") || 2;
  const [interval, setIntervalTime] = useState(Number(savedInterval));
  const [isRunning, setIsRunning] = useState(false);
  const reminderTimer = useRef(null); 


  const startReminder = () => {
    if (reminderTimer.current) clearInterval(reminderTimer.current); 
    reminderTimer.current = setInterval(() => {
      toast.info("Time to reapply sunscreen! ");
      console.log("Reminder triggered at", new Date().toLocaleTimeString()); 
    }, 60 * 60 * 1000 * interval); 

    toast.success("Reminder started!");
    setIsRunning(true);
    localStorage.setItem("isRunning", "true"); 
  };

  
  const stopReminder = () => {
    if (reminderTimer.current) clearInterval(reminderTimer.current); 
    toast.error("Reminder stopped!");
    setIsRunning(false);
    localStorage.setItem("isRunning", "false");
  };

  
  useEffect(() => {
    const savedRunningState = localStorage.getItem("isRunning");
    if (savedRunningState === "true") {
      startReminder(); 
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("reminderInterval", interval);
  }, [interval]);

  return (
    <div className="reminder-container">
      <h1>Sunscreen Reminder</h1>
      
      <p className="reminder-highlight">Protect Your Skin Every Day!</p>
      <p className="reminder-text">
        Sunscreen is your best defense against harmful UV rays. It helps prevent sunburn, premature aging, and reduces the risk of skin cancer. No matter the weather, applying sunscreen should be a daily habit.
      </p>
      <p className="reminder-text">
        Reapplying sunscreen is just as important. Sweat, water, and sun exposure can break down its effectiveness, so make sure to reapply every two hours for optimal protection.
      </p>

      <h2 className="reminder-title"> UV Index Alert</h2>
      <label>Reminder Interval (hours): </label>
      <select
        value={interval}
        onChange={(e) => {
          setIntervalTime(Number(e.target.value));
          localStorage.setItem("reminderInterval", e.target.value);
        }}
      >
        <option value="1">1 Hour</option>
        <option value="2">2 Hours</option>
        <option value="3">3 Hours</option>
      </select>

      <button
        onClick={isRunning ? stopReminder : startReminder}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          backgroundColor: isRunning ? "red" : "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isRunning ? "Stop Reminder" : "Start Reminder"}
      </button>

      <div className="tips-section">
        <h3>Sunscreen Tips</h3>
        <ul>
          <li>Use a broad-spectrum SPF 30+ sunscreen.</li>
          <li>Apply sunscreen 15 minutes before going outside.</li>
          <li>Reapply every 2 hours, especially after swimming or sweating.</li>
          <li>Wear sunglasses and a hat for extra protection.</li>
        </ul>
      </div>
    </div>
  );
};

export default SunscreenReminder;
