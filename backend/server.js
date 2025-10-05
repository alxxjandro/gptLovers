const express = require('express')
const cors = require('cors')
const { generateHealthRecommendation } = require('./gemini')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const API_KEY = process.env.OPENWEATHER_API_KEY

// Convert zipcode to coordinates
app.get('/api/geocode/zipcode', async (req, res) => {
  const { zipcode, country = 'US' } = req.query
  
  if (!zipcode) {
    return res.status(400).json({ error: 'Zipcode is required' })
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenWeather API key not configured' })
  }

  try {
    const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${country}&appid=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Zipcode not found' })
      }
      throw new Error(`Geocoding API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    res.json({
      lat: data.lat,
      lon: data.lon,
      name: data.name,
      country: data.country
    })
  } catch (error) {
    console.error('Error geocoding zipcode:', error)
    res.status(500).json({ error: 'Failed to geocode zipcode' })
  }
})

// Convert city name to coordinates
app.get('/api/geocode/city', async (req, res) => {
  const { city, limit = 5 } = req.query
  
  if (!city) {
    return res.status(400).json({ error: 'City name is required' })
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenWeather API key not configured' })
  }

  try {
    const cleanCity = city.toString().trim()
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCity)}&limit=${limit}&appid=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Geocoding API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        error: `City "${cleanCity}" not found`,
        suggestion: 'Try a different spelling or include country (e.g., "Paris, France")'
      })
    }

    // Return all results for user to choose from
    const results = data.map(location => ({
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      country: location.country,
      state: location.state,
      displayName: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`
    }))

    res.json(results)
  } catch (error) {
    console.error('Error geocoding city:', error)
    res.status(500).json({ error: 'Failed to geocode city' })
  }
})

// Get air quality data for a single location
app.get('/api/air-quality', async (req, res) => {
  const { lat, lon } = req.query
  
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' })
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenWeather API key not configured' })
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`OpenWeather API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    res.json(data.list[0])
  } catch (error) {
    console.error('Error fetching air quality data:', error)
    res.status(500).json({ error: 'Failed to fetch air quality data' })
  }
})

// Get air quality data for multiple locations (grid)
app.post('/api/air-quality/grid', async (req, res) => {
  const { coordinates } = req.body
  
  if (!coordinates || !Array.isArray(coordinates)) {
    return res.status(400).json({ error: 'Coordinates array is required' })
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenWeather API key not configured' })
  }

  try {
    const batchSize = 10
    const results = []
    
    for (let i = 0; i < coordinates.length; i += batchSize) {
      const batch = coordinates.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (coord) => {
        try {
          const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`
          const response = await fetch(url)
          
          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
          }
          
          const data = await response.json()
          return {
            ...coord,
            aqi: data.list[0].main.aqi,
            components: data.list[0].components
          }
        } catch (err) {
          console.warn(`Failed to fetch data for ${coord.lat}, ${coord.lon}:`, err)
          return null
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults.filter(result => result !== null))
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < coordinates.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    res.json(results)
  } catch (error) {
    console.error('Error fetching grid air quality data:', error)
    res.status(500).json({ error: 'Failed to fetch grid air quality data' })
  }
})

// Health Assessment endpoint
app.post('/api/health-assessment', async (req, res) => {
  try {
    const healthAssessment = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };

    console.log('Health Assessment Received:', healthAssessment);

    // --- 1️⃣ Obtener coordenadas de la ciudad ---
    const city = healthAssessment.city;
    if (!city) {
      return res.status(400).json({ error: 'City is required in assessment' });
    }

    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${API_KEY}`;

    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      throw new Error(`Failed to fetch coordinates for city: ${geoRes.status}`);
    }

    const geoData = await geoRes.json();
    if (!geoData.length) {
      return res.status(404).json({ error: `City '${city}' not found` });
    }

    const { lat, lon } = geoData[0];

    // --- 2️⃣ Obtener datos de calidad del aire ---
    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const airRes = await fetch(airUrl);

    if (!airRes.ok) {
      throw new Error(`Failed to fetch air quality data: ${airRes.status}`);
    }

    const airData = await airRes.json();
    const airInfo = airData.list[0];

    // --- 3️⃣ Generar recomendación con Gemini ---
    let recommendation = null;
    try {
      recommendation = await generateHealthRecommendation({
        ...healthAssessment,
        airQuality: airInfo
      });
      console.log('Generated recommendation:', recommendation);
    } catch (geminiError) {
      console.error('Failed to generate AI recommendation:', geminiError);
      recommendation = 'AI recommendation service temporarily unavailable.';
    }

    // --- 4️⃣ Devolver ambos en un array ---
    res.json([
      recommendation,
      {
        aqi: airInfo.main.aqi,
        components: airInfo.components
      }
    ]);

  } catch (error) {
    console.error('Error processing health assessment:', error);
    res.status(500).json({
      error: 'Internal server error while processing assessment'
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})