// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import useWeatherService from '../services/weather';

// Default settings
const DEFAULT_SETTINGS = {
  language: 'en',
  units: 'metric',
  refreshInterval: 5,
  location: '',
  showCalendar: true,
  showWeather: true,
  showMessages: true,
  showTodos: true,
  showPhotos: true,
  displayMode: 'auto', // 'auto', '4k', 'tv', or 'normal'
  layoutDensity: 'normal', // 'compact', 'normal', 'expanded', 'maximum'
  password: '', // Default password will be set on first load
};

// Mock password (in a real app, use a proper auth system)
const DEFAULT_PASSWORD = 'family123';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const weatherService = useWeatherService();
  
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saveMessage, setSaveMessage] = useState('');
  const [isTvMode, setIsTvMode] = useState(false);
  const [screenInfo, setScreenInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    userAgent: navigator.userAgent,
    pixelRatio: window.devicePixelRatio || 1,
    is4K: window.innerWidth >= 3800 || window.innerHeight >= 2000,
    isHD: window.innerWidth >= 1920 || window.innerHeight >= 1080
  });

  // Detect screen capabilities based on screen size
  const detectScreenCapabilities = () => {
    const isTV = window.innerWidth >= 1920 || window.innerHeight >= 1080;
    const is4K = window.innerWidth >= 3800 || window.innerHeight >= 2000;
    
    setIsTvMode(isTV);
    setScreenInfo({
      width: window.innerWidth,
      height: window.innerHeight,
      userAgent: navigator.userAgent,
      pixelRatio: window.devicePixelRatio || 1,
      is4K: is4K,
      isHD: isTV
    });
  };
  
  // Detect screen capabilities on mount and resize
  useEffect(() => {
    detectScreenCapabilities();
    
    // Listen for resize events
    window.addEventListener('resize', detectScreenCapabilities);
    
    return () => {
      window.removeEventListener('resize', detectScreenCapabilities);
    };
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Check if password is set
        const storedPassword = localStorage.getItem('family_portal_password');
        if (!storedPassword) {
          // If no password set, set default and bypass password protection
          localStorage.setItem('family_portal_password', DEFAULT_PASSWORD);
          setIsPasswordProtected(false);
        }
        
        // Load settings if they exist
        const storedSettings = localStorage.getItem('family_portal_config');
        if (storedSettings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...JSON.parse(storedSettings)
          });
        }
        
        // Load weather settings
        const weatherConfig = localStorage.getItem('family_portal_weather_config');
        if (weatherConfig) {
          const { location, units } = JSON.parse(weatherConfig);
          setSettings(prev => ({
            ...prev,
            location: location || prev.location,
            units: units || prev.units
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Handle password verification
  const verifyPassword = () => {
    const storedPassword = localStorage.getItem('family_portal_password') || DEFAULT_PASSWORD;
    
    if (passwordInput === storedPassword) {
      setIsPasswordProtected(false);
      setPasswordError('');
    } else {
      setPasswordError(t('settings.incorrectPassword'));
    }
  };

  // Handle settings changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Apply display mode settings
  const applyDisplayMode = (mode) => {
    // Remove all display mode classes first
    document.documentElement.classList.remove('tv-mode', '4k-mode');
    
    // Apply the appropriate class based on mode and screen detection
    if (mode === '4k' || (mode === 'auto' && screenInfo.is4K)) {
      document.documentElement.classList.add('4k-mode');
    } else if (mode === 'tv' || (mode === 'auto' && screenInfo.isHD && !screenInfo.is4K)) {
      document.documentElement.classList.add('tv-mode');
    }
    
    // Store resolution stats for debugging
    localStorage.setItem('family_portal_screen_info', JSON.stringify({
      width: screenInfo.width,
      height: screenInfo.height,
      pixelRatio: screenInfo.pixelRatio,
      userAgent: screenInfo.userAgent,
      detectedAt: new Date().toISOString()
    }));
  };

  // Save settings
  const saveSettings = () => {
    try {
      // Save main settings
      localStorage.setItem('family_portal_config', JSON.stringify(settings));
      
      // Update language if changed
      if (settings.language !== i18n.language) {
        i18n.changeLanguage(settings.language);
        localStorage.setItem('family_portal_language', settings.language);
        document.documentElement.dir = settings.language === 'he' ? 'rtl' : 'ltr';
      }
      
      // Apply display mode
      applyDisplayMode(settings.displayMode);
      
      // Update weather settings
      weatherService.updateConfig({
        location: settings.location,
        units: settings.units
      });
      
      // Show success message
      setSaveMessage(t('settings.settingsSaved'));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
      
      // Trigger a refresh of widgets
      const refreshEvent = new CustomEvent('refreshWidgets');
      window.dispatchEvent(refreshEvent);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage(t('common.error'));
    }
  };

  // If password protected, show password screen
  if (isPasswordProtected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className={`bg-white dark:bg-gray-800 ${isTvMode ? 'p-6' : 'p-8'} rounded-lg shadow-md max-w-md w-full`}>
          <h2 className={`${isTvMode ? 'text-xl' : 'text-2xl'} font-bold mb-6 text-gray-800 dark:text-white`}>
            {t('settings.title')}
          </h2>
          
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            {t('settings.enterPassword')}
          </p>
          
          <div className="mb-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
              className={`w-full px-4 ${isTvMode ? 'py-1.5 text-lg' : 'py-2'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${isTvMode ? 'tv-focus' : ''}`}
              placeholder="********"
            />
            {passwordError && (
              <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                {passwordError}
              </p>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/')}
              className={`px-4 ${isTvMode ? 'py-1.5' : 'py-2'} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 ${isTvMode ? 'tv-focus' : ''}`}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={verifyPassword}
              className={`px-4 ${isTvMode ? 'py-1.5' : 'py-2'} bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isTvMode ? 'tv-focus' : ''}`}
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main settings screen
  return (
    <div className={`container mx-auto ${isTvMode ? 'px-2 py-2 overflow-hidden h-[calc(100vh-48px)]' : 'px-4 py-6'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${isTvMode ? 'p-3 max-h-full overflow-auto' : 'p-6'}`}>
        <h2 className={`${isTvMode ? 'text-xl' : 'text-2xl'} font-bold mb-4 text-gray-800 dark:text-white flex items-center`}>
          <svg className={`${isTvMode ? 'w-5 h-5' : 'w-6 h-6'} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('settings.title')}
        </h2>
        
        {saveMessage && (
          <div className={`${isTvMode ? 'mb-3 p-2 text-sm' : 'mb-6 p-3'} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg`}>
            {saveMessage}
          </div>
        )}
        
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isTvMode ? 'gap-3 text-sm' : 'gap-6'}`}>
          {/* Language Settings */}
          <div className="space-y-2">
            <h3 className={`${isTvMode ? 'text-base' : 'text-lg'} font-medium text-gray-800 dark:text-white border-b pb-2`}>
              {t('settings.language')}
            </h3>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={settings.language === 'en'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.english')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="language"
                  value="he"
                  checked={settings.language === 'he'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.hebrew')}
                </span>
              </label>
            </div>
          </div>
          
          {/* Units Settings */}
          <div className="space-y-2">
            <h3 className={`${isTvMode ? 'text-base' : 'text-lg'} font-medium text-gray-800 dark:text-white border-b pb-2`}>
              {t('settings.units')}
            </h3>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  checked={settings.units === 'metric'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.metric')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  checked={settings.units === 'imperial'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.imperial')}
                </span>
              </label>
            </div>
          </div>
          
          {/* Display Mode & Resolution Settings */}
          <div className="space-y-2 md:col-span-2">
            <h3 className={`${isTvMode ? 'text-base' : 'text-lg'} font-medium text-gray-800 dark:text-white border-b pb-2`}>
              {t('settings.displayMode')}
            </h3>
            
            {/* Current Resolution Info */}
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="font-medium">{t('settings.currentResolution')}: {screenInfo.width} × {screenInfo.height}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('settings.pixelRatio')}: {screenInfo.pixelRatio}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {screenInfo.is4K ? '✓ 4K Compatible' : ''}
                {!screenInfo.is4K && screenInfo.isHD ? ' ✓ HD Compatible' : ''}
                {!screenInfo.isHD ? ' ✓ Standard Resolution' : ''}
              </p>
            </div>
            
            {/* Display Mode Selection */}
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="displayMode"
                  value="auto"
                  checked={settings.displayMode === 'auto'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.autoDetect')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="displayMode"
                  value="4k"
                  checked={settings.displayMode === '4k'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.mode4k')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="displayMode"
                  value="tv"
                  checked={settings.displayMode === 'tv'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.tvMode')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="displayMode"
                  value="normal"
                  checked={settings.displayMode === 'normal'}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.normalMode')}
                </span>
              </label>
            </div>
            
            {/* Layout Density Option */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                {t('settings.layoutDensity')}
              </h4>
              <select
                name="layoutDensity"
                value={settings.layoutDensity || 'normal'}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${isTvMode ? 'tv-focus' : ''}`}
              >
                <option value="compact">{t('settings.compact')}</option>
                <option value="normal">{t('settings.normal')}</option>
                <option value="expanded">{t('settings.expanded')}</option>
                <option value="maximum">{t('settings.maximum')}</option>
              </select>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t('settings.layoutDensityHelp')}
              </p>
            </div>
          </div>
          
          {/* Weather Location */}
          <div className={`space-y-2 ${isTvMode ? 'md:col-span-1' : 'md:col-span-2'}`}>
            <h3 className={`${isTvMode ? 'text-base' : 'text-lg'} font-medium text-gray-800 dark:text-white border-b pb-2`}>
              {t('settings.location')}
            </h3>
            <div>
              <input
                type="text"
                name="location"
                value={settings.location}
                onChange={handleChange}
                placeholder="e.g. London, UK"
                className={`w-full ${isTvMode ? 'px-3 py-1.5' : 'px-4 py-2'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${isTvMode ? 'tv-focus' : ''}`}
              />
              {!isTvMode && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('weather.setLocationInSettings')}
                </p>
              )}
            </div>
          </div>
          
          {/* Refresh Interval */}
          <div className={`space-y-2 ${isTvMode ? 'md:col-span-1' : 'md:col-span-2'}`}>
            <h3 className={`${isTvMode ? 'text-base' : 'text-lg'} font-medium text-gray-800 dark:text-white border-b pb-2`}>
              {t('settings.refreshInterval')}
            </h3>
            <div className="flex items-center">
              <input
                type="range"
                name="refreshInterval"
                min="1"
                max="30"
                value={settings.refreshInterval}
                onChange={handleChange}
                className={`w-full max-w-md ${isTvMode ? 'tv-focus' : ''}`}
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">
                {settings.refreshInterval} {t('settings.minutes')}
              </span>
            </div>
          </div>
          
          {/* Visible Widgets */}
          <div className={`space-y-2 md:col-span-2`}>
            <h3 className={`${isTvMode ? 'text-base' : 'text-lg'} font-medium text-gray-800 dark:text-white border-b pb-2`}>
              {t('settings.widgets')}
            </h3>
            <div className={`grid grid-cols-1 ${isTvMode ? 'md:grid-cols-3 gap-2' : 'md:grid-cols-2 gap-3'}`}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showCalendar"
                  checked={settings.showCalendar}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.showCalendar')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showWeather"
                  checked={settings.showWeather}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.showWeather')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showMessages"
                  checked={settings.showMessages}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.showMessages')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showTodos"
                  checked={settings.showTodos}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.showTodos')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showPhotos"
                  checked={settings.showPhotos}
                  onChange={handleChange}
                  className={`h-4 w-4 text-blue-600 ${isTvMode ? 'tv-focus' : ''}`}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.showPhotos')}
                </span>
              </label>
            </div>
          </div>
          
          {/* Account Info */}
          <div className={`space-y-2 md:col-span-2`}>
            <h3 className={`${isTvMode ? 'text-base' : 'text-lg'} font-medium text-gray-800 dark:text-white border-b pb-2`}>
              {t('settings.account')}
            </h3>
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('settings.connected')}: <span className="font-medium">{user.name || user.email}</span>
                  </p>
                  {!isTvMode && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className={`${isTvMode ? 'px-3 py-1.5' : 'px-4 py-2'} bg-red-600 text-white rounded-lg hover:bg-red-700 ${isTvMode ? 'tv-focus' : ''}`}
                >
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-gray-700 dark:text-gray-300">
                  {t('settings.notConnected')}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className={`${isTvMode ? 'px-3 py-1.5' : 'px-4 py-2'} bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isTvMode ? 'tv-focus' : ''}`}
                >
                  {t('settings.connect')}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={`${isTvMode ? 'mt-4' : 'mt-8'} flex justify-between`}>
          <button
            onClick={() => navigate('/')}
            className={`${isTvMode ? 'px-4 py-1.5' : 'px-6 py-2'} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 ${isTvMode ? 'tv-focus' : ''}`}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={saveSettings}
            className={`${isTvMode ? 'px-4 py-1.5' : 'px-6 py-2'} bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isTvMode ? 'tv-focus' : ''}`}
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;