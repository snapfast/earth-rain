# Earth Rain - Weather & Disaster Dashboard

A full-screen, real-time weather and disaster monitoring dashboard built with SvelteKit.

## Project Overview

This application provides a comprehensive, full-screen dashboard for monitoring weather conditions and disaster events in real-time. Designed for emergency management centers, weather stations, and public display systems.

## Technology Stack

**Framework**: SvelteKit + TypeScript
- **Why Svelte**: Best performance for real-time dashboards with minimal runtime overhead
- **Bundle Size**: Smallest JavaScript payload compared to React/Vue
- **Real-time Optimized**: Excellent handling of frequent state updates
- **PWA Ready**: Built-in PWA support for kiosk mode deployment

## Key Features

### ✅ Implemented Features

#### Real-time Data Display
- Live weather data integration via Open-Meteo API (free tier)
- Global weather monitoring for 8 major cities (NYC, London, Tokyo, Paris, Sydney, SF, Dubai, Singapore)
- Real-time earthquake data from USGS API
- Auto-refresh every 30 seconds with error handling
- Mock disaster data for comprehensive monitoring

#### Dashboard Components
- Weather widget with global city weather table
- Disaster widget showing earthquakes and mock disaster events
- Dashboard header with live status indicators
- Time utilities for GMT/UTC display
- Severity-based color coding for disasters

#### Data Management
- Svelte stores for reactive state management
- TypeScript interfaces for type safety
- Error handling with fallback mock data
- Location cycling for map display

### 🚧 Planned Features

#### Full-screen & Kiosk Mode
- Progressive Web App (PWA) configuration
- Full-screen display optimization
- Kiosk mode support for dedicated display systems
- Multi-screen and responsive design

#### Enhanced Real-time Features
- WebSocket connections for instant data updates
- Maps widget with weather overlays
- Alerts widget for critical notifications
- Offline capability with service workers

#### Technical Enhancements
- Additional API integrations (NOAA, emergency services)
- Performance optimization and caching
- Advanced alert system for critical events

## Implementation Status

### ✅ Phase 1: Project Setup & Architecture (Complete)
- [x] SvelteKit project initialization with TypeScript
- [x] Project structure for dashboard components
- [x] TailwindCSS styling framework setup
- [ ] PWA manifest for full-screen/kiosk mode
- [ ] Environment variables for API keys

### ✅ Phase 2: Core Dashboard Framework (Complete)
- [x] Responsive dashboard grid layout
- [x] Component structure (WeatherWidget, DisasterWidget, DashboardHeader, etc.)
- [x] Svelte stores for reactive state management
- [x] Dashboard-optimized CSS styling with amber theme

### ✅ Phase 3: Data Integration (Mostly Complete)
- [x] Open-Meteo API integration (weather data)
- [x] USGS earthquake API integration
- [x] Mock disaster data system
- [x] Data refresh and error handling with fallbacks
- [x] Time API for UTC synchronization
- [ ] Additional emergency API integrations (NOAA, etc.)

### 🚧 Phase 4: Real-time Features (In Progress)
- [x] Auto-refresh mechanisms for API polling (30-second intervals)
- [x] Location cycling system for map display
- [ ] WebSocket implementation for live data streams
- [ ] Alert system for critical weather/disaster events
- [ ] Offline capability with service workers

### ⏳ Phase 5: Display Optimization (Pending)
- [ ] Full-screen PWA configuration
- [ ] Kiosk mode setup for different platforms
- [ ] Multi-screen support optimization
- [ ] Performance optimization and caching
- [ ] Maps widget implementation
- [ ] Alerts widget implementation

### ⏳ Phase 6: Deployment & Testing (Pending)
- [ ] Build and deployment pipeline
- [ ] Cross-platform testing (desktop, tablet, mobile)
- [ ] Kiosk mode testing on target devices
- [ ] Performance monitoring setup

## API Integrations

### ✅ Currently Implemented

#### Weather Data
- **Open-Meteo API**: Free weather API providing current conditions and 5-day forecasts
  - Global coverage for 8 major cities
  - Temperature, humidity, wind speed/direction, weather conditions
  - No API key required

#### Disaster Monitoring
- **USGS Earthquake API**: Real-time earthquake data from multiple endpoints
  - Automatic fallback between significant, 2.5+, and 1.0+ magnitude feeds
  - Earthquake location, magnitude, depth, tsunami warnings
  - No API key required

#### Time Synchronization
- **WorldTimeAPI**: Accurate UTC time for consistent timestamps across all data

### 🚧 Planned Integrations

#### Enhanced Weather Data
- **OpenWeatherMap API**: Premium weather alerts and detailed forecasts
- **Visual Crossing API**: Historical data and extended forecasts
- **Tomorrow.io API**: Webhook support for real-time updates

#### Additional Disaster Sources
- **NOAA Weather API**: Severe weather alerts and warnings
- **Emergency Management APIs**: Local emergency alerts and notifications
- **Fire Information APIs**: Real-time wildfire data

## Deployment Options

### Progressive Web App (PWA)
- Install on devices for native app-like experience
- Full-screen mode without browser UI
- Offline functionality with cached data

### Kiosk Mode Deployment
- **Android**: Single/multi-app kiosk mode via MDM
- **iOS**: Guided Access Mode integration
- **Chrome OS**: Managed kiosk mode for PWAs
- **Desktop**: Full-screen browser deployment

## Development Requirements

- Node.js 20+ (for latest SvelteKit compatibility)
- Modern browser with JavaScript enabled
- No API keys required for current implementation (all APIs are free/public)

## Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd earth-rain

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
# The dashboard will automatically start loading weather and disaster data

# Build for production
npm run build

# Preview production build
npm run preview
```

## Current Functionality

The dashboard currently provides:

1. **Global Weather Monitoring**: Real-time weather data for 8 major cities displayed in a table format
2. **Earthquake Tracking**: Live earthquake data from USGS with automatic fallback systems
3. **Auto-refresh**: Data updates every 30 seconds with visual loading indicators
4. **Error Handling**: Graceful fallback to mock data if APIs are unavailable
5. **Responsive Design**: Optimized for various screen sizes with dashboard grid layout

## Mock Data System

The application includes comprehensive mock data for disaster events when real APIs are unavailable:
- Earthquake data with realistic magnitudes and locations
- Wildfire alerts for various regions
- Hurricane tracking information
- Flood warnings and tornado alerts
- Volcanic activity monitoring

## Performance Targets

- **Load Time**: < 2 seconds initial load
- **Update Frequency**: Real-time updates every 30 seconds
- **Bundle Size**: < 500KB for optimal kiosk performance
- **Memory Usage**: Minimal footprint for 24/7 operation