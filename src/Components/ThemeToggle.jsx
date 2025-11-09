import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "../styles/themeToggle.css";

export default function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}
