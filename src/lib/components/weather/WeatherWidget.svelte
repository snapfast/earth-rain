<script lang="ts">
	import { citiesWeatherData, isCitiesLoading, citiesError } from '../../stores/weather.js';
	import { WeatherAPI } from '../../api/weather.js';
	import { formatShortTimeGMT } from '../../utils/time.js';
	
	function getWindDirection(degrees: number): string {
		const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
		const index = Math.round(degrees / 22.5) % 16;
		return directions[index];
	}
	
	function formatVisibility(km: number): string {
		return km >= 10 ? '10+ km' : `${km.toFixed(1)} km`;
	}
	
	function getLocalTime(cityName: string): string {
		// Simple timezone mapping for display (approximate)
		const timezones: { [key: string]: number } = {
			'New York': -5,
			'London': 0,
			'Tokyo': 9,
			'Paris': 1,
			'Sydney': 10,
			'San Francisco': -8,
			'Dubai': 4,
			'Singapore': 8
		};
		
		const offset = timezones[cityName] || 0;
		const now = new Date();
		const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
		const cityTime = new Date(utc + (offset * 3600000));
		
		return cityTime.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}
</script>

<div class="widget">
	<div class="widget-header">
		<h2 class="widget-title">🌍 Global Weather Monitor</h2>
		<div class="flex items-center space-x-2">
			{#if $isCitiesLoading}
				<div class="status-indicator status-warning"></div>
				<span class="text-sm text-amber-600">Loading</span>
			{:else if $citiesError}
				<div class="status-indicator status-error"></div>
				<span class="text-sm text-red-600">Error</span>
			{:else}
				<div class="status-indicator status-online"></div>
				<span class="text-sm text-amber-700">Live</span>
			{/if}
		</div>
	</div>
	
	<div class="widget-content">
		{#if $citiesError}
			<div class="text-center text-red-600 py-8">
				<div class="text-4xl mb-2">⚠️</div>
				<p>Weather data temporarily unavailable</p>
				<p class="text-sm text-amber-600 mt-1">Retrying...</p>
			</div>
		{:else if $citiesWeatherData.length > 0}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-amber-200">
							<th class="text-left py-2 text-amber-800 font-medium">City</th>
							<th class="text-center py-2 text-amber-800 font-medium">Time</th>
							<th class="text-center py-2 text-amber-800 font-medium">Weather</th>
							<th class="text-center py-2 text-amber-800 font-medium">Temp</th>
							<th class="text-center py-2 text-amber-800 font-medium">Feels</th>
							<th class="text-center py-2 text-amber-800 font-medium">Humidity</th>
							<th class="text-center py-2 text-amber-800 font-medium">Wind</th>
						</tr>
					</thead>
					<tbody>
						{#each $citiesWeatherData as weather}
							<tr class="border-b border-amber-100 hover:bg-amber-50 transition-colors">
								<td class="py-3">
									<div class="flex items-center space-x-2">
										<span class="text-amber-900 font-medium">{weather.location.name}</span>
										<span class="text-amber-700 text-xs">{weather.location.country}</span>
									</div>
								</td>
								<td class="text-center py-3">
									<span class="text-amber-800 font-mono text-xs">
										{getLocalTime(weather.location.name)}
									</span>
								</td>
								<td class="text-center py-3">
									<div class="flex items-center justify-center space-x-1">
										<span class="text-lg">{weather.current.icon}</span>
										<div class="text-xs text-amber-800 capitalize">
											{weather.current.weather_description}
										</div>
									</div>
								</td>
								<td class="text-center py-3">
									<span class="text-amber-900 font-medium">
										{weather.current.temperature}°C
									</span>
								</td>
								<td class="text-center py-3">
									<span class="text-amber-800">
										{weather.current.feels_like}°C
									</span>
								</td>
								<td class="text-center py-3">
									<span class="text-amber-800">
										{weather.current.humidity}%
									</span>
								</td>
								<td class="text-center py-3">
									<div class="text-xs">
										<div class="text-amber-800">
											{weather.current.wind_speed} m/s
										</div>
										<div class="text-amber-700">
											{getWindDirection(weather.current.wind_direction)}
										</div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			
			<!-- Last updated info -->
			{#if $citiesWeatherData.length > 0}
				<div class="mt-4 pt-4 border-t border-amber-200">
					<div class="text-xs text-amber-700 text-center">
						Last updated: {formatShortTimeGMT($citiesWeatherData[0].last_updated)} UTC
					</div>
				</div>
			{/if}
		{:else}
			<div class="text-center text-amber-700 py-8">
				<div class="loading-spinner mx-auto mb-2"></div>
				<p>Loading weather data...</p>
			</div>
		{/if}
	</div>
</div>