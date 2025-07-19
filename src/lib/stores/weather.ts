import { writable, derived } from 'svelte/store';
import type { WeatherData, LocationData } from '../types/weather.js';

// Weather data stores
export const weatherData = writable<WeatherData | null>(null);
export const currentLocation = writable<LocationData | null>(null);
export const isLoading = writable<boolean>(true);
export const error = writable<string | null>(null);

// Multi-city weather data
export const citiesWeatherData = writable<WeatherData[]>([]);
export const isCitiesLoading = writable<boolean>(false);
export const citiesError = writable<string | null>(null);

// Auto-refresh interval
export const updateInterval = writable<number>(30000); // 30 seconds

// Derived stores for specific weather components
export const currentWeather = derived(
	weatherData,
	($weatherData) => $weatherData?.current
);

export const weatherForecast = derived(
	weatherData,
	($weatherData) => $weatherData?.forecast || []
);

export const weatherAlerts = derived(
	weatherData,
	($weatherData) => $weatherData?.alerts || []
);

export const hasActiveAlerts = derived(
	weatherAlerts,
	($alerts) => $alerts.length > 0
);

// Temperature unit preference
export const temperatureUnit = writable<'celsius' | 'fahrenheit'>('celsius');

// Helper functions
export function setWeatherData(data: WeatherData) {
	weatherData.set(data);
	error.set(null);
}

export function setWeatherError(errorMessage: string) {
	error.set(errorMessage);
	isLoading.set(false);
}

export function setLoadingState(loading: boolean) {
	isLoading.set(loading);
	if (loading) {
		error.set(null);
	}
}

// Helper functions for multi-city weather
export function setCitiesWeatherData(data: WeatherData[]) {
	citiesWeatherData.set(data);
	citiesError.set(null);
}

export function setCitiesWeatherError(errorMessage: string) {
	citiesError.set(errorMessage);
	isCitiesLoading.set(false);
}

export function setCitiesLoadingState(loading: boolean) {
	isCitiesLoading.set(loading);
	if (loading) {
		citiesError.set(null);
	}
}