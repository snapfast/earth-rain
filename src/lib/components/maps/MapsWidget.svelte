<script lang="ts">
	import { currentLocation } from '../../stores/weather.js';
	import { disasterEvents } from '../../stores/disaster.js';
	import { DisasterAPI } from '../../api/disaster.js';
	
	// For this MVP, we'll show a static map placeholder
	// In a full implementation, this would integrate with Leaflet, Mapbox, or Google Maps
	
	function getMapUrl(): string {
		if ($currentLocation) {
			const { lat, lon } = $currentLocation;
			// Using OpenStreetMap static map service as example
			return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-2},${lat-2},${lon+2},${lat+2}&layer=mapnik&marker=${lat},${lon}`;
		}
		return '';
	}
	
	$: nearbyEvents = $disasterEvents.filter(event => {
		if (!$currentLocation) return false;
		// Simple distance calculation (not precise, but good for demo)
		const latDiff = Math.abs(event.location.lat - $currentLocation.lat);
		const lonDiff = Math.abs(event.location.lon - $currentLocation.lon);
		return latDiff < 10 && lonDiff < 10; // Within ~1000km
	}).slice(0, 5);
</script>

<div class="widget">
	<div class="widget-header">
		<h2 class="widget-title">Regional Map</h2>
		<div class="flex items-center space-x-2">
			<div class="status-indicator status-online"></div>
			<span class="text-sm text-amber-700">Live</span>
		</div>
	</div>
	
	<div class="widget-content">
		<div class="h-full flex flex-col space-y-4">
			<!-- Map placeholder -->
			<div class="flex-1 bg-amber-50 rounded-lg border border-amber-200 relative overflow-hidden">
				{#if $currentLocation}
					<iframe
						src={getMapUrl()}
						class="w-full h-full"
						style="border: none;"
						title="Regional Map"
						loading="lazy"
					></iframe>
				{:else}
					<div class="flex items-center justify-center h-full text-amber-700">
						<div class="text-center">
							<div class="text-4xl mb-2">🗺️</div>
							<p>Loading map...</p>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Nearby events list -->
			{#if nearbyEvents.length > 0}
				<div class="border-t border-amber-200 pt-4">
					<h3 class="text-sm font-medium text-amber-800 mb-2">Nearby Events</h3>
					<div class="space-y-2 max-h-32 overflow-y-auto">
						{#each nearbyEvents as event}
							<div class="flex items-center justify-between text-xs">
								<div class="flex items-center space-x-2">
									<span>{DisasterAPI.getDisasterTypeIcon(event.type)}</span>
									<span class="text-amber-800">
										{event.location.name}
									</span>
								</div>
								<div class="flex items-center space-x-2">
									{#if event.type === 'earthquake' && event.metadata}
										<span class="text-amber-900">M{event.metadata.magnitude}</span>
									{/if}
									<span class="text-{DisasterAPI.getSeverityColor(event.severity)} text-xs">
										{event.severity}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="border-t border-amber-200 pt-4">
					<div class="text-center text-amber-700 text-sm">
						<div class="text-2xl mb-1">📍</div>
						<p>No nearby events</p>
					</div>
				</div>
			{/if}
			
			<!-- Map legend -->
			<div class="border-t border-amber-200 pt-4">
				<h4 class="text-xs font-medium text-amber-700 mb-2">Legend</h4>
				<div class="grid grid-cols-2 gap-2 text-xs">
					<div class="flex items-center space-x-1">
						<div class="w-2 h-2 bg-green-600 rounded-full"></div>
						<span class="text-amber-700">Low</span>
					</div>
					<div class="flex items-center space-x-1">
						<div class="w-2 h-2 bg-yellow-600 rounded-full"></div>
						<span class="text-amber-700">Medium</span>
					</div>
					<div class="flex items-center space-x-1">
						<div class="w-2 h-2 bg-red-600 rounded-full"></div>
						<span class="text-amber-700">High</span>
					</div>
					<div class="flex items-center space-x-1">
						<div class="w-2 h-2 bg-red-800 rounded-full"></div>
						<span class="text-amber-700">Critical</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>