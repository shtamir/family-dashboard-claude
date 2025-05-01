// src/services/calendar.js
import { useAuth } from './auth';

// Calendar service for interacting with Google Calendar API
export const useCalendarService = () => {
  const { fetchWithAuth } = useAuth();
  const BASE_URL = 'https://www.googleapis.com/calendar/v3';

  // Fetch upcoming calendar events
  const getUpcomingEvents = async (days = 14) => {
    try {
      // Calculate time range
      const now = new Date();
      const timeMin = now.toISOString();
      
      const maxDate = new Date();
      maxDate.setDate(now.getDate() + days);
      const timeMax = maxDate.toISOString();
      
      // Request parameters
      const params = new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 50
      });
      
      // Make API request
      const result = await fetchWithAuth(`${BASE_URL}/calendars/primary/events?${params}`);
      
      // Transform the events for UI consumption
      return transformEvents(result.items || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  };

  // Transform calendar events for display
  const transformEvents = (events) => {
    return events.map(event => {
      // Extract start and end times
      const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date);
      const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date);
      const isAllDay = !event.start.dateTime;
      
      // Format dates for display
      const formattedStart = isAllDay 
        ? start.toLocaleDateString() 
        : start.toLocaleString();
      
      const formattedEnd = isAllDay 
        ? end.toLocaleDateString() 
        : end.toLocaleString();
      
      // Determine if the event is happening today
      const today = new Date();
      const isToday = start.getDate() === today.getDate() && 
                      start.getMonth() === today.getMonth() && 
                      start.getFullYear() === today.getFullYear();
      
      return {
        id: event.id,
        title: event.summary || 'Untitled Event',
        description: event.description || '',
        location: event.location || '',
        start: {
          dateTime: start,
          formatted: formattedStart
        },
        end: {
          dateTime: end,
          formatted: formattedEnd
        },
        isAllDay,
        isToday,
        organizer: event.organizer?.email || '',
        colorId: event.colorId || '0',
        link: event.htmlLink || '',
        // Additional fields as needed
      };
    });
  };

  // Get events happening today
  const getTodayEvents = async () => {
    const events = await getUpcomingEvents(1);
    return events.filter(event => event.isToday);
  };

  // Group events by date for display
  const getEventsByDate = async (days = 14) => {
    const events = await getUpcomingEvents(days);
    
    const groupedEvents = {};
    events.forEach(event => {
      const date = event.start.dateTime.toDateString();
      if (!groupedEvents[date]) {
        groupedEvents[date] = [];
      }
      groupedEvents[date].push(event);
    });
    
    return groupedEvents;
  };

  return {
    getUpcomingEvents,
    getTodayEvents,
    getEventsByDate
  };
};

export default useCalendarService;