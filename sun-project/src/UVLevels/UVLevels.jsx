import './UVLevels'
import React, { useEffect, useState } from "react";
import { Select, Card, Typography, Image, message } from "antd";

const { Title } = Typography;
const { Option } = Select;

const API_KEY = "65bc8111f58a6ebc65a227d27aa0fdb9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const BASE_UVI_URL = "https://api.openweathermap.org/data/3.0/onecall";

const cities = [
  { name: "Sydney", lat: 33.8688, lon: 151.2093 },
  { name: "Melbourne", lat: 37.8136, lon: 144.9631 },
  { name: "Brisbane", lat: 27.4698, lon: 153.0251 },
  { name: "Perth", lat: 31.9505, lon: 115.8605 },
  { name: "Adelaide", lat: 34.9285, lon: 138.6007 },
  { name: "Canberra", lat: 35.2809, lon: 149.1300 },
  { name: "Darwin", lat: 12.4634, lon: 130.8456 },
  { name: "Hobart", lat: 42.8821, lon: 147.3272 }
];

const UVLevels = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [uvi, setUvi] = useState(null);

  // Get current location information
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
        fetchUvi(latitude, longitude);
      }, (error) => {
        message.error("Unable to retrieve location information, please check permissions");
      });
    } else {
      message.error("Browser does not support geolocation services");
    }
  }, []);

  // Fetch weather data
  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      message.error("Failed to fetch weather data");
    }
  };

  // Fetch UVI data
  const fetchUvi = async (lat, lon) => {
    try {
      const response = await fetch(`${BASE_UVI_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      const data = await response.json();
      setUvi(data.current.uvi);
    } catch (error) {
      message.error("Failed to fetch UVI data");
    }
  };


  // Fetch UVI data when a city is selected
  const handleCityChange = (value) => {
    const city = cities.find(city => city.name === value);
    if (city) {
      setSelectedCity(city);
      fetchUvi(city.lat, city.lon);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <Title level={2}>Weather Information</Title>
      {weatherData && (
        <Card style={{ width: 300, margin: "0 auto" }}>
          <Title level={4}>{weatherData.name}</Title>
          <p>Temperature: {weatherData.main.temp}°C</p >
          <p>Humidity: {weatherData.main.humidity}%</p >
          <p>Weather: {weatherData.weather[0].description}</p >
          <p>UVI Index: {uvi}</p >
          <Image
            width={80}
            src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="weather icon"
          />
        </Card>
      )}
      
      <Title level={3} style={{ marginTop: 20 }}>Check City UVI</Title>
      <Select
        style={{ width: 200 }}
        placeholder="Select City"
        onChange={handleCityChange}
      >
        {cities.map(city => (
          <Option key={city.name} value={city.name}>{city.name}</Option>
        ))}
      </Select>
      
      {selectedCity && (
        <Card style={{ width: 300, margin: "20px auto" }}>
          <Title level={4}>{selectedCity.name}</Title>
          <p>UVI Index: {uvi}</p >
        </Card>
      )}
    </div>
  );
};

export default UVLevels