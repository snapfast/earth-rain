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

### Real-time Data Display
- Live weather data integration via OpenWeatherMap API
- Real-time disaster alerts and emergency notifications
- WebSocket connections for instant data updates
- Auto-refresh mechanisms with error handling

### Full-screen & Kiosk Mode
- Progressive Web App (PWA) configuration
- Full-screen display optimization
- Kiosk mode support for dedicated display systems
- Multi-screen and responsive design

### Dashboard Components
- Interactive weather widgets (temperature, humidity, wind, precipitation)
- Disaster alert panels (earthquakes, floods, severe weather)
- Real-time maps with weather overlays
- Emergency management status indicators

### Technical Features
- Offline capability with service workers
- WebSocket real-time data streaming
- Responsive design for various screen sizes
- Performance optimized for continuous operation

## Implementation Phases

### Phase 1: Project Setup & Architecture
- [x] SvelteKit project initialization with TypeScript
- [ ] PWA manifest for full-screen/kiosk mode
- [ ] Project structure for dashboard components
- [ ] Environment variables for API keys

### Phase 2: Core Dashboard Framework
- [ ] Responsive full-screen layout
- [ ] Component structure (weather widgets, disaster alerts, maps)
- [ ] State management for real-time data
- [ ] Dashboard-optimized CSS styling

### Phase 3: Data Integration
- [ ] OpenWeatherMap API integration
- [ ] WebSocket connections for real-time updates
- [ ] Emergency/disaster API integrations (USGS, NOAA, etc.)
- [ ] Data refresh and error handling

### Phase 4: Real-time Features
- [ ] WebSocket implementation for live data streams
- [ ] Auto-refresh mechanisms for API polling
- [ ] Alert system for critical weather/disaster events
- [ ] Offline capability with service workers

### Phase 5: Display Optimization
- [ ] Full-screen PWA configuration
- [ ] Kiosk mode setup for different platforms
- [ ] Multi-screen support and responsive design
- [ ] Performance optimization and caching

### Phase 6: Deployment & Testing
- [ ] Build and deployment pipeline
- [ ] Cross-platform testing (desktop, tablet, mobile)
- [ ] Kiosk mode testing on target devices
- [ ] Performance monitoring setup

## API Integrations

### Weather Data
- **OpenWeatherMap API**: Current weather, forecasts, alerts
- **Visual Crossing API**: Historical data and detailed forecasts
- **Tomorrow.io API**: Webhook support for real-time updates

### Disaster Monitoring
- **USGS Earthquake API**: Real-time earthquake data
- **NOAA Weather API**: Severe weather alerts
- **Emergency Management APIs**: Local emergency alerts

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
- Modern browser with WebSocket support
- API keys for weather and emergency services

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Performance Targets

- **Load Time**: < 2 seconds initial load
- **Update Frequency**: Real-time updates every 30 seconds
- **Bundle Size**: < 500KB for optimal kiosk performance
- **Memory Usage**: Minimal footprint for 24/7 operation