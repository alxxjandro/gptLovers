import { useState } from 'react';

const CitySearch = ({ onCitySearch, loading }) => {
  const [city, setCity] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim() || searching) return;

    setSearching(true);
    setShowResults(false);
    try {
      const results = await onCitySearch(city.trim());
      if (results && results.length > 1) {
        setSearchResults(results);
        setShowResults(true);
      }
    } finally {
      setSearching(false);
    }
  };

  const selectCity = async (selectedCity) => {
    setShowResults(false);
    setSearchResults([]);
    setCity(selectedCity.displayName);
    try {
      await onCitySearch(selectedCity.name, selectedCity);
    } catch (err) {
      console.error('Error selecting city:', err);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'white',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: '280px',
      maxWidth: '350px'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            🏙️ Search by City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., New York, Paris, Tokyo)"
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            disabled={searching || loading}
          />
          <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>
            Works globally - try any city name worldwide
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!city.trim() || searching || loading}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: searching || loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: searching || loading ? 'not-allowed' : 'pointer'
          }}
        >
          {searching ? '🔍 Searching...' : '🗺️ Find City'}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div style={{
          marginTop: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '8px', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
            Multiple cities found - select one:
          </div>
          {searchResults.map((result, index) => (
            <div
              key={index}
              style={{
                padding: '8px',
                borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e6f3ff'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              onClick={() => selectCity(result)}
            >
              📍 {result.displayName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;