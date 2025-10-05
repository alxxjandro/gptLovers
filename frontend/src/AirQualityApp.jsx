import { useEffect, useState } from "react";
import AirQualityMap from "./AirQualityMap";
import CitySearch from "./CitySearch";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function AirQualityApp() {
  const [userPosition, setUserPosition] = useState(null);
  const [userAQData, setUserAQData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationSource, setLocationSource] = useState(null); // 'geolocation' or 'city'
  const [locationInfo, setLocationInfo] = useState(null); // Store location name/info

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try {
          const lat = p.coords.latitude;
          const lon = p.coords.longitude;
          setUserPosition([lat, lon]);
          setLocationSource('geolocation');

          // Fetch current location AQ data from backend
          const url = `${BACKEND_URL}/api/air-quality?lat=${lat}&lon=${lon}`;
          const res = await fetch(url);
          
          if (!res.ok) {
            throw new Error(`API request failed: ${res.status}`);
          }
          
          const data = await res.json();
          setUserAQData({ main: { aqi: data.aqi }, components: data.components });
          setLoading(false);
        } catch (err) {
          setError(`Failed to fetch air quality data: ${err.message}`);
          setLoading(false);
        }
      },
      (err) => {
        setError(`Geolocation error: ${err.message}`);
        setLoading(false);
      }
    );
  }, []);

  // Handle city search
  const handleCitySearch = async (cityName, selectedCity = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let locationData;
      
      // If a specific city was selected from dropdown, use it directly
      if (selectedCity) {
        locationData = selectedCity;
      } else {
        // Get coordinates from city name
        const geocodeUrl = `${BACKEND_URL}/api/geocode/city?city=${encodeURIComponent(cityName)}&limit=1`;
        const geocodeRes = await fetch(geocodeUrl);
        
        if (!geocodeRes.ok) {
          const errorData = await geocodeRes.json();
          throw new Error(errorData.error || `City search failed: ${geocodeRes.status}`);
        }
        
        const cityResults = await geocodeRes.json();
        
        // If multiple results, return them for user selection
        if (cityResults.length > 1) {
          setLoading(false);
          return cityResults;
        }
        
        if (cityResults.length === 0) {
          throw new Error(`City "${cityName}" not found`);
        }
        
        locationData = cityResults[0];
      }
      
      const lat = locationData.lat;
      const lon = locationData.lon;
      
      setUserPosition([lat, lon]);
      setLocationSource('city');
      setLocationInfo({
        name: locationData.name,
        country: locationData.country,
        state: locationData.state,
        displayName: locationData.displayName,
        originalQuery: cityName
      });

      // Fetch air quality data for the city location
      const aqUrl = `${BACKEND_URL}/api/air-quality?lat=${lat}&lon=${lon}`;
      const aqRes = await fetch(aqUrl);
      
      if (!aqRes.ok) {
        throw new Error(`Air quality request failed: ${aqRes.status}`);
      }
      
      const aqData = await aqRes.json();
      setUserAQData({ main: { aqi: aqData.aqi }, components: aqData.components });
      setLoading(false);
    } catch (err) {
      setError(`City search failed: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading map...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: 'red',
        textAlign: 'center',
        padding: '20px'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!userPosition || !userAQData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Waiting for location and air quality data...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <CitySearch 
        onCitySearch={handleCitySearch}
        loading={loading}
      />
      <AirQualityMap 
        backendUrl={BACKEND_URL}
        userPosition={userPosition}
        userAQData={userAQData}
        locationSource={locationSource}
        locationInfo={locationInfo}
      />
    </div>
  );
}