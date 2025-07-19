import type { DisasterEvent, EarthquakeData, DisasterType } from '../types/disaster.js';
import { TimeAPI } from './time.js';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export class DisasterAPI {
	private static async fetchJson(url: string): Promise<any> {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Disaster API error: ${response.status} ${response.statusText}`);
		}
		return response.json();
	}

	static async getEarthquakes(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<EarthquakeData[]> {
		try {
			const url = `${USGS_BASE_URL}/significant_${timeframe}.geojson`;
			const data = await this.fetchJson(url);

			return data.features.map((feature: any) => {
				const props = feature.properties;
				const coords = feature.geometry.coordinates;

				return {
					id: feature.id,
					type: 'earthquake' as const,
					title: props.title,
					description: props.title,
					severity: this.getEarthquakeSeverity(props.mag),
					location: {
						name: props.place || 'Unknown location',
						lat: coords[1],
						lon: coords[0]
					},
					timestamp: new Date(props.time),
					source: 'USGS',
					url: props.url,
					metadata: {
						magnitude: props.mag,
						depth: coords[2],
						significance: props.sig,
						tsunami_warning: props.tsunami === 1
					}
				} as EarthquakeData;
			});
		} catch (error) {
			console.error('Failed to fetch earthquake data:', error);
			throw error;
		}
	}

	static async getRecentDisasters(): Promise<DisasterEvent[]> {
		try {
			// Get earthquakes from USGS (real data only)
			const earthquakes = await this.getEarthquakesFromUSGS();
			
			// Sort by timestamp and return real data only
			const allDisasters = earthquakes
				.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
				.slice(0, 50);

			return allDisasters;
		} catch (error) {
			console.error('Failed to fetch disaster data:', error);
			// Return empty array if API fails - no mock data
			return [];
		}
	}

	static async getRecentEarthquakes(): Promise<EarthquakeData[]> {
		const disasters = await this.getRecentDisasters();
		return disasters.filter(d => d.type === 'earthquake') as EarthquakeData[];
	}

	private static async getEarthquakesFromUSGS(): Promise<EarthquakeData[]> {
		try {
			// Try multiple endpoints to ensure we get data, starting with lower magnitude thresholds
			const endpoints = [
				`${USGS_BASE_URL}/1.0_day.geojson`,
				`${USGS_BASE_URL}/2.5_day.geojson`,
				`${USGS_BASE_URL}/all_day.geojson`
			];

			let data = null;
			let lastError = null;

			// Try each endpoint until one works
			for (const url of endpoints) {
				try {
					data = await this.fetchJson(url);
					if (data && data.features && data.features.length > 0) {
						break;
					}
				} catch (error) {
					lastError = error;
					console.warn(`Failed to fetch from ${url}:`, error);
				}
			}

			if (!data || !data.features) {
				throw lastError || new Error('No earthquake data available from any endpoint');
			}

			// Process the earthquake data
			const earthquakes = data.features
				.filter((feature: any) => {
					const props = feature.properties;
					return props.mag && props.mag >= 0.5; // Even lower threshold to get more real data
				})
				.map((feature: any) => {
					const props = feature.properties;
					const coords = feature.geometry.coordinates;

					return {
						id: feature.id,
						type: 'earthquake' as const,
						title: props.title || `M${props.mag} earthquake`,
						description: props.title || `Magnitude ${props.mag} earthquake`,
						severity: this.getEarthquakeSeverity(props.mag),
						location: {
							name: props.place || 'Unknown location',
							lat: coords[1],
							lon: coords[0]
						},
						timestamp: new Date(props.time),
						source: 'USGS',
						url: props.url,
						metadata: {
							magnitude: props.mag,
							depth: coords[2] || 0,
							significance: props.sig || 0,
							tsunami_warning: props.tsunami === 1
						}
					} as EarthquakeData;
				})
				.sort((a: EarthquakeData, b: EarthquakeData) => 
					b.timestamp.getTime() - a.timestamp.getTime()
				)
				.slice(0, 30); // Limit to 30 most recent earthquakes

			return earthquakes;
		} catch (error) {
			console.error('Failed to fetch earthquake data:', error);
			return [];
		}
	}


	private static getEarthquakeSeverity(magnitude: number): 'low' | 'medium' | 'high' | 'critical' {
		if (magnitude >= 7.0) return 'critical';
		if (magnitude >= 6.0) return 'high';
		if (magnitude >= 4.5) return 'medium';
		return 'low';
	}

	static getSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
		switch (severity) {
			case 'low': return '#059669'; // Green
			case 'medium': return '#D97706'; // Amber
			case 'high': return '#DC2626'; // Red
			case 'critical': return '#991B1B'; // Dark red
			default: return '#8B7458'; // Amber brown
		}
	}

	static getDisasterTypeIcon(type: DisasterType): string {
		switch (type) {
			case 'earthquake': return '🌍';
			case 'flood': return '🌊';
			case 'hurricane': return '🌀';
			case 'tornado': return '🌪️';
			case 'wildfire': return '🔥';
			case 'tsunami': return '🌊';
			case 'volcano': return '🌋';
			case 'severe_weather': return '⛈️';
			case 'heat_wave': return '🌡️';
			case 'cold_wave': return '❄️';
			case 'drought': return '🏜️';
			default: return '⚠️';
		}
	}
}