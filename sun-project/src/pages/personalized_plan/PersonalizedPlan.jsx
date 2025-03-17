import React, { useState, useEffect } from 'react';
import { Card, Select, Typography, Row, Col, Progress, message } from 'antd';
import './PersonalizedPlan.css';

const { Title, Text } = Typography;
const { Option } = Select;

const API_KEY = "65bc8111f58a6ebc65a227d27aa0fdb9";
const LAMBDA_API_URL = "https://106iftrk39.execute-api.ap-southeast-2.amazonaws.com/getweatheruv";

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
  const [location, setLocation] = useState(null);

  // Fetch UV index data
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        try {
          const response = await fetch(`${LAMBDA_API_URL}?lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data.uvi !== undefined) {
            setCurrentUvi(typeof data.uvi === 'number' ? data.uvi : Number(data.uvi));
          }
        } catch (error) {
          message.error("Failed to fetch UV data");
        }
      }, (error) => {
        message.error("Unable to get your location");
      });
    }
  }, []);

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
    if (!uvi) return "No Data";
    if (uvi >= 11) return "Extreme";
    if (uvi >= 8) return "Very High";
    if (uvi >= 6) return "High";
    if (uvi >= 3) return "Moderate";
    if (uvi >= 1) return "Low";
    return "Zero";
  };

  const sunscreenAmount = calculateSunscreenAmount();

  return (
    <div className="personalized-plan-container">
      <div className="plan-content-wrapper">
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} sm={24} md={22} lg={20} xl={18}>
            <Card 
              className="plan-card"
              style={{ marginTop: '20px' , marginLeft: '300px'}}
            >
              <Title level={2} style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '10px' }}>
                Personalized Sun Protection Plan
              </Title>

              <div className="uv-info-section">
                <Title level={4} style={{ textAlign: 'center' }}>Current UV Index</Title>
                <div className="uv-display">
                  <Progress
                    type="circle"
                    percent={currentUvi ? (currentUvi / 11) * 100 : 0}
                    format={() => currentUvi || "N/A"}
                    strokeColor={getUvLevelColor(currentUvi)}
                    size={window.innerWidth < 576 ? 100 : 150}
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

              <div className="skin-type-section">
                <Title level={4} style={{ textAlign: 'center' }}>Select Your Skin Type</Title>
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

              {sunscreenAmount && (
                <div className="sunscreen-recommendation">
                  <Title level={4} style={{ textAlign: 'center' }}>Recommended Sunscreen Amount</Title>
                  <div className="sunscreen-amount">
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
                  <div className="recommendation-tips">
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
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PersonalizedPlan;
