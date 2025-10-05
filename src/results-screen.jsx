import { useState } from "react";
import "./App.css";
import RadialGauge from "./RadialGauge"; // Importa el componente RadialGauge

function Results() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [gaugeValue, setGaugeValue] = useState(99); // Estado para el valor del gauge

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Animated Background Elements */}
      <div className="floating-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>
        <div className="particle particle-9"></div>
        <div className="particle particle-10"></div>
        <div className="particle particle-11"></div>
        <div className="particle particle-12"></div>
      </div>

      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-icon">
          {isDarkTheme ? '☀️' : '🌙'}
        </span>
      </button>

      <div className="content-container">
        {/* Gauge Container */}
        <div className="gauge-container">
          <RadialGauge value={gaugeValue} isDarkTheme={isDarkTheme} /> {/* Pasa el estado del tema */}
        </div>

        {/* Map Container */}
        <div className="map-container">
          {/* Aquí puedes agregar el mapa más adelante */}
        </div>
      </div>
    </div>
  );
}

export default Results;
