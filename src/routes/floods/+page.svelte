<script lang="ts">
	import { onMount } from 'svelte';
	import { DisasterAPI } from '../../lib/api/disaster.js';
	import { formatAlertTimeGMT } from '../../lib/utils/time.js';
	import type { DisasterEvent } from '../../lib/types/disaster.js';

	let floods: DisasterEvent[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadFloods();
		// Refresh every 5 minutes
		const interval = setInterval(loadFloods, 300000);
		return () => clearInterval(interval);
	});

	async function loadFloods() {
		try {
			isLoading = true;
			error = null;
			const allDisasters = await DisasterAPI.getRecentDisasters();
			floods = allDisasters.filter(d => d.type === 'flood');
		} catch (err) {
			error = 'Failed to load flood data';
			console.error('Failed to load floods:', err);
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

	function getFloodSeverityDescription(severity: string): string {
		switch (severity) {
			case 'low': return 'Minor flooding - monitor conditions';
			case 'medium': return 'Moderate flooding - avoid affected areas';
			case 'high': return 'Major flooding - seek higher ground';
			case 'critical': return 'Life-threatening flooding - evacuate immediately';
			default: return 'Flood severity unknown';
		}
	}

	function getWaterLevel(severity: string): string {
		switch (severity) {
			case 'low': return '0.5-2 feet';
			case 'medium': return '2-5 feet';
			case 'high': return '5-10 feet';
			case 'critical': return '10+ feet';
			default: return 'Unknown';
		}
	}
</script>

<svelte:head>
	<title>Flood Warnings - Earth Rain</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-3 mb-4">
				<span class="text-4xl">🌊</span>
				<div>
					<h1 class="text-3xl font-bold text-amber-900">Flood Warnings</h1>
					<p class="text-amber-700">Active flood alerts and water level monitoring</p>
				</div>
			</div>
			
			<div class="flex items-center space-x-4 text-sm text-amber-600">
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full"></div>
					<span>Minor Flooding</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<span>Moderate Flooding</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
					<span>Major Flooding</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full"></div>
					<span>Life-Threatening</span>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="text-center py-12">
				<div class="loading-spinner mx-auto mb-4"></div>
				<p class="text-amber-700">Loading flood data...</p>
			</div>
		{:else if error}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">⚠️</div>
				<p class="text-red-600 font-medium">{error}</p>
				<button 
					on:click={loadFloods}
					class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
				>
					Retry
				</button>
			</div>
		{:else if floods.length === 0}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">✅</div>
				<p class="text-amber-700">No active flood warnings</p>
				<p class="text-sm text-amber-600 mt-1">All water levels normal</p>
			</div>
		{:else}
			<!-- Flood Grid -->
			<div class="space-y-6">
				{#each floods as flood}
					<div class="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-shadow">
						<!-- Alert Banner -->
						<div class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<span class="text-2xl">🌊</span>
									<div>
										<h3 class="text-xl font-bold">{flood.title}</h3>
										<p class="text-blue-100">{getFloodSeverityDescription(flood.severity)}</p>
									</div>
								</div>
								<div class="text-right">
									<div class="text-sm opacity-90">{formatTimestamp(flood.timestamp)}</div>
									<div class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20 border border-white/30">
										{flood.severity.toUpperCase()}
									</div>
								</div>
							</div>
						</div>

						<div class="p-6">
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Flood Details -->
								<div>
									<h4 class="font-semibold text-amber-900 mb-3">Flood Information</h4>
									<p class="text-amber-700 mb-4">{flood.description}</p>

									<div class="space-y-2 text-sm">
										<div class="flex justify-between">
											<span class="text-amber-600">Location:</span>
											<span class="text-amber-800 font-medium">{flood.location.name}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Water Level:</span>
											<span class="text-amber-800 font-medium">{getWaterLevel(flood.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Coordinates:</span>
											<span class="text-amber-800 font-medium">{flood.location.lat.toFixed(2)}°, {flood.location.lon.toFixed(2)}°</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Last Update:</span>
											<span class="text-amber-800 font-medium">{formatAlertTimeGMT(flood.timestamp)} UTC</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Source:</span>
											<span class="text-amber-800 font-medium">{flood.source}</span>
										</div>
									</div>
								</div>

								<!-- Safety Information -->
								<div class="bg-amber-50 rounded-lg p-4">
									<h4 class="font-semibold text-amber-900 mb-3 flex items-center">
										<span class="mr-2">⚠️</span>
										Safety Guidelines
									</h4>
									
									<div class="space-y-3 text-sm">
										{#if flood.severity === 'critical'}
											<div class="flex items-start space-x-2 text-red-700">
												<span class="text-red-500 mt-0.5">🚨</span>
												<span>Evacuate immediately to higher ground. Do not attempt to travel.</span>
											</div>
										{:else if flood.severity === 'high'}
											<div class="flex items-start space-x-2 text-orange-700">
												<span class="text-orange-500 mt-0.5">⚠️</span>
												<span>Seek higher ground immediately. Major flooding in progress.</span>
											</div>
										{:else if flood.severity === 'medium'}
											<div class="flex items-start space-x-2 text-yellow-700">
												<span class="text-yellow-500 mt-0.5">⚡</span>
												<span>Avoid low-lying areas. Do not drive through flooded roads.</span>
											</div>
										{:else}
											<div class="flex items-start space-x-2 text-blue-700">
												<span class="text-blue-500 mt-0.5">💧</span>
												<span>Monitor conditions closely. Avoid flood-prone areas.</span>
											</div>
										{/if}

										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🚗</span>
											<span>Turn around, don't drown. 6 inches can knock you down.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🏠</span>
											<span>Move to higher floors if trapped in building.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">📱</span>
											<span>Keep emergency supplies and communication devices ready.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">⚡</span>
											<span>Stay away from electrical equipment in flooded areas.</span>
										</div>
									</div>

									{#if flood.url}
										<a 
											href={flood.url} 
											target="_blank" 
											rel="noopener noreferrer"
											class="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
										>
											Official Updates →
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
				<h2 class="text-xl font-semibold text-amber-900 mb-4">Flood Activity</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">{floods.length}</div>
						<div class="text-sm text-amber-600">Active Warnings</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-red-600">
							{floods.filter(f => f.severity === 'critical').length}
						</div>
						<div class="text-sm text-amber-600">Critical Events</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">
							{floods.filter(f => f.severity === 'high').length}
						</div>
						<div class="text-sm text-amber-600">Major Flooding</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">
							{floods.filter(f => f.severity === 'low' || f.severity === 'medium').length}
						</div>
						<div class="text-sm text-amber-600">Minor/Moderate</div>
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