// src/components/calendar/EventCard.jsx
import { useTranslation } from 'react-i18next';

// Color mapping for event categories
const EVENT_COLORS = {
  '1': 'bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
  '2': 'bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
  '3': 'bg-purple-100 border-purple-400 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300',
  '4': 'bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300',
  '5': 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300',
  '6': 'bg-orange-100 border-orange-400 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300',
  '7': 'bg-teal-100 border-teal-400 text-teal-800 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-300',
  '8': 'bg-pink-100 border-pink-400 text-pink-800 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-300',
  '9': 'bg-indigo-100 border-indigo-400 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300',
  '10': 'bg-gray-100 border-gray-400 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300',
  '0': 'bg-gray-100 border-gray-400 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
};

const EventCard = ({ event }) => {
  const { t } = useTranslation();
  
  // Get color class based on event.colorId
  const colorClass = EVENT_COLORS[event.colorId] || EVENT_COLORS['0'];
  
  // Format time display
  const formatTimeDisplay = () => {
    if (event.isAllDay) {
      return t('calendar.allDay');
    }
    
    // For normal events with time
    const options = { hour: 'numeric', minute: '2-digit' };
    const startTime = event.start.dateTime.toLocaleTimeString(undefined, options);
    const endTime = event.end.dateTime.toLocaleTimeString(undefined, options);
    
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className={`p-3 rounded-lg border-l-4 ${colorClass} shadow-sm transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          
          <div className="flex items-center text-sm mt-1">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTimeDisplay()}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-sm mt-1">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.location}</span>
            </div>
          )}
          
          {event.description && (
            <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
          )}
        </div>
        
        {/* Only show if on a larger screen */}
        <div className="hidden md:block">
          {event.isToday && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t('calendar.today')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;