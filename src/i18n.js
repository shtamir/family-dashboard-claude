// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    family: 'Family',
    loading: 'Loading...',
    retry: 'Retry',
    refreshing: 'Refreshing...',
    showMore: 'Show more',
    showLess: 'Show less',
    error: 'Error',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    success: 'Success',
    logout: 'Logout',
    login: 'Login'
  },
  dashboard: {
    welcome: 'Welcome, {{name}}',
    lastUpdated: 'Last updated: {{time}}'
  },
  calendar: {
    title: 'Family Calendar',
    today: 'Today',
    upcoming: 'Upcoming',
    noEventsToday: 'No events today',
    noUpcomingEvents: 'No upcoming events',
    allDay: 'All day',
    errorFetching: 'Error loading calendar events'
  },
  weather: {
    title: 'Weather',
    forecast: '3-Day Forecast',
    humidity: 'Humidity',
    wind: 'Wind',
    high: 'High',
    low: 'Low',
    feelsLike: 'Feels like',
    lastUpdated: 'Last updated',
    errorFetching: 'Error loading weather data',
    noLocation: 'No location set. Please configure a location in settings.',
    setLocationInSettings: 'Set a location in settings'
  },
  messages: {
    title: 'Family Messages',
    noMessages: 'No messages to display',
    showMore: 'Show all messages',
    showLess: 'Show fewer messages',
    highPriority: 'High Priority',
    new: 'New',
    errorFetching: 'Error loading messages'
  },
  todos: {
    title: 'To-Do List',
    all: 'All',
    pending: 'Pending',
    completed: 'Completed',
    allCategories: 'All Categories',
    noTasks: 'No tasks to display',
    dueToday: 'Due today',
    dueTomorrow: 'Due tomorrow',
    overdue: 'Overdue',
    assignedTo: 'Assigned to',
    summary: '{{completed}} of {{total}} tasks completed',
    errorFetching: 'Error loading to-do list'
  },
  photos: {
    title: 'Family Photos',
    noPhotos: 'No photos to display',
    slideshow: 'Slideshow',
    errorFetching: 'Error loading photos',
    noAlbumSelected: 'No photo album selected',
    selectAlbum: 'Select Album',
    changeAlbum: 'Change Album',
    noAlbumsFound: 'No albums found',
    items: 'items',
    fullscreen: 'Fullscreen',
    next: 'Next',
    previous: 'Previous'
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    english: 'English',
    hebrew: 'Hebrew',
    units: 'Temperature Units',
    metric: 'Celsius (°C)',
    imperial: 'Fahrenheit (°F)',
    refreshInterval: 'Data Refresh Interval',
    minutes: 'minutes',
    location: 'Weather Location',
    widgets: 'Visible Widgets',
    showCalendar: 'Show Calendar',
    showWeather: 'Show Weather',
    showMessages: 'Show Messages',
    showTodos: 'Show To-Do List',
    showPhotos: 'Show Photos',
    password: 'Password',
    enterPassword: 'Enter password to access settings',
    incorrectPassword: 'Incorrect password',
    settingsSaved: 'Settings saved successfully',
    account: 'Google Account',
    connected: 'Connected as',
    notConnected: 'Not connected',
    connect: 'Connect Account',
    disconnect: 'Disconnect',
    // New display mode translations
    displayMode: 'Display Mode',
    autoDetect: 'Auto Detect',
    tvMode: 'TV Mode',
    normalMode: 'Normal Mode'
  },
  auth: {
    signInRequired: 'Sign in required',
    signInWithGoogle: 'Sign in with Google',
    signInToAccess: 'Sign in with your family Google account to access the portal',
    signInError: 'Error signing in',
    signedOut: 'Signed out successfully'
  }
};

