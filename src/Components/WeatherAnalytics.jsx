import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/analytics.css";

const WeatherAnalytics = ({ city }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchCityHistory = async () => {
      try {
        if (!city) return;

        // ✅ Fetch last 10 entries for the selected city
        const q = query(
          collection(db, "weatherHistory"),
          where("city", "==", city),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => doc.data());

        // ✅ Handle timestamp field properly
        const formattedData = fetchedData
          .filter((item) => item.timestamp)
          .map((entry) => {
            let time;
            if (entry.timestamp?.seconds) {
              time = new Date(entry.timestamp.seconds * 1000);
            } else {
              time = new Date(entry.time);
            }
            return {
              ...entry,
              timeLabel: time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              timeValue: time.getTime(),
            };
          })
          .sort((a, b) => a.timeValue - b.timeValue);

        setHistoryData(formattedData);
      } catch (error) {
        console.error("❌ Error fetching weather history:", error);
      }
    };

    fetchCityHistory();
  }, [city]);

  return (
    <div className="analytics-card">
      <h2>📊 Weather Analytics for {city}</h2>
      <p>Recent trends of Temperature (°C) and Humidity (%)</p>

      {historyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={historyData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
            <XAxis dataKey="timeLabel" />
            <YAxis
              yAxisId="left"
              stroke="#4c6ef5"
              label={{
                value: "Temperature / Humidity",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            />
            <Legend verticalAlign="top" />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              stroke="#4c6ef5"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              name="Temperature (°C)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              stroke="#20c997"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              name="Humidity (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No recent data found for {city}.</p>
      )}
    </div>
  );
};

export default WeatherAnalytics;
