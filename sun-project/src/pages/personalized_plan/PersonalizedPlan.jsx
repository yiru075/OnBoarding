import React, { useState } from 'react';
import { Card, Select, Typography, Row, Col, Progress, message, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './PersonalizedPlan.css';

const { Title, Text } = Typography;
const { Option } = Select;

// 更新API端点
const LAMBDA_API_URL = "https://yol6es3kd3.execute-api.ap-southeast-2.amazonaws.com/getsuburbweatheruv";

const skinTypes = [
  { value: 'type1', label: 'Type I - Always burns, never tans' },
  { value: 'type2', label: 'Type II - Usually burns, tans minimally' },
  { value: 'type3', label: 'Type III - Sometimes burns, tans uniformly' },
  { value: 'type4', label: 'Type IV - Rarely burns, tans easily' },
  { value: 'type5', label: 'Type V - Very rarely burns, tans very easily' },
  { value: 'type6', label: 'Type VI - Never burns, deeply pigmented' }
];

const PersonalizedPlan = () => {
  const [currentUvi, setCurrentUvi] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [searchSuburb, setSearchSuburb] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle suburb search and fetch weather data
  const fetchWeatherAndUvi = async () => {
    if (!searchSuburb || searchSuburb.trim() === "") {
      message.error("Please enter a valid suburb name");
      return;
    }

    try {
      setErrorMessage(null);
      
      const response = await fetch(LAMBDA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suburb: searchSuburb.trim() })
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
      }
      
      // Create a formatted data object
      const formattedData = {
        name: data.suburb || searchSuburb,
        temperature: data.temperature ? `${data.temperature}°C` : "N/A",
        humidity: data.humidity ? `${data.humidity}%` : "N/A",
        weather: data.weather || "N/A",
      };
      
      // Update weather data and UV index
      setWeatherData(formattedData);
      setCurrentUvi(uviValue);
      
    } catch (error) {
      console.error("API fetch error:", error);
      setErrorMessage("Failed to fetch data from AWS Lambda.");
    }
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchWeatherAndUvi();
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

  // Get UV level color
  const getUvLevelColor = (uvi) => {
    if (!uvi) return "gray";
    if (uvi >= 11) return "purple";
    if (uvi >= 8) return "red";
    if (uvi >= 6) return "orange";
    if (uvi >= 3) return "#D4B500";
    if (uvi >= 1) return "green";
    return "#cccccc";
  };

  // Get UV level text
  const getUvLevelText = (uvi) => {
    if (!uvi) return "zero";
    if (uvi >= 11) return "Extreme";
    if (uvi >= 8) return "Very High";
    if (uvi >= 6) return "High";
    if (uvi >= 3) return "Moderate";
    if (uvi >= 1) return "Low";
    return "Zero";
  };

  const sunscreenAmount = calculateSunscreenAmount();

  return (
    <div className="personalized-plan-container" style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '0',
      margin: '0 auto',
      boxSizing: 'border-box',
      paddingTop: '60px',
      marginLeft: '200px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        padding: '0 20px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Card 
            className="plan-card"
            style={{ 
              width: '100%', 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '20px'
            }}
          >
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '10px' }}>
              Personalized Sun Protection Plan
            </Title>

            {/* Suburb search section */}
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
                Please enter an Australian suburb
              </Text>
              
              <Space direction={screenWidth < 576 ? "vertical" : "horizontal"} size="large" style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                width: screenWidth < 576 ? '100%' : 'auto'
              }}>
                <Input 
                  prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Enter suburb (e.g., Melbourne)" 
                  value={searchSuburb} 
                  onChange={(e) => setSearchSuburb(e.target.value)} 
                  style={{ 
                    width: screenWidth < 576 ? '100%' : '300px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    height: '40px'
                  }} 
                  onPressEnter={handleSearchSubmit}
                />
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />}
                  onClick={handleSearchSubmit}
                  size="large"
                  style={{
                    borderRadius: '6px',
                    height: '40px',
                    boxShadow: '0 2px 6px rgba(24,144,255,0.2)',
                    width: screenWidth < 576 ? '100%' : 'auto'
                  }}
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

            {/* Weather data display */}
            {weatherData && (
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <Title level={4}>{weatherData.name}</Title>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <Text>Temperature: {weatherData.temperature}</Text>
                  <Text>Humidity: {weatherData.humidity}</Text>
                  <Text>Weather: {weatherData.weather}</Text>
                </div>
              </div>
            )}

            {/* UV info section */}
            <div className="uv-info-section" style={{ marginBottom: '30px' }}>
              <Title level={4} style={{ textAlign: 'center' }}>Current UV Index</Title>
              <div className="uv-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Progress
                  type="circle"
                  percent={currentUvi ? (currentUvi / 11) * 100 : 0}
                  format={() => currentUvi !== null ? currentUvi : "N/A"}
                  strokeColor={getUvLevelColor(currentUvi)}
                  size={screenWidth < 576 ? 100 : 150}
                  strokeWidth={8}
                />
                <Text strong style={{ 
                  fontSize: '18px', 
                  marginTop: '10px',
                  color: getUvLevelColor(currentUvi)
                }}>
                  {getUvLevelText(currentUvi)}
                </Text>
              </div>
            </div>

            {/* Skin type section */}
            <div className="skin-type-section" style={{ marginBottom: '30px' }}>
              <Title level={4} style={{ textAlign: 'center' }}>Select Your Skin Type</Title>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Select
                  style={{ width: '100%', maxWidth: '500px' }}
                  placeholder="Choose your skin type"
                  onChange={setSelectedSkinType}
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

            {/* Sunscreen recommendation section */}
            {sunscreenAmount && (
              <div className="sunscreen-recommendation">
                <Title level={4} style={{ textAlign: 'center' }}>Recommended Sunscreen Amount</Title>
                <div className="sunscreen-amount" style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Text strong style={{ 
                    fontSize: '24px',
                    display: 'block',
                    marginBottom: '8px'
                  }}>
                    {sunscreenAmount} teaspoons
                  </Text>
                  <Text type="secondary" style={{ display: 'block' }}>
                    (approximately {sunscreenAmount * 5}ml)
                  </Text>
                </div>
                <div className="recommendation-tips" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <Text strong>Tips:</Text>
                  <ul>
                    <li>Apply sunscreen 15-30 minutes before sun exposure</li>
                    <li>Reapply every 2 hours or after swimming/sweating</li>
                    <li>Don't forget to cover all exposed areas</li>
                    <li>Use broad-spectrum sunscreen (SPF 30+)</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedPlan;
