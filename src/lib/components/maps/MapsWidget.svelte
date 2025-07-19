<script lang="ts">
	import { currentLocation } from '../../stores/weather.js';
	import { disasterEvents } from '../../stores/disaster.js';
	import { DisasterAPI } from '../../api/disaster.js';
	
	// For this MVP, we'll show a static map placeholder
	// In a full implementation, this would integrate with Leaflet, Mapbox, or Google Maps
	
	// Make map URL reactive to location changes
	$: mapUrl = $currentLocation ? 
		`https://www.openstreetmap.org/export/embed.html?bbox=${$currentLocation.lon-2},${$currentLocation.lat-2},${$currentLocation.lon+2},${$currentLocation.lat+2}&layer=mapnik&marker=${$currentLocation.lat},${$currentLocation.lon}` 
		: '';
	
	// Calculate distance between two coordinates using Haversine formula
	function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371; // Earth's radius in kilometers
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c; // Distance in kilometers
	}

	$: nearbyEvents = $currentLocation ? 
		$disasterEvents
			.map(event => ({
				...event,
				distance: calculateDistance(
					$currentLocation.lat, 
					$currentLocation.lon, 
					event.location.lat, 
					event.location.lon
				)
			}))
			.filter(event => event.distance <= 2000) // Within 2000km
			.sort((a, b) => a.distance - b.distance) // Sort by distance (closest first)
			.slice(0, 5) // Show top 5 closest events
		: [];
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
				{#if $currentLocation && mapUrl}
					<iframe
						src={mapUrl}
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
					<h3 class="text-sm font-medium text-amber-800 mb-2">
						Events near {$currentLocation?.name || 'Selected City'}
					</h3>
					<div class="space-y-2 max-h-32 overflow-y-auto">
						{#each nearbyEvents as event}
							<div class="flex items-center justify-between text-xs">
								<div class="flex items-center space-x-2 flex-1 min-w-0">
									<span>{DisasterAPI.getDisasterTypeIcon(event.type)}</span>
									<div class="flex flex-col min-w-0">
										<span class="text-amber-800 truncate">
											{event.location.name}
										</span>
										<span class="text-amber-600 text-xs">
											{Math.round(event.distance)}km away
										</span>
									</div>
								</div>
								<div class="flex items-center space-x-1 flex-shrink-0">
									{#if event.type === 'earthquake' && event.metadata}
										<span class="text-amber-900 text-xs">M{event.metadata.magnitude}</span>
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
						<p>No events within 2000km</p>
						<p class="text-xs text-amber-600 mt-1">
							of {$currentLocation?.name || 'selected city'}
						</p>
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