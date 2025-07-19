export interface DisasterEvent {
	id: string;
	type: DisasterType;
	title: string;
	description: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
	location: {
		name: string;
		lat: number;
		lon: number;
		region?: string;
	};
	timestamp: Date;
	source: string;
	url?: string;
	metadata?: Record<string, any>;
}

export type DisasterType = 
	| 'earthquake'
	| 'flood'
	| 'hurricane'
	| 'tornado'
	| 'wildfire'
	| 'tsunami'
	| 'volcano'
	| 'severe_weather'
	| 'heat_wave'
	| 'cold_wave'
	| 'drought'
	| 'other';

export interface EarthquakeData extends DisasterEvent {
	type: 'earthquake';
	metadata: {
		magnitude: number;
		depth: number;
		significance: number;
		tsunami_warning: boolean;
	};
}

export interface FloodAlert extends DisasterEvent {
	type: 'flood';
	metadata: {
		water_level: number;
		flood_stage: number;
		forecast_peak?: number;
		affected_areas: string[];
	};
}

export interface SevereWeatherAlert extends DisasterEvent {
	type: 'severe_weather';
	metadata: {
		wind_speed?: number;
		hail_size?: number;
		tornado_warning: boolean;
		flash_flood_warning: boolean;
	};
}