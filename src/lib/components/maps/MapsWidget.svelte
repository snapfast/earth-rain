<script lang="ts">
	import { currentLocation } from '../../stores/weather.js';
	import { disasterEvents, selectedDisaster } from '../../stores/disaster.js';
	import { DisasterAPI } from '../../api/disaster.js';
	
	// For this MVP, we'll show a static map placeholder
	// In a full implementation, this would integrate with Leaflet, Mapbox, or Google Maps
	
	// Determine map location: prioritize selected disaster, fallback to current location
	$: mapLocation = $selectedDisaster?.location || $currentLocation;
	
	// Generate map URL with appropriate zoom level
	$: mapUrl = mapLocation ? generateMapUrl(mapLocation, $selectedDisaster) : '';
	
	function generateMapUrl(location: any, selectedDisaster: any): string {
		// Use closer zoom for disasters, wider zoom for general weather locations
		const zoom = selectedDisaster ? 0.5 : 2;
		return `https://www.openstreetmap.org/export/embed.html?bbox=${location.lon-zoom},${location.lat-zoom},${location.lon+zoom},${location.lat+zoom}&layer=mapnik&marker=${location.lat},${location.lon}`;
	}
	
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

	$: nearbyEvents = mapLocation ? 
		$disasterEvents
			.map(event => ({
				...event,
				distance: calculateDistance(
					mapLocation.lat, 
					mapLocation.lon, 
					event.location.lat, 
					event.location.lon
				),
				isSelected: $selectedDisaster?.id === event.id
			}))
			.filter(event => $selectedDisaster ? true : event.distance <= 2000) // Show all when disaster selected, filter by distance otherwise
			.sort((a, b) => {
				// Selected disaster first, then by distance
				if (a.isSelected) return -1;
				if (b.isSelected) return 1;
				return a.distance - b.distance;
			})
			.slice(0, $selectedDisaster ? 8 : 5) // Show more events when disaster selected
		: [];
</script>

<div class="widget">
	<div class="widget-header">
		<h2 class="widget-title">
			{#if $selectedDisaster}
				🗺️ {$selectedDisaster.location.name}
			{:else}
				🗺️ Regional Overview Map
			{/if}
		</h2>
		<div class="flex items-center space-x-2">
			{#if $selectedDisaster}
				<span class="text-xs px-2 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800">
					{DisasterAPI.getDisasterTypeIcon($selectedDisaster.type)} {$selectedDisaster.type.replace('_', ' ')}
				</span>
			{/if}
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
						{#if $selectedDisaster}
							Events near {$selectedDisaster.location.name}
						{:else}
							Events near {$currentLocation?.name || 'Selected City'}
						{/if}
					</h3>
					<div class="space-y-2 max-h-32 overflow-y-auto">
						{#each nearbyEvents as event}
							<div class="flex items-center justify-between text-xs {event.isSelected ? 'bg-amber-100 border border-amber-300 rounded px-2 py-1' : ''}">
								<div class="flex items-center space-x-2 flex-1 min-w-0">
									<span>{DisasterAPI.getDisasterTypeIcon(event.type)}</span>
									<div class="flex flex-col min-w-0">
										<span class="text-amber-800 truncate {event.isSelected ? 'font-medium' : ''}">
											{event.isSelected ? '📍 ' : ''}{event.location.name}
										</span>
										<span class="text-amber-600 text-xs">
											{event.isSelected ? 'Selected disaster' : `${Math.round(event.distance)}km away`}
										</span>
									</div>
								</div>
								<div class="flex items-center space-x-1 flex-shrink-0">
									{#if event.type === 'earthquake' && event.metadata}
										<span class="text-amber-900 text-xs">M{event.metadata.magnitude}</span>
									{/if}
									<span class="text-xs" style="color: {DisasterAPI.getSeverityColor(event.severity)}">
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
						{#if $selectedDisaster}
							<p>No other events in area</p>
							<p class="text-xs text-amber-600 mt-1">
								around {$selectedDisaster.location.name}
							</p>
						{:else}
							<p>No events within 2000km</p>
							<p class="text-xs text-amber-600 mt-1">
								of {$currentLocation?.name || 'selected city'}
							</p>
						{/if}
					</div>
				</div>
			{/if}
			
			{#if $selectedDisaster}
				<!-- Disaster coordinates -->
				<div class="border-t border-amber-200 pt-4">
					<h4 class="text-xs font-medium text-amber-700 mb-2">Location Details</h4>
					<div class="text-xs text-amber-600 space-y-1">
						<div class="font-mono">
							📍 {$selectedDisaster.location.lat.toFixed(4)}°, {$selectedDisaster.location.lon.toFixed(4)}°
						</div>
						{#if $selectedDisaster.type === 'earthquake' && $selectedDisaster.metadata}
							<div>🌍 Magnitude {$selectedDisaster.metadata.magnitude} • Depth {$selectedDisaster.metadata.depth.toFixed(1)}km</div>
						{/if}
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