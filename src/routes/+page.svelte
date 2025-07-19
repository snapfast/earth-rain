<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { weatherData, currentLocation, citiesWeatherData, setCitiesWeatherData, setCitiesLoadingState } from '../lib/stores/weather.js';
	import { disasterEvents, setDisasterLoadingState } from '../lib/stores/disaster.js';
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
		// North America
		{ name: 'New York', country: 'US', state: 'NY', lat: 40.7128, lon: -74.0060 },
		{ name: 'Los Angeles', country: 'US', state: 'CA', lat: 34.0522, lon: -118.2437 },
		{ name: 'San Francisco', country: 'US', state: 'CA', lat: 37.7749, lon: -122.4194 },
		{ name: 'Chicago', country: 'US', state: 'IL', lat: 41.8781, lon: -87.6298 },
		{ name: 'Toronto', country: 'CA', state: 'ON', lat: 43.6532, lon: -79.3832 },
		{ name: 'Mexico City', country: 'MX', state: '', lat: 19.4326, lon: -99.1332 },
		
		// Europe
		{ name: 'London', country: 'GB', state: '', lat: 51.5074, lon: -0.1278 },
		{ name: 'Paris', country: 'FR', state: '', lat: 48.8566, lon: 2.3522 },
		{ name: 'Berlin', country: 'DE', state: '', lat: 52.5200, lon: 13.4050 },
		{ name: 'Madrid', country: 'ES', state: '', lat: 40.4168, lon: -3.7038 },
		{ name: 'Rome', country: 'IT', state: '', lat: 41.9028, lon: 12.4964 },
		{ name: 'Amsterdam', country: 'NL', state: '', lat: 52.3676, lon: 4.9041 },
		{ name: 'Moscow', country: 'RU', state: '', lat: 55.7558, lon: 37.6176 },
		
		// Asia
		{ name: 'Tokyo', country: 'JP', state: '', lat: 35.6762, lon: 139.6503 },
		{ name: 'Beijing', country: 'CN', state: '', lat: 39.9042, lon: 116.4074 },
		{ name: 'Shanghai', country: 'CN', state: '', lat: 31.2304, lon: 121.4737 },
		{ name: 'Hong Kong', country: 'HK', state: '', lat: 22.3193, lon: 114.1694 },
		{ name: 'Singapore', country: 'SG', state: '', lat: 1.3521, lon: 103.8198 },
		{ name: 'Seoul', country: 'KR', state: '', lat: 37.5665, lon: 126.9780 },
		{ name: 'Mumbai', country: 'IN', state: '', lat: 19.0760, lon: 72.8777 },
		{ name: 'Delhi', country: 'IN', state: '', lat: 28.7041, lon: 77.1025 },
		{ name: 'Bangkok', country: 'TH', state: '', lat: 13.7563, lon: 100.5018 },
		{ name: 'Jakarta', country: 'ID', state: '', lat: -6.2088, lon: 106.8456 },
		
		// Middle East & Africa
		{ name: 'Dubai', country: 'AE', state: '', lat: 25.2048, lon: 55.2708 },
		{ name: 'Istanbul', country: 'TR', state: '', lat: 41.0082, lon: 28.9784 },
		{ name: 'Cairo', country: 'EG', state: '', lat: 30.0444, lon: 31.2357 },
		{ name: 'Lagos', country: 'NG', state: '', lat: 6.5244, lon: 3.3792 },
		{ name: 'Cape Town', country: 'ZA', state: '', lat: -33.9249, lon: 18.4241 },
		
		// South America
		{ name: 'São Paulo', country: 'BR', state: '', lat: -23.5558, lon: -46.6396 },
		{ name: 'Rio de Janeiro', country: 'BR', state: '', lat: -22.9068, lon: -43.1729 },
		{ name: 'Buenos Aires', country: 'AR', state: '', lat: -34.6118, lon: -58.3960 },
		{ name: 'Lima', country: 'PE', state: '', lat: -12.0464, lon: -77.0428 },
		
		// Oceania
		{ name: 'Sydney', country: 'AU', state: '', lat: -33.8688, lon: 151.2093 },
		{ name: 'Melbourne', country: 'AU', state: '', lat: -37.8136, lon: 144.9631 },
		{ name: 'Auckland', country: 'NZ', state: '', lat: -36.8485, lon: 174.7633 }
	];
	
	let currentCityIndex = 0;
	let isManualSelection = false;
	
	async function loadInitialData() {
		try {
			// Set initial loading states
			setCitiesLoadingState(true);
			setDisasterLoadingState(true);
			
			// Set initial city (for map location)
			const initialCity = popularCities[currentCityIndex];
			currentLocation.set(initialCity);
			
			// Load weather data for all cities
			await loadAllCitiesWeather();
			
			// Load disaster data
			try {
				const disasters = await DisasterAPI.getRecentDisasters();
				disasterEvents.set(disasters);
				setDisasterLoadingState(false);
			} catch (disasterError) {
				console.error('Failed to load disaster data:', disasterError);
				setDisasterLoadingState(false);
				// Continue even if disaster data fails - mock data will be used
			}
			
			lastUpdate = await TimeAPI.getCurrentUTCTime();
		} catch (error) {
			console.error('Failed to load initial data:', error);
			setCitiesLoadingState(false);
			setDisasterLoadingState(false);
		}
	}

	async function loadAllCitiesWeather() {
		try {
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
			// Set loading states for refresh
			setCitiesLoadingState(true);
			setDisasterLoadingState(true);
			
			// Only cycle cities if not manually selected
			if (!isManualSelection) {
				currentCityIndex = (currentCityIndex + 1) % popularCities.length;
				const nextCity = popularCities[currentCityIndex];
				currentLocation.set(nextCity);
			}
			
			// Refresh weather data for all cities
			await loadAllCitiesWeather();
			
			// Refresh disaster data
			try {
				const disasters = await DisasterAPI.getRecentDisasters();
				disasterEvents.set(disasters);
				setDisasterLoadingState(false);
			} catch (disasterError) {
				console.error('Failed to refresh disaster data:', disasterError);
				setDisasterLoadingState(false);
			}
			
			lastUpdate = await TimeAPI.getCurrentUTCTime();
		} catch (error) {
			console.error('Failed to refresh data:', error);
			setCitiesLoadingState(false);
			setDisasterLoadingState(false);
		}
	}
	
	function handleCitySelect(selectedCity) {
		// Update current location to selected city
		currentLocation.set(selectedCity);
		
		// Update current city index to match selection
		currentCityIndex = popularCities.findIndex(city => 
			city.name === selectedCity.name && city.country === selectedCity.country
		);
		
		// Mark as manual selection to stop auto-cycling
		isManualSelection = true;
		
		// Optional: Resume auto-cycling after 5 minutes of inactivity
		setTimeout(() => {
			isManualSelection = false;
		}, 300000); // 5 minutes
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
		<DashboardHeader {lastUpdate} {popularCities} onCitySelect={handleCitySelect} />
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