// src/components/layout/Layout.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../services/auth';

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isRtl, setIsRtl] = useState(i18n.language === 'he');
  const [isTvMode, setIsTvMode] = useState(false);
  
  // Toggle settings dropdown
  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };
  
  // Detect TV mode based on screen size
  useEffect(() => {
    const detectTvMode = () => {
      // Consider TV mode if width is larger than 1920px or height is larger than 1080px
      const isTV = window.innerWidth >= 1920 || window.innerHeight >= 1080;
      setIsTvMode(isTV);
      // Add a class to handle TV-specific styles in CSS
      if (isTV) {
        document.documentElement.classList.add('tv-mode');
      } else {
        document.documentElement.classList.remove('tv-mode');
      }
    };
    
    // Initial detection
    detectTvMode();
    
    // Listen for resize events
    window.addEventListener('resize', detectTvMode);
    
    return () => {
      window.removeEventListener('resize', detectTvMode);
    };
  }, []);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setIsSettingsVisible(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Handle RTL layout based on language
  useEffect(() => {
    setIsRtl(i18n.language === 'he');
  }, [i18n.language]);
  
  // Prevent event propagation for menu clicks
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${isRtl ? 'rtl' : 'ltr'} ${isTvMode ? 'tv-container' : ''}`}>
      {/* Top Navigation Bar - Smaller on TV */}
      <nav className={`bg-white dark:bg-gray-800 shadow-md ${isTvMode ? 'h-12' : 'h-16'}`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <svg className={`${isTvMode ? 'h-6 w-6' : 'h-8 w-8'} text-blue-600 dark:text-blue-400`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 22v-20h18v20h-18zm5-18h-3v16h3v-16zm13 0h-10v16h10v-16z" />
                </svg>
                <span className={`ml-2 ${isTvMode ? 'text-lg' : 'text-xl'} font-bold text-gray-800 dark:text-white`}>
                  {t('common.family')}
                </span>
              </Link>
            </div>
            
            <div className="flex items-center">
              {/* Language toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newLang = i18n.language === 'en' ? 'he' : 'en';
                  i18n.changeLanguage(newLang);
                  localStorage.setItem('family_portal_language', newLang);
                  document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
                }}
                className={`p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${isTvMode ? 'tv-focus' : ''}`}
              >
                <span className="sr-only">Toggle Language</span>
                <div className={`${isTvMode ? 'w-5 h-5' : 'w-6 h-6'} flex items-center justify-center`}>
                  {i18n.language === 'en' ? 'עב' : 'EN'}
                </div>
              </button>
              
              {/* Settings dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSettings();
                    }}
                    className={`p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${isTvMode ? 'tv-focus' : ''}`}
                  >
                    <span className="sr-only">User menu</span>
                    <svg className={`${isTvMode ? 'h-5 w-5' : 'h-6 w-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                
                {isSettingsVisible && (
                  <div 
                    className={`origin-top-right absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 ${isTvMode ? 'text-sm' : ''}`}
                    onClick={handleMenuClick}
                  >
                    <div className="py-1">
                      <Link
                        to="/settings"
                        className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isTvMode ? 'tv-focus' : ''}`}
                        onClick={() => setIsSettingsVisible(false)}
                      >
                        {t('common.settings')}
                      </Link>
                      {user && (
                        <button
                          onClick={() => {
                            signOut();
                            setIsSettingsVisible(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isTvMode ? 'tv-focus' : ''}`}
                        >
                          {t('common.logout')}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile menu button - hidden on TV */}
              {!isTvMode && (
                <div className="flex items-center md:hidden ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <span className="sr-only">Open menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu - hidden on TV */}
        {!isTvMode && isMenuOpen && (
          <div className="md:hidden" onClick={handleMenuClick}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('dashboard.title')}
              </Link>
              <Link
                to="/settings"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/settings'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('settings.title')}
              </Link>
              {user && (
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t('common.logout')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Main Content - With TV-specific styles */}
      <main className={`flex-1 ${isTvMode ? 'overflow-hidden h-[calc(100vh-60px)]' : 'pb-8'}`}>
        {children}
      </main>
      
      {/* Footer - Smaller on TV */}
      <footer className={`bg-white dark:bg-gray-800 shadow-inner ${isTvMode ? 'py-1 text-xs fixed bottom-0 w-full' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Family TV Dashboard &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;