// Hebrew translations
const heTranslations = {
  common: {
    family: 'משפחה',
    loading: 'טוען...',
    retry: 'נסה שוב',
    refreshing: 'מרענן...',
    showMore: 'הצג עוד',
    showLess: 'הצג פחות',
    error: 'שגיאה',
    settings: 'הגדרות',
    save: 'שמור',
    cancel: 'ביטול',
    confirm: 'אישור',
    success: 'הצלחה',
    logout: 'התנתק',
    login: 'התחבר'
  },
  dashboard: {
    welcome: 'ברוכים הבאים, {{name}}',
    lastUpdated: 'עודכן לאחרונה: {{time}}'
  },
  calendar: {
    title: 'יומן משפחתי',
    today: 'היום',
    upcoming: 'אירועים קרובים',
    noEventsToday: 'אין אירועים היום',
    noUpcomingEvents: 'אין אירועים קרובים',
    allDay: 'כל היום',
    errorFetching: 'שגיאה בטעינת אירועי היומן'
  },
  weather: {
    title: 'מזג אוויר',
    forecast: 'תחזית 3 ימים',
    humidity: 'לחות',
    wind: 'רוח',
    high: 'גבוה',
    low: 'נמוך',
    feelsLike: 'מרגיש כמו',
    lastUpdated: 'עודכן לאחרונה',
    errorFetching: 'שגיאה בטעינת נתוני מזג האוויר',
    noLocation: 'לא הוגדר מיקום. נא להגדיר מיקום בהגדרות.',
    setLocationInSettings: 'הגדר מיקום בהגדרות'
  },
  messages: {
    title: 'הודעות משפחתיות',
    noMessages: 'אין הודעות להצגה',
    showMore: 'הצג את כל ההודעות',
    showLess: 'הצג פחות הודעות',
    highPriority: 'עדיפות גבוהה',
    new: 'חדש',
    errorFetching: 'שגיאה בטעינת הודעות'
  },
  todos: {
    title: 'רשימת משימות',
    all: 'הכל',
    pending: 'ממתין',
    completed: 'הושלם',
    allCategories: 'כל הקטגוריות',
    noTasks: 'אין משימות להצגה',
    dueToday: 'לביצוע היום',
    dueTomorrow: 'לביצוע מחר',
    overdue: 'באיחור',
    assignedTo: 'הוקצה ל',
    summary: '{{completed}} מתוך {{total}} משימות הושלמו',
    errorFetching: 'שגיאה בטעינת רשימת המשימות'
  },
  photos: {
    title: 'תמונות משפחתיות',
    noPhotos: 'אין תמונות להצגה',
    slideshow: 'מצגת',
    errorFetching: 'שגיאה בטעינת תמונות',
    noAlbumSelected: 'לא נבחר אלבום תמונות',
    selectAlbum: 'בחר אלבום',
    changeAlbum: 'החלף אלבום',
    noAlbumsFound: 'לא נמצאו אלבומים',
    items: 'פריטים',
    fullscreen: 'מסך מלא',
    next: 'הבא',
    previous: 'הקודם'
  },
  settings: {
    title: 'הגדרות',
    language: 'שפה',
    english: 'אנגלית',
    hebrew: 'עברית',
    units: 'יחידות טמפרטורה',
    metric: 'צלזיוס (°C)',
    imperial: 'פרנהייט (°F)',
    refreshInterval: 'מרווח רענון נתונים',
    minutes: 'דקות',
    location: 'מיקום מזג אוויר',
    widgets: 'רכיבים מוצגים',
    showCalendar: 'הצג יומן',
    showWeather: 'הצג מזג אוויר',
    showMessages: 'הצג הודעות',
    showTodos: 'הצג רשימת משימות',
    showPhotos: 'הצג תמונות',
    password: 'סיסמה',
    enterPassword: 'הזן סיסמה לגישה להגדרות',
    incorrectPassword: 'סיסמה שגויה',
    settingsSaved: 'ההגדרות נשמרו בהצלחה',
    account: 'חשבון Google',
    connected: 'מחובר כ',
    notConnected: 'לא מחובר',
    connect: 'חבר חשבון',
    disconnect: 'התנתק',
    // New display mode translations
    displayMode: 'מצב תצוגה',
    autoDetect: 'זיהוי אוטומטי',
    tvMode: 'מצב טלוויזיה',
    normalMode: 'מצב רגיל'
  },
  auth: {
    signInRequired: 'נדרשת התחברות',
    signInWithGoogle: 'התחבר עם Google',
    signInToAccess: 'התחבר עם חשבון Google המשפחתי כדי לגשת לפורטל',
    signInError: 'שגיאה בהתחברות',
    signedOut: 'התנתקת בהצלחה'
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      he: {
        translation: heTranslations
      }
    },
    lng: localStorage.getItem('family_portal_language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;