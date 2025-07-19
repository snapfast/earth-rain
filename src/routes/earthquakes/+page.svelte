<script lang="ts">
	import { onMount } from 'svelte';
	import { DisasterAPI } from '../../lib/api/disaster.js';
	import { formatAlertTimeGMT } from '../../lib/utils/time.js';
	import type { EarthquakeData } from '../../lib/types/disaster.js';

	let earthquakes: EarthquakeData[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadEarthquakes();
		// Refresh every 5 minutes
		const interval = setInterval(loadEarthquakes, 300000);
		return () => clearInterval(interval);
	});

	async function loadEarthquakes() {
		try {
			isLoading = true;
			error = null;
			earthquakes = await DisasterAPI.getRecentEarthquakes();
		} catch (err) {
			error = 'Failed to load earthquake data';
			console.error('Failed to load earthquakes:', err);
		} finally {
			isLoading = false;
		}
	}

	function getSeverityClass(severity: string): string {
		switch (severity) {
			case 'low': return 'bg-green-100 text-green-800 border-green-200';
			case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
			case 'critical': return 'bg-red-100 text-red-800 border-red-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function formatTimestamp(date: Date): string {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);
		
		if (diffMins < 60) {
			return `${diffMins}m ago`;
		} else if (diffHours < 24) {
			return `${diffHours}h ago`;
		} else {
			return `${diffDays}d ago`;
		}
	}
</script>

<svelte:head>
	<title>Recent Earthquakes - Earth Rain</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-3 mb-4">
				<span class="text-4xl">🌍</span>
				<div>
					<h1 class="text-3xl font-bold text-amber-900">Recent Earthquakes</h1>
					<p class="text-amber-700">Real-time earthquake data from USGS</p>
				</div>
			</div>
			
			<div class="flex items-center space-x-4 text-sm text-amber-600">
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full"></div>
					<span>Magnitude 1.0-4.4 (Low)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<span>Magnitude 4.5-5.9 (Medium)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
					<span>Magnitude 6.0-6.9 (High)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full"></div>
					<span>Magnitude 7.0+ (Critical)</span>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="text-center py-12">
				<div class="loading-spinner mx-auto mb-4"></div>
				<p class="text-amber-700">Loading earthquake data...</p>
			</div>
		{:else if error}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">⚠️</div>
				<p class="text-red-600 font-medium">{error}</p>
				<button 
					on:click={loadEarthquakes}
					class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
				>
					Retry
				</button>
			</div>
		{:else if earthquakes.length === 0}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">✅</div>
				<p class="text-amber-700">No recent earthquakes reported</p>
				<p class="text-sm text-amber-600 mt-1">All systems normal</p>
			</div>
		{:else}
			<!-- Earthquake Grid -->
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each earthquakes as earthquake}
					<div class="bg-white rounded-lg shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-shadow">
						<!-- Header -->
						<div class="flex items-start justify-between mb-4">
							<div class="flex items-center space-x-2">
								<span class="text-2xl">🌍</span>
								<div>
									<span class="inline-block px-2 py-1 rounded-full text-xs font-medium border {getSeverityClass(earthquake.severity)}">
										{earthquake.severity.toUpperCase()}
									</span>
								</div>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-amber-900">
									M{earthquake.metadata.magnitude}
								</div>
								<div class="text-xs text-amber-600">
									{formatTimestamp(earthquake.timestamp)}
								</div>
							</div>
						</div>

						<!-- Title -->
						<h3 class="font-semibold text-amber-900 mb-2 line-clamp-2">
							{earthquake.title}
						</h3>

						<!-- Location -->
						<div class="flex items-center space-x-2 mb-3 text-amber-700">
							<span class="text-sm">📍</span>
							<span class="text-sm">{earthquake.location.name}</span>
						</div>

						<!-- Details -->
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-amber-600">Depth:</span>
								<span class="text-amber-800 font-medium">{earthquake.metadata.depth.toFixed(2)} km</span>
							</div>
							<div class="flex justify-between">
								<span class="text-amber-600">Significance:</span>
								<span class="text-amber-800 font-medium">{earthquake.metadata.significance}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-amber-600">Time:</span>
								<span class="text-amber-800 font-medium">{formatAlertTimeGMT(earthquake.timestamp)} UTC</span>
							</div>
							{#if earthquake.metadata.tsunami_warning}
								<div class="flex items-center space-x-2 text-red-600 font-medium">
									<span>🌊</span>
									<span>Tsunami Warning</span>
								</div>
							{/if}
						</div>

						<!-- Source -->
						<div class="mt-4 pt-4 border-t border-amber-100">
							<div class="flex items-center justify-between">
								<span class="text-xs text-amber-600">Source: {earthquake.source}</span>
								{#if earthquake.url}
									<a 
										href={earthquake.url} 
										target="_blank" 
										rel="noopener noreferrer"
										class="text-xs text-amber-600 hover:text-amber-800 underline"
									>
										More details →
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Stats Summary -->
			<div class="mt-8 bg-white rounded-lg shadow-lg border border-amber-200 p-6">
				<h2 class="text-xl font-semibold text-amber-900 mb-4">Summary Statistics</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">{earthquakes.length}</div>
						<div class="text-sm text-amber-600">Total Events</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">
							{Math.max(...earthquakes.map(e => e.metadata.magnitude)).toFixed(1)}
						</div>
						<div class="text-sm text-amber-600">Highest Magnitude</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">
							{earthquakes.filter(e => e.severity === 'critical' || e.severity === 'high').length}
						</div>
						<div class="text-sm text-amber-600">Major Events</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">
							{earthquakes.filter(e => e.metadata.tsunami_warning).length}
						</div>
						<div class="text-sm text-amber-600">Tsunami Warnings</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.loading-spinner {
		display: inline-block;
		width: 32px;
		height: 32px;
		border: 3px solid rgba(139, 116, 88, 0.3);
		border-radius: 50%;
		border-top-color: #8b7458;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>