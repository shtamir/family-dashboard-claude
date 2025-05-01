// src/components/weather/ForecastDay.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import WeatherIcon from './WeatherIcon';

const ForecastDay = ({ day }) => {
  const { t } = useTranslation();
  
  // Format day name
  const dayName = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' });
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
      <div className="font-medium text-gray-800 dark:text-gray-200">
        {dayName}
      </div>
      
      <WeatherIcon 
        iconCode={day.weather.icon}
        description={day.weather.description}
        size="sm"
      />
      
      <div className="text-sm mt-1">
        <span className="font-medium text-gray-800 dark:text-white">
          {day.temperature.max}{day.temperature.unit}
        </span>
        <span className="text-gray-500 dark:text-gray-400 mx-1">/</span>
        <span className="text-gray-600 dark:text-gray-300">
          {day.temperature.min}{day.temperature.unit}
        </span>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">
        {day.weather.description}
      </div>
    </div>
  );
};

export default ForecastDay;