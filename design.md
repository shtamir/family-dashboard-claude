# Family Portal Web App Project Design

## Architecture Overview

```
+------------------+     +---------------+     +------------------+
|                  |     |               |     |                  |
|  User Interface  | <-> |  Application  | <-> |  Data Services   |
|  (React)         |     |  Logic        |     |  (Google APIs)   |
|                  |     |               |     |                  |
+------------------+     +---------------+     +------------------+
```

The application follows a layered architecture with clear separation between UI components, application logic, and data services.

## Technology Stack

### Frontend
- **Framework**: React.js with functional components and hooks
- **State Management**: React Context API + useReducer for global state
- **Styling**: Tailwind CSS for responsive design
- **Internationalization**: react-i18next for multi-language support
- **Authentication**: Google Identity Services (GIS)
- **Package Manager**: npm
- **Build Tool**: Vite

### APIs and Integration
- **Google Calendar API**: For retrieving family calendar events
- **Google Sheets API**: For family messages and to-do list
- **Google Photos API**: For family photo album (optional)
- **Weather API**: OpenWeatherMap API for 3-day forecast
- **Authentication**: OAuth 2.0 with Google Identity Services

### Deployment
- **CI/CD**: GitHub Actions
- **Hosting**: Netlify

## Component Structure

```
src/
├── assets/              # Static assets, icons, images
├── components/          # Reusable UI components
│   ├── common/          # Shared components (Button, Card, etc.)
│   ├── layout/          # Layout components
│   ├── calendar/        # Calendar-related components
│   ├── messages/        # Messages-related components
│   ├── weather/         # Weather-related components
│   ├── todos/           # To-do list components
│   └── photos/          # Photo gallery components
├── contexts/            # React contexts for state management
├── hooks/               # Custom React hooks
├── locales/             # Internationalization resources
│   ├── en/              # English translations
│   └── he/              # Hebrew translations
├── services/            # API and integration services
│   ├── auth.js          # Authentication service
│   ├── calendar.js      # Google Calendar service
│   ├── sheets.js        # Google Sheets service
│   ├── photos.js        # Google Photos service
│   └── weather.js       # Weather API service
├── utils/               # Utility functions
├── pages/               # Main application pages
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── config.js            # Configuration constants
```

## Data Flow

1. **Authentication Flow**:
   - User arrives at the application
   - App checks for existing auth tokens
   - If no valid token, redirect to Google OAuth flow
   - On successful authentication, store tokens securely
   - Proceed to main application

2. **Data Retrieval Flow**:
   - On initial load and at defined intervals:
     - Fetch calendar events for next 14 days
     - Fetch latest messages from designated Google Sheet
     - Fetch current to-do list items from Google Sheet
     - Fetch weather forecast for configured location
     - Fetch photos from configured Google Photos album

3. **Configuration Flow**:
   - Access configuration through password-protected menu
   - Modify settings (language, units, refresh intervals)
   - Save configuration to local storage
   - Apply changes immediately

## UI Design

### Layout

The application will use a responsive grid layout with the following considerations:

1. **TV Layout (Primary)**:
   - Large, readable text (min 24px)
   - Navigation optimized for remote control
   - Widget-based design with clear visual hierarchy
   - High contrast for visibility at a distance

2. **Mobile Layout**:
   - Stacked widgets for vertical scrolling
   - Touch-friendly controls
   - Compact information display

3. **Desktop Layout**:
   - Grid-based arrangement of widgets
   - Mouse and keyboard navigation
   - More detailed information display

### Widget Design

Each widget will follow a consistent design pattern:
- Clear heading with icon
- Consistent card-based design
- Appropriate spacing and padding
- Loading and error states

### Color Scheme

- Primary: #3366CC (Blue)
- Secondary: #FF9900 (Orange)
- Background: #F8F9FA (Light Gray)
- Text: #212529 (Dark Gray)
- Accent colors for different widgets
- Dark mode support with inverted color scheme

## Authentication and Security

### Google Authentication
- Implement OAuth 2.0 flow using Google Identity Services (GIS)
- Request minimum required scopes:
  - `https://www.googleapis.com/auth/calendar.readonly`
  - `https://www.googleapis.com/auth/spreadsheets.readonly`
  - `https://www.googleapis.com/auth/photoslibrary.readonly` (optional)
- Implement token refresh logic
- Store tokens securely in localStorage with encryption

### Configuration Security
- Password protection for configuration menu
- Configuration changes logged with timestamp
- Password stored with one-way hashing

## Key Components

### 1. Calendar Widget
- Interactive calendar view with daily and weekly views
- Event cards with time, title, location, and color coding
- "Today" and "Upcoming" sections

### 2. Messages Widget
- List of recent family messages
- Priority indicators for important messages
- Message cards with author, timestamp, and content

### 3. Weather Widget
- Current conditions display
- 3-day forecast with icons
- Temperature, precipitation, and condition information

### 4. To-Do List Widget
- Task categories with visual indicators
- Checkbox interaction for completion
- Priority sorting options

### 5. Photo Gallery Widget (Optional)
- Carousel/slideshow of family photos
- Caption display
- Full-screen viewing option

### 6. Configuration Panel
- Language selector
- Units selector (metric/imperial)
- Refresh interval settings
- Widget visibility toggles
- Account connection management

## Responsive Design Strategy

The application will use a mobile-first responsive design approach:
1. Base design for mobile devices
2. Tablet/desktop enhancements with media queries
3. Special considerations for TV display:
   - Larger touch targets
   - Simplified navigation
   - Focus states for remote control navigation

## Internationalization

- Implement react-i18next for translation management
- Support for English and Hebrew languages initially
- RTL layout support for Hebrew content
- Date and time formatting based on locale
- Separate translation files for each supported language

## Performance Considerations

- Lazy loading of non-critical components
- Image optimization for photo gallery
- Efficient re-rendering with React.memo and useMemo
- Data caching strategy
- Service worker for offline functionality

## Error Handling

- Graceful fallbacks for API failures
- User-friendly error messages
- Automatic retry mechanism for transient errors
- Comprehensive error logging
- Fallback content when data cannot be retrieved

## Testing Strategy

- Unit tests for utility functions and hooks
- Component tests for UI elements
- Integration tests for API interactions
- End-to-end tests for critical user flows
- Accessibility testing

## Deployment Process

1. GitHub repository setup with branch protection
2. CI/CD pipeline configuration with GitHub Actions
3. Build process with environment-specific configurations
4. Deployment to Netlify with preview deployments for PRs
5. Post-deployment smoke tests

## Future Enhancements

- Additional widget types (shopping list, meal planner)
- Voice control integration
- Custom themes and layouts
- Mobile app wrapper using Capacitor
- Additional language support
- Push notifications for important events

This design provides a solid foundation for implementing the Family Portal Web App according to the requirements, with a focus on usability across different devices, particularly the 65" LG OLED TV as the primary display.