<script lang="ts">
	import { onMount } from 'svelte';
	import { DisasterAPI } from '../../lib/api/disaster.js';
	import { formatAlertTimeGMT } from '../../lib/utils/time.js';
	import type { DisasterEvent } from '../../lib/types/disaster.js';

	let hurricanes: DisasterEvent[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadHurricanes();
		// Refresh every 5 minutes
		const interval = setInterval(loadHurricanes, 300000);
		return () => clearInterval(interval);
	});

	async function loadHurricanes() {
		try {
			isLoading = true;
			error = null;
			const allDisasters = await DisasterAPI.getRecentDisasters();
			hurricanes = allDisasters.filter(d => d.type === 'hurricane');
		} catch (err) {
			error = 'Failed to load hurricane data';
			console.error('Failed to load hurricanes:', err);
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

	function getHurricaneCategory(severity: string): string {
		switch (severity) {
			case 'low': return 'Tropical Depression';
			case 'medium': return 'Category 1-2';
			case 'high': return 'Category 3-4';
			case 'critical': return 'Category 5';
			default: return 'Unknown';
		}
	}

	function getWindSpeed(severity: string): string {
		switch (severity) {
			case 'low': return '25-38 mph';
			case 'medium': return '74-110 mph';
			case 'high': return '111-156 mph';
			case 'critical': return '157+ mph';
			default: return 'Unknown';
		}
	}
</script>

<svelte:head>
	<title>Hurricane Tracking - Earth Rain</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-3 mb-4">
				<span class="text-4xl">🌀</span>
				<div>
					<h1 class="text-3xl font-bold text-amber-900">Hurricane Tracking</h1>
					<p class="text-amber-700">Active tropical cyclones and hurricane warnings</p>
				</div>
			</div>
			
			<div class="flex items-center space-x-4 text-sm text-amber-600">
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full"></div>
					<span>Tropical Depression</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<span>Category 1-2</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
					<span>Category 3-4</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full"></div>
					<span>Category 5</span>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="text-center py-12">
				<div class="loading-spinner mx-auto mb-4"></div>
				<p class="text-amber-700">Loading hurricane data...</p>
			</div>
		{:else if error}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">⚠️</div>
				<p class="text-red-600 font-medium">{error}</p>
				<button 
					on:click={loadHurricanes}
					class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
				>
					Retry
				</button>
			</div>
		{:else if hurricanes.length === 0}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">✅</div>
				<p class="text-amber-700">No active hurricanes tracked</p>
				<p class="text-sm text-amber-600 mt-1">Atlantic and Pacific basins clear</p>
			</div>
		{:else}
			<!-- Hurricane Grid -->
			<div class="space-y-6">
				{#each hurricanes as hurricane}
					<div class="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-shadow">
						<!-- Alert Banner -->
						<div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<span class="text-2xl">🌀</span>
									<div>
										<h3 class="text-xl font-bold">{hurricane.title}</h3>
										<p class="text-blue-100">{getHurricaneCategory(hurricane.severity)}</p>
									</div>
								</div>
								<div class="text-right">
									<div class="text-sm opacity-90">{formatTimestamp(hurricane.timestamp)}</div>
									<div class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20 border border-white/30">
										{hurricane.severity.toUpperCase()}
									</div>
								</div>
							</div>
						</div>

						<div class="p-6">
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Storm Details -->
								<div>
									<h4 class="font-semibold text-amber-900 mb-3">Storm Information</h4>
									<p class="text-amber-700 mb-4">{hurricane.description}</p>

									<div class="space-y-2 text-sm">
										<div class="flex justify-between">
											<span class="text-amber-600">Location:</span>
											<span class="text-amber-800 font-medium">{hurricane.location.name}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Wind Speed:</span>
											<span class="text-amber-800 font-medium">{getWindSpeed(hurricane.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Coordinates:</span>
											<span class="text-amber-800 font-medium">{hurricane.location.lat.toFixed(2)}°, {hurricane.location.lon.toFixed(2)}°</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Last Update:</span>
											<span class="text-amber-800 font-medium">{formatAlertTimeGMT(hurricane.timestamp)} UTC</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Source:</span>
											<span class="text-amber-800 font-medium">{hurricane.source}</span>
										</div>
									</div>
								</div>

								<!-- Safety Information -->
								<div class="bg-amber-50 rounded-lg p-4">
									<h4 class="font-semibold text-amber-900 mb-3 flex items-center">
										<span class="mr-2">⚠️</span>
										Safety Alerts
									</h4>
									
									<div class="space-y-3 text-sm">
										{#if hurricane.severity === 'critical'}
											<div class="flex items-start space-x-2 text-red-700">
												<span class="text-red-500 mt-0.5">🚨</span>
												<span>Catastrophic damage expected. Life-threatening storm surge.</span>
											</div>
										{:else if hurricane.severity === 'high'}
											<div class="flex items-start space-x-2 text-orange-700">
												<span class="text-orange-500 mt-0.5">⚠️</span>
												<span>Extensive damage likely. Dangerous storm surge possible.</span>
											</div>
										{:else if hurricane.severity === 'medium'}
											<div class="flex items-start space-x-2 text-yellow-700">
												<span class="text-yellow-500 mt-0.5">⚡</span>
												<span>Some damage expected. Power outages likely.</span>
											</div>
										{:else}
											<div class="flex items-start space-x-2 text-blue-700">
												<span class="text-blue-500 mt-0.5">🌊</span>
												<span>Minimal damage. Monitor conditions closely.</span>
											</div>
										{/if}

										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🏠</span>
											<span>Secure loose objects and prepare emergency supplies.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🚗</span>
											<span>Avoid travel in affected areas.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">📱</span>
											<span>Stay tuned to local emergency broadcasts.</span>
										</div>
									</div>

									{#if hurricane.url}
										<a 
											href={hurricane.url} 
											target="_blank" 
											rel="noopener noreferrer"
											class="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
										>
											Track Storm →
										</a>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Stats Summary -->
			<div class="mt-8 bg-white rounded-lg shadow-lg border border-amber-200 p-6">
				<h2 class="text-xl font-semibold text-amber-900 mb-4">Hurricane Activity</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">{hurricanes.length}</div>
						<div class="text-sm text-amber-600">Active Systems</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-red-600">
							{hurricanes.filter(h => h.severity === 'critical').length}
						</div>
						<div class="text-sm text-amber-600">Major Hurricanes</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">
							{hurricanes.filter(h => h.severity === 'high').length}
						</div>
						<div class="text-sm text-amber-600">Category 3-4</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">
							{hurricanes.filter(h => h.severity === 'low' || h.severity === 'medium').length}
						</div>
						<div class="text-sm text-amber-600">Tropical Systems</div>
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