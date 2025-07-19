<script lang="ts">
	import { selectedDisaster, clearDisasterSelection } from '../stores/disaster.js';
	import { formatAlertTimeWithRelative } from '../utils/time.js';
	import { DisasterAPI } from '../api/disaster.js';

	function getSeverityColor(severity: string): string {
		switch (severity) {
			case 'low': return 'text-green-600 bg-green-100 border-green-200';
			case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
			case 'high': return 'text-red-600 bg-red-100 border-red-200';
			case 'critical': return 'text-red-800 bg-red-200 border-red-300';
			default: return 'text-amber-600 bg-amber-100 border-amber-200';
		}
	}

	function formatCoordinates(lat: number, lon: number): string {
		const latDir = lat >= 0 ? 'N' : 'S';
		const lonDir = lon >= 0 ? 'E' : 'W';
		return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
	}
</script>

<div class="widget" data-testid="disaster-details-widget">
	<div class="widget-header">
		<h2 class="widget-title">🔍 Disaster Details</h2>
		<div class="flex items-center space-x-3">
			{#if $selectedDisaster}
				<button 
					on:click={clearDisasterSelection}
					class="text-xs text-amber-600 hover:text-amber-800 transition-colors"
					title="Clear selection"
				>
					✕ Clear
				</button>
			{/if}
		</div>
	</div>
	
	<div class="widget-content">
		{#if $selectedDisaster}
			<div class="space-y-3">
				<!-- Header Section -->
				<div class="border-b border-amber-200 pb-3">
					<div class="flex items-center space-x-3 mb-2">
						<span class="text-2xl">{DisasterAPI.getDisasterTypeIcon($selectedDisaster.type)}</span>
						<div class="flex-1">
							<h3 class="font-semibold text-amber-900 text-lg leading-tight">{$selectedDisaster.title}</h3>
							<div class="flex items-center space-x-2 mt-1">
								<span class="text-xs px-2 py-1 rounded-full border {getSeverityColor($selectedDisaster.severity)}">
									{$selectedDisaster.severity.toUpperCase()}
								</span>
								<span class="text-xs text-amber-700 capitalize">
									{$selectedDisaster.type.replace('_', ' ')}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Main Information Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					<!-- Description -->
					<div class="md:col-span-2 lg:col-span-3">
						<h4 class="text-sm font-medium text-amber-800 mb-2">Description</h4>
						<p class="text-sm text-amber-700">{$selectedDisaster.description}</p>
					</div>

					<!-- Location Information -->
					<div>
						<h4 class="text-sm font-medium text-amber-800 mb-2">Location</h4>
						<div class="space-y-1 text-sm text-amber-700">
							<div>📍 {$selectedDisaster.location.name}</div>
							{#if $selectedDisaster.location.region}
								<div>🗺️ {$selectedDisaster.location.region}</div>
							{/if}
							<div class="font-mono text-xs">
								🌐 {formatCoordinates($selectedDisaster.location.lat, $selectedDisaster.location.lon)}
							</div>
						</div>
					</div>

					<!-- Time Information -->
					<div>
						<h4 class="text-sm font-medium text-amber-800 mb-2">Timing</h4>
						<div class="space-y-1 text-sm text-amber-700">
							<div>🕒 {formatAlertTimeWithRelative($selectedDisaster.timestamp)}</div>
							<div class="text-xs text-amber-600">
								Full time: {$selectedDisaster.timestamp.toLocaleString('en-US', { timeZone: 'UTC' })} UTC
							</div>
						</div>
					</div>

					<!-- Source Information -->
					<div>
						<h4 class="text-sm font-medium text-amber-800 mb-2">Data Source</h4>
						<div class="space-y-2">
							<div class="text-sm text-amber-700">
								<span class="font-medium">Source:</span> {$selectedDisaster.source}
							</div>
							{#if $selectedDisaster.url}
								<a 
									href={$selectedDisaster.url} 
									target="_blank" 
									rel="noopener noreferrer"
									class="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
								>
									<span>🔗 View Source</span>
									<span class="text-xs">↗</span>
								</a>
							{/if}
						</div>
					</div>
				</div>

				<!-- Type-specific Details -->
				{#if $selectedDisaster.type === 'earthquake' && $selectedDisaster.metadata}
					{@const earthquake = $selectedDisaster}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<div class="md:col-span-2 lg:col-span-4">
							<h4 class="text-sm font-medium text-amber-800 mb-2">Earthquake Details</h4>
						</div>
						{#if earthquake.metadata?.magnitude !== undefined}
							<div class="bg-amber-50 rounded-lg p-3 border border-amber-200">
								<div class="text-xs text-amber-600 mb-1">Magnitude</div>
								<div class="text-lg font-semibold text-amber-900">{earthquake.metadata.magnitude}</div>
							</div>
						{/if}
						{#if earthquake.metadata?.depth !== undefined}
							<div class="bg-amber-50 rounded-lg p-3 border border-amber-200">
								<div class="text-xs text-amber-600 mb-1">Depth</div>
								<div class="text-lg font-semibold text-amber-900">{earthquake.metadata.depth.toFixed(1)} km</div>
							</div>
						{/if}
						{#if earthquake.metadata?.significance !== undefined}
							<div class="bg-amber-50 rounded-lg p-3 border border-amber-200">
								<div class="text-xs text-amber-600 mb-1">Significance</div>
								<div class="text-lg font-semibold text-amber-900">{earthquake.metadata.significance}</div>
							</div>
						{/if}
						{#if earthquake.metadata?.tsunami_warning !== undefined}
							<div class="bg-amber-50 rounded-lg p-3 border border-amber-200">
								<div class="text-xs text-amber-600 mb-1">Tsunami Warning</div>
								<div class="text-lg font-semibold {earthquake.metadata.tsunami_warning ? 'text-red-600' : 'text-green-600'}">
									{earthquake.metadata.tsunami_warning ? 'YES' : 'No'}
								</div>
							</div>
						{/if}
					</div>
				{/if}

				{#if $selectedDisaster.type === 'flood' && $selectedDisaster.metadata}
					{@const flood = $selectedDisaster}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						<div class="md:col-span-2 lg:col-span-3">
							<h4 class="text-sm font-medium text-amber-800 mb-2">Flood Details</h4>
						</div>
						{#if flood.metadata?.water_level !== undefined}
							<div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
								<div class="text-xs text-blue-600 mb-1">Water Level</div>
								<div class="text-lg font-semibold text-blue-900">{flood.metadata.water_level} ft</div>
							</div>
						{/if}
						{#if flood.metadata?.flood_stage !== undefined}
							<div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
								<div class="text-xs text-blue-600 mb-1">Flood Stage</div>
								<div class="text-lg font-semibold text-blue-900">{flood.metadata.flood_stage} ft</div>
							</div>
						{/if}
						{#if flood.metadata?.forecast_peak}
							<div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
								<div class="text-xs text-blue-600 mb-1">Forecast Peak</div>
								<div class="text-lg font-semibold text-blue-900">{flood.metadata.forecast_peak} ft</div>
							</div>
						{/if}
						{#if flood.metadata?.affected_areas && flood.metadata.affected_areas.length > 0}
							<div class="md:col-span-2 lg:col-span-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
								<div class="text-xs text-blue-600 mb-1">Affected Areas</div>
								<div class="text-sm font-medium text-blue-900">{flood.metadata.affected_areas.join(', ')}</div>
							</div>
						{/if}
					</div>
				{/if}

				{#if $selectedDisaster.type === 'severe_weather' && $selectedDisaster.metadata}
					{@const weather = $selectedDisaster}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<div class="md:col-span-2 lg:col-span-4">
							<h4 class="text-sm font-medium text-amber-800 mb-2">Weather Details</h4>
						</div>
						{#if weather.metadata?.wind_speed}
							<div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
								<div class="text-xs text-purple-600 mb-1">Wind Speed</div>
								<div class="text-lg font-semibold text-purple-900">{weather.metadata.wind_speed} mph</div>
							</div>
						{/if}
						{#if weather.metadata?.hail_size}
							<div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
								<div class="text-xs text-purple-600 mb-1">Hail Size</div>
								<div class="text-lg font-semibold text-purple-900">{weather.metadata.hail_size}"</div>
							</div>
						{/if}
						{#if weather.metadata?.tornado_warning !== undefined}
							<div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
								<div class="text-xs text-purple-600 mb-1">Tornado Warning</div>
								<div class="text-lg font-semibold {weather.metadata.tornado_warning ? 'text-red-600' : 'text-green-600'}">
									{weather.metadata.tornado_warning ? 'YES' : 'No'}
								</div>
							</div>
						{/if}
						{#if weather.metadata?.flash_flood_warning !== undefined}
							<div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
								<div class="text-xs text-purple-600 mb-1">Flash Flood Warning</div>
								<div class="text-lg font-semibold {weather.metadata.flash_flood_warning ? 'text-red-600' : 'text-green-600'}">
									{weather.metadata.flash_flood_warning ? 'YES' : 'No'}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center text-amber-700 py-8">
				<div class="text-4xl mb-4">🔍</div>
				<h3 class="text-lg font-medium mb-2">No Disaster Selected</h3>
				<p class="text-sm text-amber-600">
					Click on any disaster from the Disaster Monitoring panel to view detailed information here.
				</p>
			</div>
		{/if}
	</div>
</div>