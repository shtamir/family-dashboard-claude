# Family Portal Web App Requirements Document

## Overview
This document outlines the requirements for a family portal web application that will be displayed primarily on a 65" 4K LG C1 OLED TV in the living room, as well as on family members' mobile phones and PCs.

## Project Information
- **GitHub Repository**: https://github.com/shtamir/family-tv-dashboard
- **Deployment**: https://family-tv-dashboard.netlify.app
- **Google OAuth 2.0 Client ID**: 477653231572-bbf1hj129rsn78uks60s9ennau5siunc.apps.googleusercontent.com

## Core Features

### 1. Family Calendar
- Display upcoming events from the family's Google Calendar
- Show event details including time, title, and location
- Highlight today's events distinctly
- Support for recurring events

### 2. Family Messages
- Retrieve and display messages from a designated Google Sheet
- Support for priority/important messages
- Display message author and timestamp

### 3. Local Weather Forecast
- Show 3-day weather forecast for the family's location
- Display temperature, conditions, and precipitation chance
- Support for different temperature units (°C/°F)

### 4. Family To-Do List
- Retrieve and display tasks from a designated Google Sheet
- Support for task categories and priorities
- Allow marking tasks as complete

### 5. Family Photos (Optional)
- Display photos from a specific Google Photos Album
- Support for slideshow functionality
- Caption display if available

## Technical Requirements

### Authentication & Data Access
- Use Google Identity Services (GIS) for authentication
- Access Google Calendar API for calendar events
- Access Google Sheets API for messages and to-do lists
- Access Google Photos API for family photos
- Implement secure token handling and refresh mechanisms

### User Interface
- Responsive design that works on:
  - 65" 4K LG C1 OLED TV (primary)
  - Mobile phones (various sizes)
  - Desktop/laptop computers
- Support for LG TV smart air remote navigation
- Clean, family-friendly design with appropriate sizing for TV viewing distance
- Multi-language support (initially English and Hebrew)
- RTL (Right-to-Left) layout support for Hebrew

### Configuration
- Password-protected configuration menu
- Settings for:
  - Display language (English/Hebrew)
  - Measurement units (metric/imperial)
  - Data refresh periods
  - Layout customization options
  - Google account connection

### Performance & Updates
- Efficient loading and rendering for TV display
- Automatic data refresh at configurable intervals
- Graceful handling of connectivity issues
- Caching mechanism for offline functionality

## Non-Functional Requirements

### Security
- Secure handling of Google OAuth credentials
- No storage of sensitive data in client-side code
- Protection of configuration settings

### Accessibility
- Large, readable text for TV viewing
- High contrast options
- Navigation suitable for TV remote control

### Reliability
- Error handling for API failures
- Fallback content when data cannot be retrieved
- Logging for troubleshooting

## Development Guidelines
- Progressive web app (PWA) approach for cross-platform compatibility
- Modern JavaScript framework (React recommended)
- Responsive design principles
- Internationalization (i18n) library implementation
- Clear separation of concerns (data, presentation, configuration)
- Automated testing for critical components

## Implementation Phases
1. **Phase 1**: Basic structure, authentication, and calendar integration
2. **Phase 2**: Weather forecast and family messages implementation
3. **Phase 3**: To-do list functionality
4. **Phase 4**: Configuration menu and language support
5. **Phase 5**: Family photos integration (optional)
6. **Phase 6**: Testing, refinement, and deployment

## Assumptions and Constraints
- Family members share a common Google account for portal data
- Internet connectivity is generally available
- TV browser capabilities may be limited compared to desktop browsers
- Google API usage quotas and limitations apply