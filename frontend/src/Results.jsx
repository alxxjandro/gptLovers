import { useState, useEffect } from "react";
import "./App.css";
import RadialGauge from "./RadialGauge";

function Results() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const [apiText, setApiText] = useState("Loading recommendation...");
  const [gaugeValue, setGaugeValue] = useState(0);
  const [components, setComponents] = useState({});

  useEffect(() => {
    const saved = sessionStorage.getItem("healthResult");
    if (saved) {
      const [recommendation, airData] = JSON.parse(saved);
      setApiText(recommendation);
      setGaugeValue((airData?.aqi || 1) * 20);
      setComponents(airData?.components || {});
      sessionStorage.removeItem("healthResult");
    }
  }, []);

  const textColor = isDarkTheme ? "#fff" : "#000";

  return (
    <div className={`app ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      {/* Fondo animado */}
      <div className="floating-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Botón de tema */}
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-icon">{isDarkTheme ? "☀️" : "🌙"}</span>
      </button>

      {/* Layout */}
      <div className="results-layout">
        <div className="results-map">
          <div className="map-placeholder">
            <span style={{ color: textColor, opacity: 0.7 }}>
              🗺️ Map Coming Soon
            </span>
          </div>

          <div className="results-text">
            <h3 style={{ color: textColor }}>Today's Insight</h3>
            <p style={{ color: textColor, opacity: 0.85 }}>{apiText}</p>
          </div>
        </div>

        <div className="results-data">
          <div className="results-gauge">
            <RadialGauge value={gaugeValue} isDarkTheme={isDarkTheme} />
          </div>

          <div className="results-score">
            <h2 style={{ color: textColor }}>AQI: {gaugeValue}</h2>
            <p style={{ color: textColor, opacity: 0.7 }}>
              Based on OpenWeather Data
            </p>
          </div>

          <div className="results-params">
            <h3 style={{ color: textColor }}>Key Pollutants</h3>
            <div className="param-grid">
              {Object.entries(components).map(([key, val]) => (
                <div key={key} className="param-card">
                  <span className="param-label">{key.toUpperCase()}</span>
                  <span className="param-value">{val.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
