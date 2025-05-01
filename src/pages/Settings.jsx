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
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={verifyPassword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('settings.title')}
        </h2>
        
        {saveMessage && (
          <div className="mb-6 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg">
            {saveMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b pb-2">
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
                  className="h-4 w-4 text-blue-600"
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
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.hebrew')}
                </span>
              </label>
            </div>
          </div>
          
          {/* Units Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b pb-2">
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
                  className="h-4 w-4 text-blue-600"
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
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.imperial')}
                </span>
              </label>
            </div>
          </div>
          
          {/* Weather Location */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b pb-2">
              {t('settings.location')}
            </h3>
            <div>
              <input
                type="text"
                name="location"
                value={settings.location}
                onChange={handleChange}
                placeholder="e.g. London, UK"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t('weather.setLocationInSettings')}
              </p>
            </div>
          </div>
          
          {/* Refresh Interval */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b pb-2">
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
                className="w-full max-w-md"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">
                {settings.refreshInterval} {t('settings.minutes')}
              </span>
            </div>
          </div>
          
          {/* Visible Widgets */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b pb-2">
              {t('settings.widgets')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showCalendar"
                  checked={settings.showCalendar}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600"
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
                  className="h-4 w-4 text-blue-600"
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
                  className="h-4 w-4 text-blue-600"
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
                  className="h-4 w-4 text-blue-600"
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
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('settings.showPhotos')}
                </span>
              </label>
            </div>
          </div>
          
          {/* Account Info */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white border-b pb-2">
              {t('settings.account')}
            </h3>
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('settings.connected')}: <span className="font-medium">{user.name || user.email}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('settings.connect')}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;