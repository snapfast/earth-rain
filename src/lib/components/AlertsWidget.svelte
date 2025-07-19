<script lang="ts">
	import { weatherAlerts, hasActiveAlerts, isCitiesLoading, citiesError } from '../stores/weather.js';
	import { criticalEvents, recentEvents, isLoadingDisasters, disasterError } from '../stores/disaster.js';
	import { formatAlertTimeGMT } from '../utils/time.js';
	
	function getSeverityColor(severity: string): string {
		switch (severity) {
			case 'minor': return 'text-yellow-600';
			case 'moderate': return 'text-orange-600';
			case 'severe': return 'text-red-600';
			case 'extreme': return 'text-red-800';
			default: return 'text-amber-700';
		}
	}
</script>

<div class="widget">
	<div class="widget-header">
		<h2 class="widget-title">Active Alerts</h2>
		<div class="flex items-center space-x-2">
			{#if $isCitiesLoading || $isLoadingDisasters}
				<div class="status-indicator status-warning"></div>
				<span class="text-sm text-amber-600">Loading</span>
			{:else if $citiesError || $disasterError}
				<div class="status-indicator status-error"></div>
				<span class="text-sm text-red-600">Error</span>
			{:else}
				<div class="status-indicator status-online"></div>
				<span class="text-sm text-amber-700">Live</span>
			{/if}
		</div>
	</div>
	
	<div class="widget-content">
		{#if $isCitiesLoading || $isLoadingDisasters}
			<div class="text-center text-amber-700 py-8">
				<div class="loading-spinner mx-auto mb-2"></div>
				<p>Loading alerts data...</p>
			</div>
		{:else if $hasActiveAlerts || $criticalEvents.length > 0 || $recentEvents.length > 0}
			<div class="space-y-4">
				<!-- Critical Disaster Events -->
				{#if $criticalEvents.length > 0}
					<div>
						<h3 class="text-sm font-medium text-red-600 mb-2 flex items-center">
							🚨 Critical Events
						</h3>
						<div class="space-y-3">
							{#each $criticalEvents as event}
								<div class="border border-red-600 bg-red-600 bg-opacity-10 rounded-lg p-3 alert-critical">
									<div class="flex items-center justify-between mb-2">
										<span class="text-red-300 font-medium">
											{event.type.replace('_', ' ').toUpperCase()}
										</span>
										<span class="text-xs text-red-600">
											{formatAlertTimeGMT(event.timestamp)} UTC
										</span>
									</div>
									<div class="text-sm text-amber-900 mb-2">
										{event.title}
									</div>
									<div class="text-xs text-red-300">
										📍 {event.location.name}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- Weather Alerts -->
				{#if $hasActiveAlerts}
					<div>
						<h3 class="text-sm font-medium text-yellow-600 mb-2 flex items-center">
							⚠️ Weather Alerts
						</h3>
						<div class="space-y-3">
							{#each $weatherAlerts as alert}
								<div class="border border-yellow-600 bg-yellow-600 bg-opacity-10 rounded-lg p-3">
									<div class="flex items-center justify-between mb-2">
										<span class="text-yellow-300 font-medium {getSeverityColor(alert.severity)}">
											{alert.severity.toUpperCase()}
										</span>
										<span class="text-xs text-yellow-600">
											{formatAlertTimeGMT(alert.start_time)} UTC
										</span>
									</div>
									<div class="text-sm text-amber-900 mb-2">
										{alert.title}
									</div>
									<div class="text-xs text-yellow-300 mb-1">
										📍 {alert.areas.join(', ')}
									</div>
									{#if alert.end_time}
										<div class="text-xs text-yellow-400">
											Until: {formatAlertTimeGMT(alert.end_time)} UTC
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- Recent Activity -->
				{#if $recentEvents.length > 0}
					<div>
						<div class="space-y-3">
							{#each $recentEvents as event}
								<div class="border border-amber-200 rounded-lg p-3">
									<div class="flex items-center justify-between mb-2">
										<span class="text-amber-800 text-sm">
											{event.type.replace('_', ' ')}
										</span>
										<span class="text-xs text-amber-700">
											{formatAlertTimeGMT(event.timestamp)} UTC
										</span>
									</div>
									<div class="text-sm text-amber-900 mb-2">
										{event.title}
									</div>
									<div class="text-xs text-amber-700">
										📍 {event.location.name}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center text-amber-700 py-8">
				<div class="text-4xl mb-2">✅</div>
				<p>No active alerts</p>
				<p class="text-sm text-amber-600 mt-1">All systems operating normally</p>
			</div>
		{/if}
	</div>
</div>