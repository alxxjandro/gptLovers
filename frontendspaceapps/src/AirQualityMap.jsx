import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AirQualityMap = ({ backendUrl, userPosition, userAQData, locationSource, locationInfo }) => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(8);
  const [gridCache, setGridCache] = useState(new Map());

  // Fixed grid configuration - doesn't change with zoom
  const GRID_CONFIG = {
    // Doubled the step sizes to reduce API calls (4x fewer squares)
    city: { minZoom: 10, stepSize: 0.2, gridSize: 1 },      // Was 0.1
    region: { minZoom: 7, stepSize: 0.6, gridSize: 2 },     // Was 0.3 
    country: { minZoom: 0, stepSize: 1.0, gridSize: 3 }     // Was 0.5
  };

  // Determine grid level based on zoom
  const getGridLevel = (zoom) => {
    if (zoom >= GRID_CONFIG.city.minZoom) return 'city';
    if (zoom >= GRID_CONFIG.region.minZoom) return 'region';
    return 'country';
  };

  // Create grid coordinates around center point
  const createGrid = useCallback((centerLat, centerLon, config) => {
    const grid = [];
    const { stepSize, gridSize } = config;
    const halfSize = gridSize / 2;
    
    for (let i = -halfSize; i <= halfSize; i += stepSize) {
      for (let j = -halfSize; j <= halfSize; j += stepSize) {
        grid.push({
          lat: centerLat + i,
          lon: centerLon + j,
          id: `${(centerLat + i).toFixed(3)},${(centerLon + j).toFixed(3)}`
        });
      }
    }
    return grid;
  }, []);

  // Fetch air quality data with caching
  const fetchGridAirQuality = useCallback(async (coordinates, gridLevel) => {
    const cacheKey = `${gridLevel}-${coordinates.length}`;
    
    // Check cache first
    if (gridCache.has(cacheKey)) {
      console.log(`Using cached data for ${gridLevel} level`);
      return gridCache.get(cacheKey);
    }

    console.log(`Fetching air quality data for ${coordinates.length} locations (${gridLevel} level)...`);
    
    try {
      const response = await fetch(`${backendUrl}/api/air-quality/grid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinates })
      });
      
      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }
      
      const results = await response.json();

      // Cache the results for 5 minutes
      setGridCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, results);
        // Clear cache after 5 minutes
        setTimeout(() => {
          setGridCache(cache => {
            const updatedCache = new Map(cache);
            updatedCache.delete(cacheKey);
            return updatedCache;
          });
        }, 5 * 60 * 1000);
        return newCache;
      });

      return results;
    } catch (err) {
      console.error('Failed to fetch grid data:', err);
      return [];
    }
  }, [backendUrl, gridCache]);

  // Load grid data when position or grid level changes
  useEffect(() => {
    if (!userPosition || !backendUrl) return;

    const loadGridData = async () => {
      const gridLevel = getGridLevel(currentZoom);
      const config = GRID_CONFIG[gridLevel];
      
      setLoading(true);
      
      try {
        const gridCoordinates = createGrid(userPosition[0], userPosition[1], config);
        const gridAQData = await fetchGridAirQuality(gridCoordinates, gridLevel);
        setGridData(gridAQData);
      } catch (err) {
        console.error('Failed to load grid data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGridData();
  }, [userPosition, currentZoom, backendUrl, createGrid, fetchGridAirQuality]);

  // Handle zoom changes with debouncing
  const handleZoomChange = useCallback((newZoom) => {
    const currentLevel = getGridLevel(currentZoom);
    const newLevel = getGridLevel(newZoom);
    
    // Only reload data if grid level actually changes
    if (currentLevel !== newLevel) {
      setCurrentZoom(newZoom);
    }
  }, [currentZoom]);

  const getColor = (aqi) => {
    const colors = ["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#7e0023"];
    return colors[aqi - 1] || "#999";
  };

  const getAQIDescription = (aqi) => {
    const descriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    return descriptions[aqi - 1] || "Unknown";
  };

  const currentGridLevel = getGridLevel(currentZoom);
  const currentStepSize = GRID_CONFIG[currentGridLevel].stepSize;

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer 
        center={userPosition} 
        zoom={currentZoom} 
        style={{ height: "100vh", width: "100%" }}
        whenReady={(map) => {
          map.target.on('zoomend', (e) => {
            handleZoomChange(e.target.getZoom());
          });
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Grid overlay for air quality */}
        {gridData.map((point, index) => {
          const bounds = [
            [point.lat - currentStepSize/2, point.lon - currentStepSize/2],
            [point.lat + currentStepSize/2, point.lon + currentStepSize/2]
          ];
          
          return (
            <Rectangle
              key={`${point.id}-${currentGridLevel}`}
              bounds={bounds}
              pathOptions={{
                fillColor: getColor(point.aqi),
                fillOpacity: 0.4,
                color: getColor(point.aqi),
                weight: 1
              }}
            >
              <Popup>
                <b>Location: {point.lat.toFixed(3)}, {point.lon.toFixed(3)}</b><br/>
                <b>AQI: {point.aqi} ({getAQIDescription(point.aqi)})</b><br/>
                NO₂: {point.components.no2} µg/m³<br/>
                O₃: {point.components.o3} µg/m³<br/>
                SO₂: {point.components.so2} µg/m³<br/>
                PM₂.₅: {point.components.pm2_5} µg/m³<br/>
                PM₁₀: {point.components.pm10} µg/m³<br/>
                CO: {point.components.co} µg/m³<br/>
              </Popup>
            </Rectangle>
          );
        })}

        {/* Current location marker */}
        {userPosition && userAQData && (
          <CircleMarker
            center={userPosition}
            radius={8}
            color="#000"
            fillColor="#fff"
            fillOpacity={1}
            weight={2}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <b>
                  {locationSource === 'city' && locationInfo
                    ? `🏙️ ${locationInfo.displayName || `${locationInfo.name}${locationInfo.state ? `, ${locationInfo.state}` : ''}, ${locationInfo.country}`}`
                    : '📍 Your Current Location'
                  }
                </b><br/>
                {locationSource === 'city' && locationInfo && (
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>
                    Search: "{locationInfo.originalQuery}"
                  </div>
                )}
                <b>AQI: {userAQData.main.aqi} ({getAQIDescription(userAQData.main.aqi)})</b><br/>
                NO₂: {userAQData.components.no2} µg/m³<br/>
                O₃: {userAQData.components.o3} µg/m³<br/>
                SO₂: {userAQData.components.so2} µg/m³<br/>
                PM₂.₅: {userAQData.components.pm2_5} µg/m³<br/>
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Air Quality Index</h4>
        {[
          { aqi: 1, label: 'Good' },
          { aqi: 2, label: 'Fair' },
          { aqi: 3, label: 'Moderate' },
          { aqi: 4, label: 'Poor' },
          { aqi: 5, label: 'Very Poor' }
        ].map(({ aqi, label }) => (
          <div key={aqi} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{
              width: '20px',
              height: '15px',
              backgroundColor: getColor(aqi),
              marginRight: '8px',
              border: '1px solid #ccc'
            }}></div>
            <span style={{ fontSize: '12px' }}>{aqi} - {label}</span>
          </div>
        ))}
        <div style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>
          Grid: {currentGridLevel}<br/>
          Points: {gridData.length}<br/>
          Zoom: {currentZoom}<br/>
          {locationInfo && (
            <div style={{ marginTop: '5px', paddingTop: '5px', borderTop: '1px solid #eee' }}>
              <strong>🏙️ Found City:</strong><br/>
              <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
                {locationInfo.displayName || `${locationInfo.name}${locationInfo.state ? `, ${locationInfo.state}` : ''}, ${locationInfo.country}`}<br/>
                <span style={{ color: '#666' }}>
                  Search: "{locationInfo.originalQuery}"
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          fontSize: '18px'
        }}>
          Loading air quality data...
        </div>
      )}
    </div>
  );
};

export default AirQualityMap;