import './UVLevels'
import './UVLevels.css'
import React, { useState, useRef, useEffect } from "react";
import { Card, Typography, Image, message, Button, Progress, Row, Col, Input, Space, Divider, Select } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * API Configuration Constants
 * BASE_URL: Regular weather data API base URL
 * BASE_UVI_URL: UV index data API base URL
 * LAMBDA_API_URL: AWS Lambda function URL for fetching weather and UV index data
 */

const LAMBDA_API_URL = "https://yol6es3kd3.execute-api.ap-southeast-2.amazonaws.com/getsuburbweatheruv"; 

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

// Sample data for cities and suburbs
const citySuburbData = {
  Sydney: ['Bondi', 'Manly', 'Parramatta', 'Chatswood', 'Surry Hills', 'Newtown', 'Liverpool', 'Penrith', 'Blacktown', 'Castle Hill', 'North Sydney', 'Hornsby', 'Baulkham Hills', 'Bankstown'],
  Melbourne: ['Fitzroy', 'St Kilda', 'Richmond', 'South Yarra', 'Carlton', 'Docklands', 'Brunswick', 'Footscray', 'Hawthorn', 'Preston', 'Sunshine', 'Toorak', 'Williamstown'],
  Brisbane: ['South Bank', 'Fortitude Valley', 'New Farm', 'Spring Hill', 'West End', 'Chermside', 'Indooroopilly', 'Kangaroo Point', 'Mount Gravatt', 'Woolloongabba', 'Sunnybank', 'Carindale', 'Logan'],
  Perth: ['Fremantle', 'Subiaco', 'Cottesloe', 'Joondalup', 'Scarborough', 'Victoria Park', 'Morley', 'Armadale', 'Rockingham', 'Mandurah', 'Balcatta', 'Gosnells', 'Midland'],
  Adelaide: ['Glenelg', 'North Adelaide', 'Norwood', 'Unley', 'Prospect', 'Mitcham', 'Burnside', 'Marion', 'Salisbury', 'Mawson Lakes', 'Elizabeth', 'Hallett Cove'],
  Canberra: ['Belconnen', 'Gungahlin', 'Tuggeranong', 'Woden', 'Kingston', 'Manuka', 'Fyshwick', 'Dickson', 'Braddon', 'Narrabundah', 'Weston Creek', 'Higgins'],
  Hobart: ['Battery Point', 'Sandy Bay', 'North Hobart', 'Glenorchy', 'Moonah', 'Kingston', 'Bellerive', 'Rosny', 'New Town', 'Lindisfarne', 'Howrah', 'Claremont'],
  Darwin: ['Palmerston', 'Casuarina', 'Nightcliff', 'Larrakeyah', 'Fannie Bay', 'Stuart Park', 'Coconut Grove', 'Rapid Creek', 'Alawa', 'Bayview', 'Moil', 'The Gardens'],
  GoldCoast: ['Surfers Paradise', 'Broadbeach', 'Burleigh Heads', 'Southport', 'Coolangatta', 'Robina', 'Nerang', 'Palm Beach', 'Helensvale', 'Coomera', 'Mudgeeraba', 'Varsity Lakes'],
  Newcastle: ['Merewether', 'Hamilton', 'Charlestown', 'Kotara', 'Lambton', 'Mayfield', 'Belmont', 'Cardiff', 'Wallsend', 'Waratah'],
  SunshineCoast: ['Noosa Heads', 'Maroochydore', 'Mooloolaba', 'Caloundra', 'Buderim', 'Coolum Beach', 'Nambour', 'Peregian Beach', 'Tewantin'],
  Wollongong: ['Wollongong', 'Fairy Meadow', 'Figtree', 'Thirroul', 'Corrimal', 'Warrawong', 'Shellharbour', 'Dapto', 'Unanderra'],
  Geelong: ['Geelong', 'Newtown', 'Highton', 'Belmont', 'Corio', 'Lara', 'Waurn Ponds', 'Grovedale', 'Ocean Grove', 'Torquay'],
  Cairns: ['Cairns City', 'Edge Hill', 'Redlynch', 'Manoora', 'Woree', 'Gordonvale', 'Smithfield', 'Trinity Beach', 'Yorkeys Knob', 'Palm Cove'],
  Townsville: ['Townsville City', 'Kirwan', 'Aitkenvale', 'Annandale', 'Douglas', 'Bohle Plains', 'Idalia', 'Hermit Park', 'West End', 'Garbutt'],
  Bendigo: ['Bendigo', 'Kangaroo Flat', 'Eaglehawk', 'Strathdale', 'Maiden Gully', 'Golden Square', 'Kennington'],
  Ballarat: ['Ballarat', 'Alfredton', 'Bakery Hill', 'Brown Hill', 'Delacombe', 'Wendouree', 'Sebastopol'],
  DarwinRegion: ['Howard Springs', 'Humpty Doo', 'Virginia', 'Herbert', 'Coolalinga'],
};

