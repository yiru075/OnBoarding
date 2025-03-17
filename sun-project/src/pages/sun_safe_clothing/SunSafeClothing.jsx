import React from 'react';
import { Card, Row, Col, Typography, Tag } from 'antd';
import './SunSafeClothing.css';

const { Title, Text } = Typography;

const clothingData = [
  {
    uviLevel: 'Low (0-2)',
    description: 'Low UV intensity',
    recommendations: [
      'Regular clothing is sufficient',
      'Long-sleeved shirts and pants recommended',
      'Light-colored clothing is suitable'
    ]
  },
  {
    uviLevel: 'Moderate (3-5)',
    description: 'Moderate UV intensity',
    recommendations: [
      'Sun-protective clothing recommended',
      'Choose dark or tightly woven fabrics',
      'Consider wearing a sun hat'
    ]
  },
  {
    uviLevel: 'High (6-7)',
    description: 'High UV intensity',
    recommendations: [
      'Sun-protective clothing required',
      'Choose UPF 30+ rated clothing',
      'Wear wide-brimmed hat and sunglasses'
    ]
  },
  {
    uviLevel: 'Very High (8-10)',
    description: 'Very high UV intensity',
    recommendations: [
      'UPF 50+ rated clothing required',
      'Choose dark, tightly woven fabrics',
      'Full protection: hat, sunglasses, sun-protective clothing'
    ]
  },
  {
    uviLevel: 'Extreme (11+)',
    description: 'Extreme UV intensity',
    recommendations: [
      'Avoid outdoor activities',
      'Professional sun-protective clothing required',
      'Full protection: hat, sunglasses, sun-protective clothing, gloves'
    ]
  }
];

const SunSafeClothing = () => {
  return (
    <div className="sun-safe-clothing-container">
      <Title level={2} style={{ marginTop: '80px',}}>Give recommendations based on uv index</Title>
      <Row gutter={[16, 16]}>
        {clothingData.map((item, index) => (
          <Col xs={24} key={index}>
            <Card 
              title={
                <div className="card-title">
                  <Tag color={
                    index === 0 ? 'green' :
                    index === 1 ? 'blue' :
                    index === 2 ? 'orange' :
                    index === 3 ? 'red' :
                    'purple'
                  }>
                    {item.uviLevel}
                  </Tag>
                </div>
              }
            >
              <Text type="secondary">{item.description}</Text>
              <ul className="recommendations-list">
                {item.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SunSafeClothing;