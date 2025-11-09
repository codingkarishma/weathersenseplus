# 🌦️ WeatherSense+

**WeatherSense+** is a cloud-based weather and air quality monitoring web app built with **React** and **Firebase**.  
It fetches live data from the **OpenWeather API**, displays it instantly, and stores past readings for simple trend analysis — no IoT sensors needed.

---

## 🚀 Overview
WeatherSense+ provides real-time weather and AQI information for any city or your current location.  
All data is securely saved in Firebase and auto-refreshes every 10 minutes for up-to-date insights.

**Core Features:**
- 🌍 Real-time weather & AQI data from OpenWeather
- 📍 City search + live location detection
- 🔁 Auto-refresh every 10 minutes
- 📊 Interactive charts (temperature & humidity trends)
- ☁️ Firebase integration for cloud storage & hosting

---

## 🧩 Tech Stack
- **Frontend:** React.js, Axios, Recharts  
- **Backend / Cloud:** Firebase Firestore & Hosting  
- **APIs:** OpenWeatherMap (Weather + Air Quality)  
- **Languages:** JavaScript (ES6), HTML5, CSS3  

---

## ⚙️ How It Works
1. **Data Collection:**  
   OpenWeather API provides live temperature, humidity, and AQI data.
2. **Processing & Storage:**  
   Axios fetches and formats readings, which are timestamped and stored in Firebase.
3. **Visualization:**  
   Recharts displays past readings as easy-to-read line graphs.
4. **Automation:**  
   Weather data refreshes automatically every 10 minutes.
5. **Cloud Hosting:**  
   Firebase ensures global access with no need for servers or hardware.

---

## 🧱 System Architecture
**Client (Browser)** ↔ **OpenWeather API** ↔ **Firebase (Firestore + Hosting)**  

A fully cloud-based, serverless system that’s fast, lightweight, and globally accessible.

---


## 📸 Results
- **Live Weather Dashboard:** Displays temperature, humidity, and AQI  
- **Analytics Page:** Shows last few readings using line charts  
- **Firebase Storage:** Maintains a historical weather record  

---
Deployed link:- https://weathersenseplus.web.app/
License: MIT © 2025 WeatherSense+
