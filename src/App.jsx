import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { FaLocationArrow, FaSun, FaMoon } from "react-icons/fa";
import "./styles/app.css";
import WeatherCard from "./Components/WeatherCard";
import WeatherAnalytics from "./Components/WeatherAnalytics";
import HistoryCard from "./Components/HistoryCard";
import AirQualityCard from "./Components/AirQualityCard";
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

const App = () => {
  const [city, setCity] = useState("Varanasi");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [selectedOption, setSelectedOption] = useState(null);
  const [history, setHistory] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // 🌦 Fetch weather by city name
  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      console.log(`✅ Weather fetched for ${cityName}`);

      // 🧠 Store weather in Firestore
      const weatherEntry = {
        city: cityName,
        temp: res.data.main.temp,
        humidity: res.data.main.humidity,
        time: new Date().toLocaleString(), // keep same name
        timestamp: serverTimestamp(), // ✅ added for proper ordering
      };

      await addDoc(collection(db, "weatherHistory"), weatherEntry);
      console.log("☁️ Saved to Firebase:", weatherEntry);

      // Refresh history
      getWeatherHistory();
    } catch (err) {
      console.error("❌ Weather fetch error:", err);
      alert("City not found or API error.");
    } finally {
      setIsLoading(false);
    }
  };

  // 📍 Fetch weather using coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      console.log(`✅ Location weather fetched (lat: ${lat}, lon: ${lon})`);

      const weatherEntry = {
        city: "My Location",
        temp: res.data.main.temp,
        humidity: res.data.main.humidity,
        time: new Date().toLocaleString(),
        timestamp: serverTimestamp(), // ✅ added
      };

      await addDoc(collection(db, "weatherHistory"), weatherEntry);
      getWeatherHistory();
    } catch (err) {
      console.error("❌ Location fetch error:", err);
      alert("Could not fetch weather for your location.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🌍 Debounced city suggestions
  let debounceTimer;
  const handleInputChange = (inputValue) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (inputValue.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=${API_KEY}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("❌ City suggestions error:", err);
      }
    }, 400);
  };

  // 🧭 Handle city selection
  const handleSelectCity = (option) => {
    if (!option) return;
    const selectedCity = option.value;
    setSelectedOption(option);
    setCity(selectedCity.name);
    fetchWeather(selectedCity.name);
  };

  // 📡 Detect current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
          setCity("My Location");
          setSelectedOption({ label: "📍 My Location", value: "My Location" });
        },
        () => alert("Unable to access location.")
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  // 🔁 Fetch weather history from Firebase
  const getWeatherHistory = async () => {
    try {
      const q = query(collection(db, "weatherHistory"), orderBy("timestamp", "desc"), limit(7)); // ✅ fixed
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setHistory(data);
    } catch (err) {
      console.error("❌ Error fetching history:", err);
    }
  };

  // 🌗 Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    if (!API_KEY) {
      console.error("⚠️ API key not found in .env file!");
      return;
    }
    fetchWeather(city);
    getWeatherHistory();
    document.body.setAttribute("data-theme", theme);

    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing weather data...");
      fetchWeather(city);
      getWeatherHistory();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [API_KEY, city, theme]);

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">🌦️ WeatherSense+</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <Select
            className="city-select"
            placeholder="🔍 Search or choose a city..."
            value={selectedOption}
            onInputChange={(value) => handleInputChange(value)}
            onChange={handleSelectCity}
            options={suggestions.map((s) => ({
              value: s,
              label: `${s.name}, ${s.state ? s.state + ", " : ""}${s.country}`,
            }))}
            noOptionsMessage={() => "Type to search worldwide cities..."}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "12px",
                padding: "4px",
                width: "300px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                borderColor: "#ccc",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "12px",
                zIndex: 999,
              }),
            }}
          />
          <button className="location-btn" onClick={getCurrentLocation} title="Use my location">
            <FaLocationArrow size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="loading">Fetching weather data...</p>
      ) : weather ? (
        <>
          <WeatherCard weather={weather} />
          <p className="auto-refresh">Auto-refresh every 10 minutes active</p>
          <AirQualityCard city={city} />
        </>
      ) : (
        <p className="loading">No data available.</p>
      )}

      {history.length > 0 && (
        <>
          <HistoryCard history={history} />
          <WeatherAnalytics history={history} city={city} />
        </>
      )}
    </div>
  );
};

export default App;
