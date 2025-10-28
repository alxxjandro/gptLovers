import { useState, useEffect } from "react";
import "./App.css";
import RadialGauge from "./RadialGauge";
import AirQualityMap from "./AirQualityMap";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

function Results() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const [apiText, setApiText] = useState("Loading recommendation...");
  const [gaugeValue, setGaugeValue] = useState(0);
  const [components, setComponents] = useState({});

  // Map-related state
  const [userPosition, setUserPosition] = useState(null);
  const [userAQData, setUserAQData] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [locationSource, setLocationSource] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      // Get saved health results
      const savedResult = sessionStorage.getItem("healthResult");
      const savedAssessment = sessionStorage.getItem("healthAssessment");

      console.log("Debug - savedResult:", savedResult);
      console.log("Debug - savedAssessment:", savedAssessment);

      if (savedResult) {
        const [recommendation, airData] = JSON.parse(savedResult);
        setApiText(recommendation);
        setGaugeValue((airData?.aqi || 1) * 20);
        setComponents(airData?.components || {});
        sessionStorage.removeItem("healthResult");
      }

      if (savedAssessment) {
        const assessmentData = JSON.parse(savedAssessment);
        const cityName = assessmentData.city;
        console.log("Debug - cityName from assessment:", cityName);
        sessionStorage.removeItem("healthAssessment");

        if (cityName) {
          // Use the city from health assessment
          try {
            setMapLoading(true);

            const geocodeUrl = `${BACKEND_URL}/api/geocode/city?city=${encodeURIComponent(
              cityName
            )}&limit=1`;
            const geocodeRes = await fetch(geocodeUrl);

            if (!geocodeRes.ok) {
              throw new Error(`City search failed: ${geocodeRes.status}`);
            }

            const cityResults = await geocodeRes.json();

            if (cityResults.length === 0) {
              throw new Error(`City "${cityName}" not found`);
            }

            const locationData = cityResults[0];
            const lat = locationData.lat;
            const lon = locationData.lon;

            setUserPosition([lat, lon]);
            setLocationSource("city");
            setLocationInfo({
              name: locationData.name,
              country: locationData.country,
              state: locationData.state,
              displayName: locationData.displayName,
              originalQuery: cityName,
            });

            // Fetch air quality data for the city location
            const aqUrl = `${BACKEND_URL}/api/air-quality?lat=${lat}&lon=${lon}`;
            const aqRes = await fetch(aqUrl);

            if (!aqRes.ok) {
              throw new Error(`Air quality request failed: ${aqRes.status}`);
            }

            const aqData = await aqRes.json();
            setUserAQData({
              main: { aqi: aqData.aqi },
              components: aqData.components,
            });
            setMapLoading(false);
          } catch (err) {
            console.error("Error loading city data:", err);
            setMapError(`Failed to load city data: ${err.message}`);
            setMapLoading(false);
          }
        } else {
          // No city in assessment, fall back to geolocation
          fallbackToGeolocation();
        }
      } else {
        // No health assessment data, fall back to geolocation
        fallbackToGeolocation();
      }
    };

    const fallbackToGeolocation = () => {
      if (!navigator.geolocation) {
        setMapError("Geolocation is not supported by this browser");
        setMapLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (p) => {
          try {
            const lat = p.coords.latitude;
            const lon = p.coords.longitude;
            setUserPosition([lat, lon]);
            setLocationSource("geolocation");

            // Fetch current location AQ data from backend
            const url = `${BACKEND_URL}/api/air-quality?lat=${lat}&lon=${lon}`;
            const res = await fetch(url);

            if (!res.ok) {
              throw new Error(`API request failed: ${res.status}`);
            }

            const data = await res.json();
            setUserAQData({
              main: { aqi: data.aqi },
              components: data.components,
            });
            setMapLoading(false);
          } catch (err) {
            setMapError(`Failed to fetch air quality data: ${err.message}`);
            setMapLoading(false);
          }
        },
        (err) => {
          setMapError(`Geolocation error: ${err.message}`);
          setMapLoading(false);
        }
      );
    };

    initializeData();
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
          <div
            className="map-container"
            style={{
              position: "relative",
              height: "400px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {mapLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  backgroundColor: isDarkTheme ? "#1a1a1a" : "#f5f5f5",
                  color: textColor,
                }}
              >
                Loading map...
              </div>
            ) : mapError ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  backgroundColor: isDarkTheme ? "#1a1a1a" : "#f5f5f5",
                  color: textColor,
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#ff6b6b", marginBottom: "10px" }}>
                  Map Error
                </div>
                <div style={{ fontSize: "14px", opacity: 0.7 }}>{mapError}</div>
              </div>
            ) : userPosition && userAQData ? (
              <AirQualityMap
                backendUrl={BACKEND_URL}
                userPosition={userPosition}
                userAQData={userAQData}
                locationSource={locationSource}
                locationInfo={locationInfo}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  backgroundColor: isDarkTheme ? "#1a1a1a" : "#f5f5f5",
                  color: textColor,
                }}
              >
                Initializing map...
              </div>
            )}
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
            <p style={{ color: textColor, opacity: 0.7 }}>Air Quality Index</p>
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
