// src/services/weather.js
import { useState, useEffect } from 'react';

// Weather service for fetching weather data from OpenWeatherMap
export const useWeatherService = () => {
  const [config, setConfig] = useState({
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo', // Default to demo if not provided
    location: '', // Default location
    units: 'metric' // 'metric' or 'imperial'
  });

  // Load configuration on init
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('family_portal_weather_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(prev => ({
          ...prev,
          ...parsedConfig
        }));
      }
    } catch (error) {
      console.error('Error loading weather configuration:', error);
    }
  }, []);

  // Update configuration and save to localStorage
  const updateConfig = (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    try {
      localStorage.setItem('family_portal_weather_config', JSON.stringify(updatedConfig));
    } catch (error) {
      console.error('Error saving weather configuration:', error);
    }
    
    return updatedConfig;
  };

  // Fetch current weather by location
  const getCurrentWeather = async (location = config.location) => {
    try {
      // Use the location from params or fallback to config
      const query = location || config.location;
      
      if (!query) {
        throw new Error('No location specified');
      }
      
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=${config.units}&appid=${config.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      
      const data = await response.json();
      return transformWeatherData(data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  };

  // Fetch 3-day forecast by location
  const getForecast = async (days = 3, location = config.location) => {
    try {
      // Use the location from params or fallback to config
      const query = location || config.location;
      
      if (!query) {
        throw new Error('No location specified');
      }
      
      // First get coordinates from location name
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${config.apiKey}`;
      
      const geoResponse = await fetch(geoUrl);
      
      if (!geoResponse.ok) {
        const errorData = await geoResponse.json();
        throw new Error(errorData.message || 'Failed to fetch location data');
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData.length) {
        throw new Error('Location not found');
      }
      
      const { lat, lon } = geoData[0];
      
      // Then fetch the forecast using coordinates
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${config.units}&appid=${config.apiKey}`;
      
      const forecastResponse = await fetch(forecastUrl);
      
      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(errorData.message || 'Failed to fetch forecast data');
      }
      
      const forecastData = await forecastResponse.json();
      
      // Process forecast data to get daily forecasts
      return transformForecastData(forecastData, days);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  };

  // Transform current weather data for UI
  const transformWeatherData = (data) => {
    return {
      location: {
        name: data.name,
        country: data.sys.country
      },
      weather: {
        id: data.weather[0].id,
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      },
      temperature: {
        current: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max),
        unit: config.units === 'metric' ? '°C' : '°F'
      },
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg,
        unit: config.units === 'metric' ? 'm/s' : 'mph'
      },
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date()
    };
  };

  // Transform forecast data for UI
  const transformForecastData = (data, days) => {
    // OpenWeatherMap forecast returns data in 3-hour increments
    // Group by day and extract the midday forecast for each day
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Store forecast for midday (closest to 12:00)
      if (!dailyForecasts[day] || Math.abs(date.getHours() - 12) < Math.abs(dailyForecasts[day].date.getHours() - 12)) {
        dailyForecasts[day] = {
          date,
          weather: {
            id: item.weather[0].id,
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          temperature: {
            day: Math.round(item.main.temp),
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
            unit: config.units === 'metric' ? '°C' : '°F'
          },
          wind: {
            speed: item.wind.speed,
            deg: item.wind.deg,
            unit: config.units === 'metric' ? 'm/s' : 'mph'
          },
          humidity: item.main.humidity,
          pressure: item.main.pressure
        };
      }
    });
    
    // Convert to array and sort by date
    const forecasts = Object.values(dailyForecasts)
      .sort((a, b) => a.date - b.date)
      .slice(0, days);
    
    return {
      location: {
        name: data.city.name,
        country: data.city.country
      },
      forecasts,
      timestamp: new Date()
    };
  };

  return {
    getCurrentWeather,
    getForecast,
    config,
    updateConfig
  };
};

export default useWeatherService;