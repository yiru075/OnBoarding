import './UVLevels'
import React, { useEffect, useState, useRef } from "react";
import { Select, Card, Typography, Image, message, Button, Progress } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;
const { Option } = Select;

/**
 * API Configuration Constants
 * API_KEY: OpenWeatherMap API key
 * BASE_URL: Regular weather data API base URL
 * BASE_UVI_URL: UV index data API base URL
 * LAMBDA_API_URL: AWS Lambda function URL for fetching weather and UV index data
 */
const API_KEY = "65bc8111f58a6ebc65a227d27aa0fdb9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const BASE_UVI_URL = "https://api.openweathermap.org/data/3.0/onecall";
const LAMBDA_API_URL = "https://106iftrk39.execute-api.ap-southeast-2.amazonaws.com/getweatheruv"; 

/**
 * Safe exposure times based on UV index levels (in minutes)
 * Following international standard UV index level classification:
 * - Low level (0-2): 60 minutes of safe exposure time
 * - Moderate level (3-5): 45 minutes of safe exposure time
 * - High level (6-7): 25 minutes of safe exposure time
 * - Very High (8-10): 15 minutes of safe exposure time
 * - Extreme (11+): 10 minutes of safe exposure time
 */
const UV_SAFETY_TIMES = {
  low: 60, // 0-2: 60 minutes
  moderate: 45, // 3-5: 45 minutes
  high: 25, // 6-7: 25 minutes
  veryHigh: 15, // 8-10: 15 minutes
  extreme: 10 // 11+: 10 minutes
};

/**
 * Major Australian cities with their geographical coordinates
 * Used for the dropdown selector to allow users to check UV index for specific cities
 */
const cities = [
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", lat: -37.8136, lon: 144.9631 },
  { name: "Brisbane", lat: -27.4698, lon: 153.0251 },
  { name: "Perth", lat: -31.9505, lon: 115.8605 },
  { name: "Adelaide", lat: -34.9285, lon: 138.6007 },
  { name: "Canberra", lat: -35.2809, lon: 149.1300 },
  { name: "Darwin", lat: -12.4634, lon: 130.8456 },
  { name: "Hobart", lat: -42.8821, lon: 147.3272 }
];

/**
 * UVLevels Component
 * Main functions:
 * 1. Display current location's weather information and UV index
 * 2. Provide a safety exposure time countdown based on UV index
 * 3. Allow viewing UV index for major Australian cities
 * 4. Provide sun protection advice based on UV index
 */
