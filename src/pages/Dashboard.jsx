// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalendarWidget from '../components/calendar/CalendarWidget';
import WeatherWidget from '../components/weather/WeatherWidget';
import MessagesWidget from '../components/messages/MessagesWidget';
import TodoWidget from '../components/todos/TodoWidget';
import PhotosWidget from '../components/photos/PhotosWidget';
import { useAuth } from '../services/auth';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isTvMode, setIsTvMode] = useState(false);
  const [config, setConfig] = useState({
    showCalendar: true,
    showWeather: true,
    showMessages: true,
    showTodos: true,
    showPhotos: true,
    refreshInterval: 5 // minutes
  });

  // Detect TV mode based on screen size
  useEffect(() => {
    const detectTvMode = () => {
      // Consider TV mode if width is larger than 1920px or height is larger than 1080px
      const isTV = window.innerWidth >= 1920 || window.innerHeight >= 1080;
      setIsTvMode(isTV);
    };
    
    // Initial detection
    detectTvMode();
    
    // Listen for resize events
    window.addEventListener('resize', detectTvMode);
    
    return () => {
      window.removeEventListener('resize', detectTvMode);
    };
  }, []);

  // Load configuration from local storage
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem('family_portal_config');
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Set up refresh interval
  useEffect(() => {
    // Function to refresh all widgets
    const refreshData = () => {
      // This will trigger re-fetching in child components
      const refreshEvent = new CustomEvent('refreshWidgets');
      window.dispatchEvent(refreshEvent);
    };

    // Set interval for refresh
    const intervalId = setInterval(
      refreshData,
      config.refreshInterval * 60 * 1000 // Convert minutes to milliseconds
    );

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [config.refreshInterval]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`dashboard w-full ${isTvMode ? 'p-2 h-[calc(100vh-48px)] overflow-hidden' : 'p-4 lg:p-6'}`}>
      {/* Smaller header on TV mode */}
      <header className={`${isTvMode ? 'mb-2' : 'mb-6'}`}>
        <h1 className={`${isTvMode ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold text-gray-800 dark:text-white`}>
          {t('dashboard.welcome', { name: user?.name || t('common.family') })}
        </h1>
        {!isTvMode && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
        {isTvMode && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        )}
      </header>

      {/* Grid with fixed height containers for TV mode */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isTvMode ? 'gap-2 h-[calc(100%-48px)]' : 'gap-6'}`}>
        {/* Calendar Widget */}
        {config.showCalendar && (
          <div className={`lg:col-span-2 shadow-lg rounded-lg ${isTvMode ? 'max-h-[calc(50vh-48px)]' : ''}`}>
            <CalendarWidget />
          </div>
        )}

        {/* Weather Widget */}
        {config.showWeather && (
          <div className={`shadow-lg rounded-lg ${isTvMode ? 'max-h-[calc(50vh-48px)]' : ''}`}>
            <WeatherWidget />
          </div>
        )}

        {/* Messages Widget */}
        {config.showMessages && (
          <div className={`md:col-span-2 lg:col-span-1 shadow-lg rounded-lg ${isTvMode ? 'max-h-[calc(50vh-48px)]' : ''}`}>
            <MessagesWidget />
          </div>
        )}

        {/* To-Do Widget */}
        {config.showTodos && (
          <div className={`shadow-lg rounded-lg ${isTvMode ? 'max-h-[calc(50vh-48px)]' : ''}`}>
            <TodoWidget />
          </div>
        )}

        {/* Photos Widget */}
        {config.showPhotos && (
          <div className={`lg:col-span-2 shadow-lg rounded-lg ${isTvMode ? 'max-h-[calc(50vh-48px)]' : ''}`}>
            <PhotosWidget />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;