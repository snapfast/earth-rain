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
- Global weather monitoring for 16 major cities worldwide
- Real-time earthquake data from USGS API (magnitude 0.5+)
- Auto-refresh every hour with rate limit protection
- **No mock data** - 100% real data from verified sources

#### Dashboard Components
- **Global Weather Monitor**: Real-time weather table for 16 cities
- **Disaster Monitoring**: Interactive earthquake cards with click-to-view details
- **Disaster Details**: Comprehensive information panel with horizontal grid layout
- **Regional Overview Map**: Interactive map showing disaster locations with coordinates
- Dashboard header with live status indicators and time synchronization

#### Interactive Features
- **Click-to-explore**: Click any disaster to view detailed information
- **Map integration**: Automatic map centering on selected disaster locations
- **Coordinate display**: Precise latitude/longitude for all disasters
- **Distance calculations**: Shows nearby events relative to selected disasters
- **Real-time updates**: Live data refresh with visual loading states

#### Data Management
- Svelte stores for reactive state management
- TypeScript interfaces for comprehensive type safety
- Robust error handling with graceful degradation
- Smart rate limit management to prevent API throttling

### 🚧 Planned Features

#### Full-screen & Kiosk Mode
- Progressive Web App (PWA) configuration
- Full-screen display optimization
- Kiosk mode support for dedicated display systems
- Multi-screen and responsive design

#### Enhanced Real-time Features
- WebSocket connections for instant data updates
- Weather overlay integration on maps
- Advanced alert system for critical events
- Offline capability with service workers

#### Additional Data Sources
- NOAA weather alerts and warnings
- Wildfire monitoring APIs
- Hurricane tracking systems
- Flood monitoring networks

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

### ✅ Phase 3: Data Integration (Complete)
- [x] Open-Meteo API integration (weather data)
- [x] USGS earthquake API integration with multiple endpoints
- [x] Real data only - removed all mock data systems
- [x] Advanced error handling with rate limit protection
- [x] Time API for UTC synchronization
- [x] Smart data refresh intervals (hourly) to prevent API abuse

### ✅ Phase 4: Interactive Features (Complete)
- [x] Auto-refresh mechanisms with intelligent rate limiting
- [x] Interactive disaster selection system
- [x] Comprehensive disaster details panel
- [x] Map integration with disaster location display
- [x] Coordinate-based map centering and zoom
- [x] Distance calculations and nearby event correlation

### ✅ Phase 5: Display Optimization (Complete)
- [x] Responsive grid layouts optimized for horizontal space usage
- [x] Interactive maps widget with OpenStreetMap integration
- [x] Disaster details widget with comprehensive information display
- [x] Performance optimization and efficient state management
- [x] Visual feedback systems for all user interactions

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
  - Automatic fallback between 1.0+, 2.5+, and significant magnitude feeds
  - Earthquake location, magnitude, depth, significance, tsunami warnings
  - Interactive disaster selection with detailed information display
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

1. **Global Weather Monitoring**: Real-time weather data for 16 major cities worldwide
2. **Interactive Disaster Monitoring**: Live earthquake data with clickable cards for detailed exploration
3. **Comprehensive Disaster Details**: Detailed information panel with type-specific metadata
4. **Interactive Map Integration**: Real-time map updates showing disaster locations with coordinates
5. **Smart Data Management**: Hourly refresh cycles with intelligent rate limiting
6. **Real Data Only**: 100% authentic data from verified government and scientific sources

## Key Interactive Features

### Disaster Exploration System
- **Click any disaster** in the monitoring panel to view comprehensive details
- **Automatic map centering** on selected disaster location with precise coordinates
- **Distance calculations** showing nearby events relative to selected disasters
- **Type-specific information** including magnitude, depth, significance for earthquakes

### Map Integration
- **Dynamic location updates** based on selected disasters
- **Zoom level optimization** for detailed disaster area viewing
- **Coordinate display** with precise latitude/longitude information
- **Nearby events correlation** showing related disasters in the area

## Performance Targets

- **Load Time**: < 2 seconds initial load
- **Update Frequency**: Intelligent hourly updates to respect API rate limits
- **Bundle Size**: < 500KB for optimal kiosk performance
- **Memory Usage**: Minimal footprint for 24/7 operation
- **Data Accuracy**: 100% real-time data from verified scientific sources