const skinTypes = [
  { value: 'type1', label: 'Type I - Always burns, never tans' },
  { value: 'type2', label: 'Type II - Usually burns, tans minimally' },
  { value: 'type3', label: 'Type III - Sometimes burns, tans uniformly' },
  { value: 'type4', label: 'Type IV - Rarely burns, tans easily' },
  { value: 'type5', label: 'Type V - Very rarely burns, tans very easily' },
  { value: 'type6', label: 'Type VI - Never burns, deeply pigmented' }
];

/**
 * UVLevels Component
 * Main functions:
 * 1. Display searched location's weather information and UV index
 * 2. Provide a safety exposure time countdown based on UV index
 * 3. Provide sun protection advice based on UV index
 */
const UVLevels = () => {
  // State for displayed weather data
  const [weatherData, setWeatherData] = useState(null);
  const [currentUvi, setCurrentUvi] = useState(null);
  
  // State for safety timer functionality
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // State for suburb search
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // State to track screen size
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // State for skin type selection
  const [selectedSkinType, setSelectedSkinType] = useState(null);
  
  // Update screen width when window resizes
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine sizes based on screen width
  const getResponsiveSize = (small, medium, large) => {
    if (screenWidth < 576) return small;
    if (screenWidth < 768) return medium;
    return large;
  };

  // Update suburb options based on selected city
  const suburbOptions = selectedCity ? citySuburbData[selectedCity] : [];

  /**
   * Fetch weather and UV index data from AWS Lambda API
   * @param {string} suburb - Suburb name to search
   */
  const fetchWeatherAndUvi = async () => {
    if (!selectedSuburb) {
      message.error("Please select a suburb");
      return;
    }

    try {
      setErrorMessage(null);
      
      const response = await fetch(LAMBDA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suburb: selectedSuburb.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || `Request failed with status: ${response.status}`);
        return;
      }

      if (data.error) {
        setErrorMessage(data.error);
        return;
      }

      // Process UV data
      let uviValue = null;
      if (data.uvi !== "No data" && data.uvi !== null && data.uvi !== undefined) {
        uviValue = typeof data.uvi === 'number' ? data.uvi : Number(data.uvi);
        uviValue = Math.round(uviValue); // Round the UV index to the nearest integer
      }
      
      // Create a formatted data object that includes all required fields
      const formattedData = {
        name: data.suburb || selectedSuburb,
        icon: data.icon || "",
        temperature: data.temperature ? `${data.temperature}°C` : "N/A",
        humidity: data.humidity ? `${data.humidity}%` : "N/A",
        weather: data.weather || "N/A",
        uvi: uviValue,
      };
      
      // Update weather data and UV index
      setWeatherData(formattedData);
      setCurrentUvi(uviValue);
      
      // Reset timer when new location is searched
      if (timerRef.current) {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
      }
      
      // Reset time remaining based on new UV value
      if (uviValue > 0) {
        setTimeRemaining(getSafeExposureTime(uviValue) * 60);
        // 自动开始计时器
        startSafetyTimer(uviValue, formattedData.name);
      } else {
        setTimeRemaining(0);
      }
      
    } catch (error) {
      console.error("API fetch error:", error);
      setErrorMessage("Failed to fetch data from AWS Lambda.");
    }
  };

  /**
   * Handle suburb search submit
   */
  const handleSearchSubmit = () => {
    fetchWeatherAndUvi();
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
   * Start safety exposure time countdown based on current UV index
   * Functions:
   * 1. Clear any existing timer
   * 2. Calculate safe time based on current UV index
   * 3. Start countdown timer
   * 4. Display warning notification when countdown ends
   */
  const startSafetyTimer = (uvi = currentUvi, locationName = weatherData?.name) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Only start timer if there is a valid UV index
    if (uvi === null || uvi <= 0) {
      message.info("No UV radiation detected. Timer not needed.");
      return;
    }
    
    setIsTimerRunning(true);
    
    // Notify user that timer has started
    const uvLevel = getUvLevelText(uvi);
    const safeTime = getSafeExposureTime(uvi);
    toast.info(`UV Safety Timer started: ${safeTime} minutes for ${uvLevel} UV level in ${locationName}`);
    
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
  };

  /**
   * Reset safety timer to initial value but don't start it
   */
  const resetSafetyTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const safeTime = getSafeExposureTime(currentUvi);
    setTimeRemaining(safeTime * 60);
    setIsTimerRunning(false);
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
    return totalSeconds > 0 ? (current / totalSeconds) * 100 : 0;
  };

  // Calculate sunscreen amount based on UV index and skin type
  const calculateSunscreenAmount = () => {
    if (!currentUvi || !selectedSkinType) return null;

    // Base amount in teaspoons (1 teaspoon ≈ 5ml)
    let baseAmount = 1;

    // Adjust based on UV index
    if (currentUvi >= 11) baseAmount *= 2.5;
    else if (currentUvi >= 8) baseAmount *= 2;
    else if (currentUvi >= 6) baseAmount *= 1.5;
    else if (currentUvi >= 3) baseAmount *= 1.2;

    // Adjust based on skin type
    const skinTypeMultiplier = {
      'type1': 1.5,
      'type2': 1.3,
      'type3': 1.1,
      'type4': 1,
      'type5': 0.8,
      'type6': 0.6
    };

    return (baseAmount * skinTypeMultiplier[selectedSkinType]).toFixed(1);
  };

  const sunscreenAmount = calculateSunscreenAmount();

  // Clean up timer when component unmounts
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Component rendering section
  return (
    <div className="uv-levels-container" style={{ 
      width: '100%',
      maxWidth: '800px',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      margin: '0 auto',
      boxSizing: 'border-box',
      paddingTop: '60px',
      minHeight: 'calc(100vh - 64px - 50px)', // Ensure full height
      marginLeft: '300px',
    }}>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div style={{ 
        width: '100%',
        maxWidth: '800px',
        padding: '0 20px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Main weather information card */}
          <Typography.Title level={2} style={{ 
            textAlign: 'center', 
            margin: '30px 0 20px 0',
            padding: '0',
            width: '100%'
          }}>
            Weather Information
          </Typography.Title>
          
          {/* Suburb search section - Enter Australian suburb to search for UV data */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            width: '100%'
          }}>
            <Text strong style={{ 
              fontSize: '16px', 
              marginBottom: '5px'
            }}>
              Please select a city and suburb
            </Text>
            
            {/* Responsive search input and button */}
            <Space direction="vertical" size="large" style={{ display: 'flex', justifyContent: 'center' }}>
              <Select
                placeholder="Select a city"
                value={selectedCity}
                onChange={setSelectedCity}
                style={{ width: '300px' }}
              >
                {Object.keys(citySuburbData).map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
              <Select
                placeholder="Select a suburb"
                value={selectedSuburb}
                onChange={setSelectedSuburb}
                style={{ width: '300px' }}
                disabled={!selectedCity}
              >
                {suburbOptions.map(suburb => (
                  <Option key={suburb} value={suburb}>{suburb}</Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchWeatherAndUvi}
                size="large"
                style={{ width: '300px' }}
              >
                Get Weather
              </Button>
            </Space>
          </div>

          {/* Error message display */}
          {errorMessage && (
            <div style={{ 
              textAlign: "center", 
              color: "red", 
              marginBottom: "20px",
              width: '100%'
            }}>
              {errorMessage}
            </div>
          )}
          
          {/* Weather Card - Responsive layout */}
          {weatherData && (
            <Card 
              className="weather-card"
              style={{ 
                width: '100%', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                borderRadius: '8px',
                margin: '0 auto 20px auto',
                padding: screenWidth < 576 ? '15px 10px' : screenWidth < 768 ? '20px 15px' : '20px'
              }}
            >
              <Typography.Title level={4} style={{ textAlign: 'center' }}>
                {weatherData.name}
              </Typography.Title>
              {weatherData.icon && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <Image
                    width={getResponsiveSize(80, 90, 100)}
                    src={weatherData.icon}
                    alt="weather icon"
                    preview={false}
                  />
                </div>
              )}
              <div className="weather-info" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: getResponsiveSize('14px', '15px', '16px') }}>Temperature: {weatherData.temperature}</p>
                <p style={{ fontSize: getResponsiveSize('14px', '15px', '16px') }}>Humidity: {weatherData.humidity}</p>
                <p style={{ fontSize: getResponsiveSize('14px', '15px', '16px') }}>Weather: {weatherData.weather}</p>
              </div>
              
              <div style={{ margin: '20px 0' }}>
                <p style={{ 
                  color: getUvLevelColor(currentUvi), 
                  fontWeight: 'bold', 
                  marginBottom: 12, 
                  fontSize: getResponsiveSize('16px', '17px', '18px'),
                  textAlign: 'center'
                }}>
                  UV Index: {currentUvi === null ? "N/A" : currentUvi} - {getUvLevelText(currentUvi)}
                </p>
                <p style={{ 
                  fontSize: getResponsiveSize('14px', '15px', '16px'), 
                  backgroundColor: '#f5f5f5', 
                  padding: getResponsiveSize('10px', '12px', '15px'), 
                  borderRadius: '8px',
                  color: '#333',
                  margin: '0 auto',
                  maxWidth: '100%'
                }}>
                  {getUvProtectionAdvice(currentUvi)}
                </p>
              </div>
              
              {/* Safety Timer Section - Always display */}
              <div className="timer-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography.Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
                  Safe Sun Exposure Timer
                </Typography.Title>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <Progress 
                    type="circle" 
                    percent={calculateTimePercentage(timeRemaining, currentUvi)} 
                    format={() => currentUvi !== null && currentUvi > 0 ? formatTime(timeRemaining) : "N/A"}
                    strokeColor={getUvLevelColor(currentUvi || 0)}
                    size={getResponsiveSize(100, 120, 150)}
                    strokeWidth={8}
                    status={currentUvi !== null && currentUvi > 0 ? "normal" : "exception"}
                  />
                </div>
                
                <p style={{ 
                  marginTop: '15px', 
                  fontWeight: 'bold',
                  color: '#333',
                  textAlign: 'center',
                  fontSize: getResponsiveSize('14px', '15px', '16px'),
                  width: '100%',
                  padding: '0 10px'
                }}>
                  {currentUvi !== null && currentUvi > 0 ? (
                    <>
                      Maximum safe time in sun: <span style={{ color: getUvLevelColor(currentUvi) }}>
                        {getSafeExposureTime(currentUvi)} minutes
                      </span>
                    </>
                  ) : (
                    <span style={{ color: "#cccccc" }}>
                      No UV radiation detected, timer not needed
                    </span>
                  )}
                </p>
                
                <p style={{ 
                  color: '#333', 
                  textAlign: 'center',
                  fontSize: getResponsiveSize('14px', '15px', '16px'),
                  padding: '0 10px',
                  width: '100%'
                }}>
                  {currentUvi !== null && currentUvi > 0 ? 
                    "Stay safe in the sun! Seek shade and reapply sunscreen when the timer ends." :
                    "No UV protection currently needed. Check back later when UV levels increase."}
                </p>
                
                {/* Responsive button layout */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: getResponsiveSize('10px', '12px', '15px'), 
                  marginTop: '15px',
                  flexDirection: screenWidth < 576 ? 'column' : 'row',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '400px'
                }}>
                  {isTimerRunning ? (
                    <Button 
                      danger
                      onClick={() => {
                        if (timerRef.current) {
                          clearInterval(timerRef.current);
                          setIsTimerRunning(false);
                        }
                      }}
                      style={{ 
                        height: '40px', 
                        padding: '0 25px', 
                        fontSize: getResponsiveSize('14px', '15px', '16px'),
                        borderRadius: '6px',
                        width: screenWidth < 576 ? '100%' : 'auto'
                      }}
                    >
                      Stop Timer
                    </Button>
                  ) : (
                    <Button 
                      onClick={resetSafetyTimer}
                      disabled={currentUvi === null || currentUvi <= 0}
                      style={{ 
                        height: '40px', 
                        padding: '0 25px', 
                        fontSize: getResponsiveSize('14px', '15px', '16px'),
                        borderRadius: '6px',
                        width: screenWidth < 576 ? '100%' : 'auto'
                      }}
                    >
                      Reset Timer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Sunscreen Recommendation Section - Show only when UV data is available */}
      {weatherData && (
        <div style={{ 
          width: '100%',
          maxWidth: '800px',
          padding: '20px',
          marginTop: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Sunscreen Recommendation
          </Title>
          
          <div style={{ marginBottom: '20px' }}>
            <Text strong style={{ display: 'block', marginBottom: '10px', textAlign: 'center' }}>
              Select Your Skin Type
            </Text>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Select
                style={{ width: '100%', maxWidth: '500px' }}
                placeholder="Choose your skin type"
                onChange={setSelectedSkinType}
                value={selectedSkinType}
                size="large"
              >
                {skinTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {currentUvi === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Text type="secondary">
                Currently there is no UV radiation. Sunscreen may not be necessary at this time, 
                but you can still select your skin type to see recommendations for when UV levels increase.
              </Text>
            </div>
          ) : sunscreenAmount && (
            <div style={{ textAlign: 'center' }}>
              <Title level={5}>Recommended Sunscreen Amount</Title>
              <Text strong style={{ 
                fontSize: '24px',
                display: 'block',
                marginBottom: '8px',
                color: getUvLevelColor(currentUvi)
              }}>
                {sunscreenAmount} teaspoons
              </Text>
              <Text type="secondary" style={{ display: 'block', marginBottom: '15px' }}>
                (approximately {(sunscreenAmount * 5).toFixed(1)}ml)
              </Text>
              <div style={{ 
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '8px',
                marginTop: '15px'
              }}>
                <Text strong>Application Tips:</Text>
                <ul style={{ 
                  textAlign: 'left',
                  marginTop: '10px',
                  paddingLeft: '20px'
                }}>
                  <li>Apply sunscreen 15-30 minutes before sun exposure</li>
                  <li>Reapply every 2 hours or after swimming/sweating</li>
                  <li>Don't forget to cover all exposed areas</li>
                  <li>Use broad-spectrum sunscreen (SPF 30+)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UVLevels;