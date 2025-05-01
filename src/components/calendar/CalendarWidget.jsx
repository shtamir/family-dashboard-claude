// src/components/calendar/CalendarWidget.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCalendarService from '../../services/calendar';
import EventCard from './EventCard';

const CalendarWidget = () => {
  const { t } = useTranslation();
  const calendarService = useCalendarService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('today');

  // Fetch calendar data
  const fetchCalendarData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get today's events
      const today = await calendarService.getTodayEvents();
      setTodayEvents(today);
      
      // Get upcoming events (next 14 days)
      const upcoming = await calendarService.getUpcomingEvents(14);
      // Filter out today's events from upcoming to avoid duplication
      const futureEvents = upcoming.filter(event => !event.isToday);
      setUpcomingEvents(futureEvents);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError(t('calendar.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCalendarData();
    
    // Set up event listener for refresh
    const handleRefresh = () => fetchCalendarData();
    window.addEventListener('refreshWidgets', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshWidgets', handleRefresh);
    };
  }, []);

  // Loading state
  if (loading && !todayEvents.length && !upcomingEvents.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {t('calendar.title')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button 
            onClick={fetchCalendarData}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-lg"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('calendar.title')}
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'today'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('today')}
        >
          {t('calendar.today')}
          {todayEvents.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
              {todayEvents.length}
            </span>
          )}
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          {t('calendar.upcoming')}
          {upcomingEvents.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
              {upcomingEvents.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Events Display */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
        {activeTab === 'today' ? (
          <div className="space-y-4">
            {todayEvents.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <p>{t('calendar.noEventsToday')}</p>
              </div>
            ) : (
              todayEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <p>{t('calendar.noUpcomingEvents')}</p>
              </div>
            ) : (
              // Group upcoming events by date
              Object.entries(
                upcomingEvents.reduce((groups, event) => {
                  const date = event.start.dateTime.toDateString();
                  if (!groups[date]) {
                    groups[date] = [];
                  }
                  groups[date].push(event);
                  return groups;
                }, {})
              ).map(([date, events]) => (
                <div key={date}>
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {new Date(date).toLocaleDateString(undefined, { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="space-y-2">
                    {events.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Refresh indicator */}
      {loading && (todayEvents.length > 0 || upcomingEvents.length > 0) && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
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

export default CalendarWidget;