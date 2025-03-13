import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    }, 10 * 1000); 

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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Sunscreen Reminder</h2>

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
    </div>
  );
};

export default SunscreenReminder;
