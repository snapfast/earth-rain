import type { WeatherData, LocationData } from '../types/weather.js';
import { TimeAPI } from './time.js';

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherAPI {
	private static async fetchJson(url: string): Promise<any> {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
		}
		return response.json();
	}

	static async getCurrentWeather(location: LocationData): Promise<WeatherData> {
		try {
			// Get current weather and forecast from Open-Meteo (free API)
			const weatherUrl = `${BASE_URL}/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=UTC&forecast_days=5`;
			const weatherData = await this.fetchJson(weatherUrl);

			return await this.transformWeatherData(weatherData, location);
		} catch (error) {
			console.error('Failed to fetch weather data:', error);
			throw error;
		}
	}

	static async searchLocations(query: string): Promise<LocationData[]> {
		try {
			const url = `${GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
			const data = await this.fetchJson(url);

			if (!data.results) return [];

			return data.results.map((item: any) => ({
				name: item.name,
				country: item.country_code || item.country || 'Unknown',
				state: item.admin1 || '',
				lat: item.latitude,
				lon: item.longitude
			}));
		} catch (error) {
			console.error('Failed to search locations:', error);
			throw error;
		}
	}

	private static async transformWeatherData(data: any, location: LocationData): Promise<WeatherData> {
		const current = data.current;
		const daily = data.daily;

		// Get current time from API instead of local time
		const currentApiTime = await TimeAPI.getCurrentUTCTime();

		return {
			location: {
				name: location.name,
				country: location.country,
				lat: location.lat,
				lon: location.lon
			},
			current: {
				temperature: Math.round(current.temperature_2m),
				feels_like: Math.round(current.apparent_temperature),
				humidity: current.relative_humidity_2m,
				pressure: 1013, // Open-Meteo doesn't provide pressure in free tier, using standard
				visibility: 10, // Default visibility in km
				wind_speed: current.wind_speed_10m,
				wind_direction: current.wind_direction_10m,
				weather_code: current.weather_code,
				weather_description: this.getWeatherDescription(current.weather_code),
				icon: this.getWeatherIcon(current.weather_code, current.is_day)
			},
			forecast: daily.time.slice(0, 5).map((date: string, index: number) => ({
				date: new Date(date),
				temperature_min: Math.round(daily.temperature_2m_min[index]),
				temperature_max: Math.round(daily.temperature_2m_max[index]),
				weather_code: daily.weather_code[index],
				weather_description: this.getWeatherDescription(daily.weather_code[index]),
				icon: this.getWeatherIcon(daily.weather_code[index], true),
				precipitation_probability: daily.precipitation_probability_max[index] || 0,
				wind_speed: 0 // Daily wind speed not provided in free tier
			})),
			alerts: [],
			last_updated: currentApiTime
		};
	}

	private static getWeatherDescription(code: number): string {
		const descriptions: { [key: number]: string } = {
			0: 'clear sky',
			1: 'mainly clear',
			2: 'partly cloudy',
			3: 'overcast',
			45: 'fog',
			48: 'depositing rime fog',
			51: 'light drizzle',
			53: 'moderate drizzle',
			55: 'dense drizzle',
			61: 'slight rain',
			63: 'moderate rain',
			65: 'heavy rain',
			71: 'slight snow',
			73: 'moderate snow',
			75: 'heavy snow',
			95: 'thunderstorm',
			96: 'thunderstorm with slight hail',
			99: 'thunderstorm with heavy hail'
		};
		return descriptions[code] || 'unknown';
	}

	private static getWeatherIcon(code: number, isDay: boolean): string {
		// Using emoji icons for free implementation
		const dayIcons: { [key: number]: string } = {
			0: '☀️', // clear sky
			1: '🌤️', // mainly clear
			2: '⛅', // partly cloudy
			3: '☁️', // overcast
			45: '🌫️', // fog
			48: '🌫️', // depositing rime fog
			51: '🌦️', // light drizzle
			53: '🌦️', // moderate drizzle
			55: '🌧️', // dense drizzle
			61: '🌦️', // slight rain
			63: '🌧️', // moderate rain
			65: '🌧️', // heavy rain
			71: '🌨️', // slight snow
			73: '❄️', // moderate snow
			75: '❄️', // heavy snow
			95: '⛈️', // thunderstorm
			96: '⛈️', // thunderstorm with slight hail
			99: '⛈️' // thunderstorm with heavy hail
		};

		const nightIcons: { [key: number]: string } = {
			0: '🌙', // clear sky
			1: '🌙', // mainly clear
			2: '⛅', // partly cloudy
			3: '☁️', // overcast
			45: '🌫️', // fog
			48: '🌫️', // depositing rime fog
			51: '🌦️', // light drizzle
			53: '🌦️', // moderate drizzle
			55: '🌧️', // dense drizzle
			61: '🌦️', // slight rain
			63: '🌧️', // moderate rain
			65: '🌧️', // heavy rain
			71: '🌨️', // slight snow
			73: '❄️', // moderate snow
			75: '❄️', // heavy snow
			95: '⛈️', // thunderstorm
			96: '⛈️', // thunderstorm with slight hail
			99: '⛈️' // thunderstorm with heavy hail
		};

		return isDay ? (dayIcons[code] || '❓') : (nightIcons[code] || '❓');
	}

	static getWeatherIconUrl(icon: string): string {
		// Return a data URL with the emoji as an SVG for compatibility
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
			<text x="50%" y="50%" font-size="48" text-anchor="middle" dominant-baseline="middle">${icon}</text>
		</svg>`;
		return `data:image/svg+xml;base64,${btoa(svg)}`;
	}
}