const UVLevels = () => {
  // State for current location data
  const [currentLocationData, setCurrentLocationData] = useState(null);
  const [currentUvi, setCurrentUvi] = useState(null);
  
  // State for selected city data
  const [selectedCityData, setSelectedCityData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityUvi, setSelectedCityUvi] = useState(null);
  
  // State for safety timer functionality
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  /**
   * Fetch weather and UV index data from AWS Lambda API
   * @param {number} lat - Location latitude
   * @param {number} lon - Location longitude
   * @param {boolean} isCurrentLocation - Whether this is for current location or selected city
   */
  const fetchWeatherAndUvi = async (lat, lon, isCurrentLocation = false) => {
    try {
      const response = await fetch(`${LAMBDA_API_URL}?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      
      if (data.uvi !== undefined) {
        // Process UV data
        let uviValue = null;
        if (data.uvi !== "No data" && data.uvi !== null) {
          uviValue = typeof data.uvi === 'number' ? data.uvi : Number(data.uvi);
        }
        
        if (isCurrentLocation) {
          // Update current location data
          setCurrentLocationData(data);
          setCurrentUvi(uviValue);
          
          // Only start timer for current location's UV index
          if (uviValue > 0) {
            resetSafetyTimer(uviValue);
          }
        } else {
          // Update selected city data
          setSelectedCityData(data);
          setSelectedCityUvi(uviValue);
        }
      } else {
        message.error("Failed to retrieve data from API.");
      }
    } catch (error) {
      message.error("Failed to fetch data from AWS Lambda.");
    }
  };

  /**
   * Effect hook to get user's current location on component mount
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherAndUvi(latitude, longitude, true);
      }, (error) => {
        console.log("Geolocation error:", error.message);
        message.error("Unable to retrieve your location. Please check permissions or select a city from the dropdown.");
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      message.error("Browser does not support geolocation.");
    }
  }, []);

  /**
   * Handle city selection change event
   * Only updates selected city data when user makes a selection
   * @param {string} value - Selected city name
   */
  const handleCityChange = (value) => {
    const city = cities.find(city => city.name === value);
    if (city) {
      setSelectedCity(city);
      fetchWeatherAndUvi(city.lat, city.lon, false);
    }
  };

  /**
   * Determine color code based on UV index
   * Color coding follows international UV index standards:
   * - null: gray (data unavailable)
   * - 0: light gray (no UV radiation)
   * - 1-2: green (low level)
   * - 3-5: yellow (moderate level)
   * - 6-7: orange (high level)
   * - 8-10: red (very high)
   * - 11+: purple (extreme)
   * @param {number|null} uvi - UV index value
   * @returns {string} Corresponding color code
   */
  const getUvLevelColor = (uvi) => {
    if (uvi === null) return "gray";
    if (uvi === 0) return "#cccccc"; // Light gray, distinct from null
    if (uvi >= 1 && uvi <= 2) return "green"; // low
    if (uvi >= 3 && uvi <= 5) return "#D4B500"; // moderate - more readable yellow
    if (uvi >= 6 && uvi <= 7) return "orange"; // high
    if (uvi >= 8 && uvi <= 10) return "red"; // very high
    return "purple"; // extreme (11+)
  };

  /**
   * Convert UV index to descriptive text
   * Text descriptions follow international UV index standards:
   * - null: "No Data" (data unavailable)
   * - 0: "Zero" (zero)
   * - 1-2: "Low" (low)
   * - 3-5: "Moderate" (moderate)
   * - 6-7: "High" (high)
   * - 8-10: "Very High" (very high)
   * - 11+: "Extreme" (extreme)
   * @param {number|null} uvi - UV index value
   * @returns {string} Text describing UV level
   */
  const getUvLevelText = (uvi) => {
    if (uvi === null) return "No Data";
    if (uvi === 0) return "Zero";
    if (uvi >= 1 && uvi <= 2) return "Low";
    if (uvi >= 3 && uvi <= 5) return "Moderate";
    if (uvi >= 6 && uvi <= 7) return "High";
    if (uvi >= 8 && uvi <= 10) return "Very High";
    return "Extreme";
  };

  /**
   * Provide protection advice based on UV index level
   * Advice includes:
   * - Appropriate sunscreen SPF value
   * - Protection timing
   * - Clothing protection
   * - Outdoor activity recommendations
   * @param {number|null} uvi - UV index value
   * @returns {string} Detailed protection advice text
   */
  const getUvProtectionAdvice = (uvi) => {
    if (uvi === null) return "No data available. Please check your location settings.";
    if (uvi === 0) return "No UV radiation expected. No special precautions needed.";
    if (uvi >= 1 && uvi <= 2) return "Wear sunscreen SPF 30+. Safe to stay outside.";
    if (uvi >= 3 && uvi <= 5) return "Apply SPF 30+ sunscreen every 2 hours, wear protective clothing and sunglasses. Seek shade during midday hours.";
    if (uvi >= 6 && uvi <= 7) return "Reduce time in the sun between 10 a.m. and 4 p.m. Apply SPF 50+ sunscreen every 2 hours, wear protective clothing, sunglasses, and a wide-brim hat.";
    if (uvi >= 8 && uvi <= 10) return "Minimize sun exposure between 10 a.m. and 4 p.m. Apply SPF 50+ sunscreen every 2 hours, wear protective clothing, sunglasses, and a hat. Stay in shade.";
    return "Avoid sun exposure between 10 a.m. and 4 p.m. SPF 50+ sunscreen is essential. Wear protective clothing, sunglasses, and a hat. Stay indoors when possible.";
  };

  /**
   * Determine safe exposure time based on UV index
   * Uses UV_SAFETY_TIMES constant to define safe times for different UV levels
   * Returns 0 when UV is null or 0, indicating no timer needed
   * @param {number|null} uvi - UV index value
   * @returns {number} Safe exposure time (minutes)
   */
  const getSafeExposureTime = (uvi) => {
    if (uvi === null || uvi === 0) return 0;
    if (uvi >= 1 && uvi <= 2) return UV_SAFETY_TIMES.low;
    if (uvi >= 3 && uvi <= 5) return UV_SAFETY_TIMES.moderate;
    if (uvi >= 6 && uvi <= 7) return UV_SAFETY_TIMES.high;
    if (uvi >= 8 && uvi <= 10) return UV_SAFETY_TIMES.veryHigh;
    return UV_SAFETY_TIMES.extreme;
  };

  /**
   * Reset and start safety exposure time countdown based on current UV index
   * Functions:
   * 1. Clear any existing timer
   * 2. Calculate safe time based on current UV index
   * 3. Set initial countdown value (converted to seconds)
   * 4. Display timer start notification
   * 5. Start countdown timer
   * 6. Display warning notification when countdown ends
   * @param {number} currentUvi - Current UV index value
   */
  const resetSafetyTimer = (currentUvi) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Calculate safe exposure time in minutes
    const safeTime = getSafeExposureTime(currentUvi);
    
    if (safeTime > 0) {
      // Set initial time in seconds
      setTimeRemaining(safeTime * 60);
      setIsTimerRunning(true);
      
      // Notify user that timer has started
      const uvLevel = getUvLevelText(currentUvi);
      toast.info(`UV Safety Timer started: ${safeTime} minutes for ${uvLevel} UV level`);
      
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer complete
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            toast.warning(`⚠️ Safe exposure time has ended! Please seek shade and reapply sunscreen.`, {
              autoClose: 10000, // Stay longer
              className: 'uv-alert-toast'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeRemaining(0);
      setIsTimerRunning(false);
    }
  };

  /**
   * Format seconds into MM:SS format time string
   * Used for countdown display, ensures seconds less than 10 are padded with 0
   * @param {number} seconds - Time (seconds)
   * @returns {string} Formatted time string, e.g. "5:09"
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  /**
   * Calculate countdown progress percentage for progress circle component
   * Calculation method: (current remaining time / total safe time) * 100
   * @param {number} current - Current remaining time (seconds)
   * @param {number} uvi - UV index value, used to determine total safe time
   * @returns {number} Percentage of time remaining (0-100)
   */
  const calculateTimePercentage = (current, uvi) => {
    const totalSeconds = getSafeExposureTime(uvi) * 60;
    return (current / totalSeconds) * 100;
  };

  /**
   * Clean up timer when component unmounts to prevent memory leaks
   * Uses useEffect cleanup function to ensure cleanup when component leaves DOM
   */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Component rendering section
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      {/* Notification container for displaying reminders and warnings */}
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Current location weather information */}
      <Title level={2}>Current Location Weather</Title>
      {currentLocationData && (
        <Card style={{ width: 400, margin: "0 auto" }}>
          <Title level={4}>{currentLocationData.name}</Title>
          <p>Temperature: {currentLocationData.temperature}</p>
          <p>Humidity: {currentLocationData.humidity}</p>
          <p>Weather: {currentLocationData.weather}</p>
          
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: getUvLevelColor(currentUvi), fontWeight: 'bold', marginBottom: 8, fontSize: '16px' }}>
              UV Index: {currentUvi === null ? "null" : currentUvi} - {getUvLevelText(currentUvi)}
            </p>
            <p style={{ fontSize: '14px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', color: '#333' }}>
              {getUvProtectionAdvice(currentUvi)}
            </p>
          </div>
          
          {/* Safety Timer Section - only for current location */}
          {currentUvi !== null && currentUvi > 0 && (
            <div style={{ marginTop: 20, marginBottom: 20, border: '1px solid #f0f0f0', borderRadius: '8px', padding: '15px', backgroundColor: '#fafafa' }}>
              <Title level={5}>Safe Sun Exposure Timer</Title>
              <div style={{ marginBottom: 10 }}>
                <Progress 
                  type="circle" 
                  percent={calculateTimePercentage(timeRemaining, currentUvi)} 
                  format={() => formatTime(timeRemaining)}
                  strokeColor={getUvLevelColor(currentUvi)}
                  size={120}
                />
              </div>
              <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>
                Maximum safe time in sun: <span style={{ color: getUvLevelColor(currentUvi) }}>{getSafeExposureTime(currentUvi)} minutes</span>
              </p>
              <p style={{ color: '#333' }}>Stay safe in the sun! Seek shade and reapply sunscreen when the timer ends.</p>
              <Button 
                type="primary" 
                onClick={() => resetSafetyTimer(currentUvi)}
                style={{ marginTop: 10 }}
              >
                Reset Timer
              </Button>
            </div>
          )}
          
          <Image
            width={80}
            src={currentLocationData.icon}
            alt="weather icon"
          />
        </Card>
      )}
      
      {/* City selection area */}
      <Title level={3} style={{ marginTop: 20 }}>Check City UV Index</Title>
      <Select
        style={{ width: 200 }}
        placeholder="Select City"
        onChange={handleCityChange}
        allowClear
      >
        {cities.map(city => (
          <Option key={city.name} value={city.name}>{city.name}</Option>
        ))}
      </Select>
      
      {/* Selected city information card */}
      {selectedCity && selectedCityData && (
        <Card style={{ width: 400, margin: "20px auto" }}>
          <Title level={4}>{selectedCity.name}</Title>
          <div>
            <p style={{ color: getUvLevelColor(selectedCityUvi), fontWeight: 'bold', marginBottom: 8 }}>
              UV Index: {selectedCityUvi === null ? "null" : selectedCityUvi} - {getUvLevelText(selectedCityUvi)}
            </p>
            <p style={{ fontSize: '14px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', color: '#333' }}>
              {getUvProtectionAdvice(selectedCityUvi)}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UVLevels;