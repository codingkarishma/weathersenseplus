import React from "react";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import "../styles/weatherCard.css";

export default function WeatherCard({ weather }) {
  if (!weather || !weather.main) {
    return (
      <div className="weather-card placeholder">
        <p>Search for a city to see the weather 🌍</p>
      </div>
    );
  }

  const { name, main, weather: weatherInfo, wind } = weather;

  return (
    <div className="weather-card">
      <h2>{name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${weatherInfo[0].icon}@2x.png`}
        alt="weather-icon"
      />
      <h3>{weatherInfo[0].main}</h3>
      <p className="temperature">{Math.round(main.temp)}°C</p>
      <div className="details">
        <p>
          <WiHumidity /> {main.humidity}% Humidity
        </p>
        <p>
          <WiStrongWind /> {wind.speed} m/s Wind
        </p>
      </div>
    </div>
  );
}
