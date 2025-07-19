<script lang="ts">
	import { disasterEvents, isLoadingDisasters, disasterError } from '../../stores/disaster.js';
	import { DisasterAPI } from '../../api/disaster.js';
	import { formatAlertTimeWithRelative } from '../../utils/time.js';
	import type { DisasterEvent } from '../../types/disaster.js';
	
	function getSeverityClass(severity: string): string {
		return `severity-${severity}`;
	}
	
	function formatLocation(event: DisasterEvent): string {
		return event.location.region ? 
			`${event.location.name}, ${event.location.region}` : 
			event.location.name;
	}
</script>

<div class="widget">
	<div class="widget-header">
		<h2 class="widget-title">Disaster Alerts</h2>
		<div class="flex items-center space-x-2">
			{#if $isLoadingDisasters}
				<div class="status-indicator status-warning"></div>
				<span class="text-sm text-amber-600">Loading</span>
			{:else if $disasterError}
				<div class="status-indicator status-error"></div>
				<span class="text-sm text-red-600">Error</span>
			{:else}
				<div class="status-indicator status-online"></div>
				<span class="text-sm text-amber-700">USGS</span>
			{/if}
		</div>
	</div>
	
	<div class="widget-content">
		{#if $disasterError}
			<div class="text-center text-red-400 py-8">
				<div class="text-4xl mb-2">⚠️</div>
				<p>Failed to load disaster data</p>
				<p class="text-sm text-amber-600 mt-1">{$disasterError}</p>
			</div>
		{:else if $disasterEvents.length > 0}
			<div class="space-y-3">
				{#each $disasterEvents as event}
					<div class="border border-amber-200 rounded-lg p-3 hover:border-amber-300 transition-colors">
						<div class="flex items-start justify-between mb-2">
							<div class="flex items-center space-x-2">
								<span class="text-lg">{DisasterAPI.getDisasterTypeIcon(event.type)}</span>
								<span class="text-sm font-medium text-amber-900 capitalize">
									{event.type.replace('_', ' ')}
								</span>
								<span class="text-xs px-2 py-1 rounded-full {getSeverityClass(event.severity)} bg-opacity-20">
									{event.severity.toUpperCase()}
								</span>
							</div>
							<span class="text-xs text-amber-700">
								{formatAlertTimeWithRelative(event.timestamp)}
							</span>
						</div>
						
						<div class="text-sm text-amber-800 mb-1">
							{event.title}
						</div>
						
						<div class="text-xs text-amber-700">
							📍 {formatLocation(event)}
						</div>
						
						{#if event.type === 'earthquake' && event.metadata}
							<div class="text-xs text-amber-600 mt-1">
								Magnitude: {event.metadata.magnitude} • 
								Depth: {event.metadata.depth}km
								{#if event.metadata.tsunami_warning}
									• <span class="text-red-400">Tsunami Warning</span>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center text-amber-700 py-8">
				{#if $isLoadingDisasters}
					<div class="loading-spinner mx-auto mb-2"></div>
					<p>Loading disaster data...</p>
				{:else}
					<div class="text-4xl mb-2">✅</div>
					<p>No recent disasters reported</p>
					<p class="text-sm text-amber-600 mt-1">All systems normal</p>
				{/if}
			</div>
		{/if}
	</div>
</div>