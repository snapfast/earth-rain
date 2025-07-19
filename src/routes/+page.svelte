<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { weatherData, currentLocation, citiesWeatherData, setCitiesWeatherData, setCitiesLoadingState } from '../lib/stores/weather.js';
	import { disasterEvents } from '../lib/stores/disaster.js';
	import { WeatherAPI } from '../lib/api/weather.js';
	import { DisasterAPI } from '../lib/api/disaster.js';
	import { TimeAPI } from '../lib/api/time.js';
	
	import DashboardHeader from '../lib/components/DashboardHeader.svelte';
	import WeatherWidget from '../lib/components/weather/WeatherWidget.svelte';
	import DisasterWidget from '../lib/components/disaster/DisasterWidget.svelte';
	import AlertsWidget from '../lib/components/AlertsWidget.svelte';
	import MapsWidget from '../lib/components/maps/MapsWidget.svelte';
	
	let updateInterval: NodeJS.Timeout;
	let lastUpdate = new Date();
	
	// Popular cities to cycle through
	const popularCities = [
		{ name: 'New York', country: 'US', state: 'NY', lat: 40.7128, lon: -74.0060 },
		{ name: 'London', country: 'GB', state: '', lat: 51.5074, lon: -0.1278 },
		{ name: 'Tokyo', country: 'JP', state: '', lat: 35.6762, lon: 139.6503 },
		{ name: 'Paris', country: 'FR', state: '', lat: 48.8566, lon: 2.3522 },
		{ name: 'Sydney', country: 'AU', state: '', lat: -33.8688, lon: 151.2093 },
		{ name: 'San Francisco', country: 'US', state: 'CA', lat: 37.7749, lon: -122.4194 },
		{ name: 'Dubai', country: 'AE', state: '', lat: 25.2048, lon: 55.2708 },
		{ name: 'Singapore', country: 'SG', state: '', lat: 1.3521, lon: 103.8198 }
	];
	
	let currentCityIndex = 0;
	
	async function loadInitialData() {
		try {
			// Set initial city (for map location)
			const initialCity = popularCities[currentCityIndex];
			currentLocation.set(initialCity);
			
			// Load weather data for all cities
			await loadAllCitiesWeather();
			
			// Load disaster data
			try {
				const disasters = await DisasterAPI.getRecentDisasters();
				disasterEvents.set(disasters);
			} catch (disasterError) {
				console.error('Failed to load disaster data:', disasterError);
				// Continue even if disaster data fails - mock data will be used
			}
			
			lastUpdate = await TimeAPI.getCurrentUTCTime();
		} catch (error) {
			console.error('Failed to load initial data:', error);
		}
	}

	async function loadAllCitiesWeather() {
		try {
			setCitiesLoadingState(true);
			
			// Load weather for all cities in parallel
			const weatherPromises = popularCities.map(city => WeatherAPI.getCurrentWeather(city));
			const weatherResults = await Promise.allSettled(weatherPromises);
			
			// Filter successful results
			const successfulWeather = weatherResults
				.map((result, index) => {
					if (result.status === 'fulfilled') {
						return result.value;
					} else {
						console.error(`Failed to load weather for ${popularCities[index].name}:`, result.reason);
						return null;
					}
				})
				.filter(weather => weather !== null);
			
			setCitiesWeatherData(successfulWeather);
			setCitiesLoadingState(false);
		} catch (error) {
			console.error('Failed to load cities weather:', error);
			setCitiesLoadingState(false);
		}
	}
	
	async function refreshData() {
		try {
			// Cycle to next city for map location
			currentCityIndex = (currentCityIndex + 1) % popularCities.length;
			const nextCity = popularCities[currentCityIndex];
			currentLocation.set(nextCity);
			
			// Refresh weather data for all cities
			await loadAllCitiesWeather();
			
			// Refresh disaster data
			try {
				const disasters = await DisasterAPI.getRecentDisasters();
				disasterEvents.set(disasters);
			} catch (disasterError) {
				console.error('Failed to refresh disaster data:', disasterError);
			}
			
			lastUpdate = await TimeAPI.getCurrentUTCTime();
		} catch (error) {
			console.error('Failed to refresh data:', error);
		}
	}
	
	onMount(() => {
		loadInitialData();
		
		// Set up auto-refresh every 30 seconds
		updateInterval = setInterval(refreshData, 30000);
	});
	
	onDestroy(() => {
		if (updateInterval) {
			clearInterval(updateInterval);
		}
	});
</script>

<svelte:head>
	<title>Earth Rain - Weather & Disaster Dashboard</title>
</svelte:head>

<main class="dashboard-grid">
	<div class="dashboard-header">
		<DashboardHeader {lastUpdate} />
	</div>
	
	<div class="weather-section">
		<WeatherWidget />
	</div>
	
	<div class="disaster-section">
		<DisasterWidget />
	</div>
	
	<div class="maps-section">
		<MapsWidget />
	</div>
	
	<div class="alerts-section">
		<AlertsWidget />
	</div>
</main>