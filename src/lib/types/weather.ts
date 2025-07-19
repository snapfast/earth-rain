export interface WeatherData {
	location: {
		name: string;
		country: string;
		lat: number;
		lon: number;
	};
	current: {
		temperature: number;
		feels_like: number;
		humidity: number;
		pressure: number;
		visibility: number;
		wind_speed: number;
		wind_direction: number;
		weather_code: number;
		weather_description: string;
		icon: string;
	};
	forecast: WeatherForecast[];
	alerts?: WeatherAlert[];
	last_updated: Date;
}

export interface WeatherForecast {
	date: Date;
	temperature_min: number;
	temperature_max: number;
	weather_code: number;
	weather_description: string;
	icon: string;
	precipitation_probability: number;
	wind_speed: number;
}

export interface WeatherAlert {
	id: string;
	title: string;
	description: string;
	severity: 'minor' | 'moderate' | 'severe' | 'extreme';
	areas: string[];
	start_time: Date;
	end_time: Date;
	source: string;
}

export interface LocationData {
	name: string;
	country: string;
	state?: string;
	lat: number;
	lon: number;
}