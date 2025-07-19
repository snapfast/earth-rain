<script lang="ts">
	import { onMount } from 'svelte';
	import { DisasterAPI } from '../../lib/api/disaster.js';
	import { formatAlertTimeGMT } from '../../lib/utils/time.js';
	import type { DisasterEvent } from '../../lib/types/disaster.js';

	let wildfires: DisasterEvent[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadWildfires();
		// Refresh every 5 minutes
		const interval = setInterval(loadWildfires, 300000);
		return () => clearInterval(interval);
	});

	async function loadWildfires() {
		try {
			isLoading = true;
			error = null;
			const allDisasters = await DisasterAPI.getRecentDisasters();
			wildfires = allDisasters.filter(d => d.type === 'wildfire');
		} catch (err) {
			error = 'Failed to load wildfire data';
			console.error('Failed to load wildfires:', err);
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

	function getSeverityDescription(severity: string): string {
		switch (severity) {
			case 'low': return 'Contained or small area';
			case 'medium': return 'Active suppression needed';
			case 'high': return 'Threatens structures';
			case 'critical': return 'Immediate evacuation';
			default: return 'Status unknown';
		}
	}
</script>

<svelte:head>
	<title>Active Wildfires - Earth Rain</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-3 mb-4">
				<span class="text-4xl">🔥</span>
				<div>
					<h1 class="text-3xl font-bold text-amber-900">Active Wildfires</h1>
					<p class="text-amber-700">Current wildfire incidents and fire conditions</p>
				</div>
			</div>
			
			<div class="flex items-center space-x-4 text-sm text-amber-600">
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full"></div>
					<span>Contained</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<span>Active Suppression</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
					<span>Threatens Structures</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full"></div>
					<span>Evacuation Zone</span>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="text-center py-12">
				<div class="loading-spinner mx-auto mb-4"></div>
				<p class="text-amber-700">Loading wildfire data...</p>
			</div>
		{:else if error}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">⚠️</div>
				<p class="text-red-600 font-medium">{error}</p>
				<button 
					on:click={loadWildfires}
					class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
				>
					Retry
				</button>
			</div>
		{:else if wildfires.length === 0}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">✅</div>
				<p class="text-amber-700">No active wildfires reported</p>
				<p class="text-sm text-amber-600 mt-1">Fire conditions normal</p>
			</div>
		{:else}
			<!-- Wildfire Grid -->
			<div class="space-y-6">
				{#each wildfires as wildfire}
					<div class="bg-white rounded-lg shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-shadow">
						<div class="grid md:grid-cols-3 gap-6">
							<!-- Main Info -->
							<div class="md:col-span-2">
								<div class="flex items-start justify-between mb-4">
									<div class="flex items-center space-x-3">
										<span class="text-3xl">🔥</span>
										<div>
											<h3 class="text-xl font-semibold text-amber-900 mb-1">
												{wildfire.title}
											</h3>
											<div class="flex items-center space-x-2">
												<span class="inline-block px-3 py-1 rounded-full text-sm font-medium border {getSeverityClass(wildfire.severity)}">
													{wildfire.severity.toUpperCase()}
												</span>
												<span class="text-sm text-amber-600">
													{getSeverityDescription(wildfire.severity)}
												</span>
											</div>
										</div>
									</div>
									<div class="text-right">
										<div class="text-sm text-amber-600">
											{formatTimestamp(wildfire.timestamp)}
										</div>
									</div>
								</div>

								<!-- Description -->
								<p class="text-amber-700 mb-4">{wildfire.description}</p>

								<!-- Location -->
								<div class="flex items-center space-x-2 mb-4 text-amber-700">
									<span>📍</span>
									<span class="font-medium">{wildfire.location.name}</span>
								</div>

								<!-- Details -->
								<div class="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span class="text-amber-600">Status:</span>
										<span class="text-amber-800 font-medium ml-2">{wildfire.severity}</span>
									</div>
									<div>
										<span class="text-amber-600">Source:</span>
										<span class="text-amber-800 font-medium ml-2">{wildfire.source}</span>
									</div>
									<div>
										<span class="text-amber-600">Reported:</span>
										<span class="text-amber-800 font-medium ml-2">{formatAlertTimeGMT(wildfire.timestamp)} UTC</span>
									</div>
									<div>
										<span class="text-amber-600">Coordinates:</span>
										<span class="text-amber-800 font-medium ml-2">{wildfire.location.lat.toFixed(4)}, {wildfire.location.lon.toFixed(4)}</span>
									</div>
								</div>
							</div>

							<!-- Action Panel -->
							<div class="bg-amber-50 rounded-lg p-4">
								<h4 class="font-semibold text-amber-900 mb-3">Fire Information</h4>
								
								<div class="space-y-3 text-sm">
									<div class="flex items-center space-x-2">
										<span class="text-amber-600">🌡️</span>
										<span class="text-amber-800">High fire danger conditions</span>
									</div>
									<div class="flex items-center space-x-2">
										<span class="text-amber-600">💨</span>
										<span class="text-amber-800">Variable wind patterns</span>
									</div>
									<div class="flex items-center space-x-2">
										<span class="text-amber-600">🚁</span>
										<span class="text-amber-800">Air support deployed</span>
									</div>
									<div class="flex items-center space-x-2">
										<span class="text-amber-600">👥</span>
										<span class="text-amber-800">Ground crews active</span>
									</div>
								</div>

								{#if wildfire.url}
									<a 
										href={wildfire.url} 
										target="_blank" 
										rel="noopener noreferrer"
										class="mt-4 block w-full text-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
									>
										Official Updates →
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Stats Summary -->
			<div class="mt-8 bg-white rounded-lg shadow-lg border border-amber-200 p-6">
				<h2 class="text-xl font-semibold text-amber-900 mb-4">Fire Statistics</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">{wildfires.length}</div>
						<div class="text-sm text-amber-600">Active Fires</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-red-600">
							{wildfires.filter(f => f.severity === 'critical').length}
						</div>
						<div class="text-sm text-amber-600">Critical Events</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">
							{wildfires.filter(f => f.severity === 'high').length}
						</div>
						<div class="text-sm text-amber-600">High Priority</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">
							{wildfires.filter(f => f.severity === 'low').length}
						</div>
						<div class="text-sm text-amber-600">Contained</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
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