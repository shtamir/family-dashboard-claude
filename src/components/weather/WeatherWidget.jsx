// src/components/weather/WeatherWidget.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useWeatherService from '../../services/weather';
import WeatherIcon from './WeatherIcon';
import ForecastDay from './ForecastDay';

const WeatherWidget = () => {
  const { t } = useTranslation();
  const weatherService = useWeatherService();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weather data
  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if location is set in config
      if (!weatherService.config.location) {
        setError(t('weather.noLocation'));
        setLoading(false);
        return;
      }
      
      // Fetch current weather and forecast in parallel
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast(3) // 3-day forecast
      ]);
      
      setCurrentWeather(currentData);
      setForecast(forecastData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(t('weather.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWeatherData();
    
    // Set up event listener for refresh
    const handleRefresh = () => fetchWeatherData();
    window.addEventListener('refreshWidgets', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshWidgets', handleRefresh);
    };
  }, [weatherService.config.location, weatherService.config.units]);

  // Loading state
  if (loading && !currentWeather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {t('weather.title')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          {weatherService.config.location ? (
            <button 
              onClick={fetchWeatherData}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-lg"
            >
              {t('common.retry')}
            </button>
          ) : (
            <p className="mt-2 text-sm">
              {t('weather.setLocationInSettings')}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!currentWeather || !forecast) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        {t('weather.title')}
      </h2>
      
      {/* Current Weather */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">
              {currentWeather.location.name}, {currentWeather.location.country}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {new Date().toLocaleDateString(undefined, { 
                weekday: 'long',
                month: 'long',
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentWeather.temperature.current}{currentWeather.temperature.unit}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('weather.feelsLike')}: {currentWeather.temperature.feelsLike}{currentWeather.temperature.unit}
            </div>
          </div>
        </div>
        
        <div className="flex items-center mt-4">
          <div className="flex-shrink-0">
            <WeatherIcon 
              iconCode={currentWeather.weather.icon}
              description={currentWeather.weather.description}
              size="lg"
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-700 dark:text-gray-300 capitalize">
              {currentWeather.weather.description}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {t('weather.humidity')}: {currentWeather.humidity}%
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {t('weather.wind')}: {currentWeather.wind.speed} {currentWeather.wind.unit}
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span>
                  {t('weather.high')}: {currentWeather.temperature.max}{currentWeather.temperature.unit}
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
                <span>
                  {t('weather.low')}: {currentWeather.temperature.min}{currentWeather.temperature.unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3-Day Forecast */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
          {t('weather.forecast')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {forecast.forecasts.map((day, index) => (
            <ForecastDay key={index} day={day} />
          ))}
        </div>
      </div>
      
      {/* Last updated */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-right">
        {t('weather.lastUpdated')}: {currentWeather.timestamp.toLocaleTimeString()}
      </div>
      
      {/* Refresh indicator */}
      {loading && currentWeather && (
        <div className="mt-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('common.refreshing')}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;