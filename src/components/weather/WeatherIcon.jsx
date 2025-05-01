// src/components/weather/WeatherIcon.jsx
import React from 'react';

// Map of OpenWeatherMap icon codes to more descriptive names
const iconMap = {
  '01d': 'clear-day',
  '01n': 'clear-night',
  '02d': 'partly-cloudy-day',
  '02n': 'partly-cloudy-night',
  '03d': 'cloudy',
  '03n': 'cloudy',
  '04d': 'cloudy',
  '04n': 'cloudy',
  '09d': 'rain',
  '09n': 'rain',
  '10d': 'rain',
  '10n': 'rain',
  '11d': 'thunderstorm',
  '11n': 'thunderstorm',
  '13d': 'snow',
  '13n': 'snow',
  '50d': 'fog',
  '50n': 'fog'
};

// Size classes
const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const WeatherIcon = ({ iconCode, description, size = 'md' }) => {
  const iconName = iconMap[iconCode] || 'cloudy';
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Get icon URL from OpenWeatherMap
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  return (
    <img 
      src={iconUrl} 
      alt={description || 'Weather icon'} 
      className={`${sizeClass} object-contain`}
    />
  );
};

export default WeatherIcon;