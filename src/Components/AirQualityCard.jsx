import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/airQuality.css";

export default function AQICard({ city }) {
  const [aqiData, setAqiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const fetchAQI = async () => {
      if (!city) return;
      setIsLoading(true);
      try {
        // Get coordinates for the city
        const geoRes = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        if (!geoRes.data.length) {
          console.error("City not found for AQI");
          setIsLoading(false);
          return;
        }
        const { lat, lon } = geoRes.data[0];

        // Get AQI data
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        setAqiData(res.data.list[0]);
      } catch (err) {
        console.error("AQI fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAQI();
  }, [city]);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: "Good", color: "#4CAF50" };
    if (aqi <= 100) return { label: "Moderate", color: "#FFEB3B" };
    if (aqi <= 150) return { label: "Poor", color: "#FF9800" };
    if (aqi <= 200) return { label: "Unhealthy", color: "#F44336" };
    if (aqi <= 300) return { label: "Severe", color: "#9C27B0" };
    return { label: "Hazardous", color: "#880E4F" };
  };

  return (
    <div className="aqi-card">
      <h2>Live Air Quality</h2>
      {isLoading ? (
        <p>Fetching AQI data...</p>
      ) : aqiData ? (
        (() => {
          const { main, components } = aqiData;
          const status = getAQIStatus(main.aqi * 50); // OpenWeather AQI scale: 1–5 mapped to 0–300

          return (
            <div className="aqi-info" style={{ borderColor: status.color }}>
              <h3 style={{ color: status.color }}>Live AQI: {main.aqi * 50}</h3>
              <p className="aqi-status">
                Air Quality is <strong>{status.label}</strong>
              </p>

              <div className="pollutants">
                <p>
                  <strong>PM2.5:</strong> {components.pm2_5.toFixed(1)} µg/m³
                </p>
                <p>
                  <strong>PM10:</strong> {components.pm10.toFixed(1)} µg/m³
                </p>
              </div>

              <div className="aqi-scale">
                <div className="scale-labels">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Poor</span>
                  <span>Unhealthy</span>
                  <span>Severe</span>
                  <span>Hazardous</span>
                </div>
                <div className="scale-bar">
                  <div
                    className="indicator"
                    style={{ backgroundColor: status.color, left: `${(main.aqi - 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <p>No AQI data available for {city}.</p>
      )}
    </div>
  );
}
