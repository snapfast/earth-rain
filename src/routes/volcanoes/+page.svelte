<script lang="ts">
	import { onMount } from 'svelte';
	import { DisasterAPI } from '../../lib/api/disaster.js';
	import { formatAlertTimeGMT } from '../../lib/utils/time.js';
	import type { DisasterEvent } from '../../lib/types/disaster.js';

	let volcanoes: DisasterEvent[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadVolcanoes();
		// Refresh every 5 minutes
		const interval = setInterval(loadVolcanoes, 300000);
		return () => clearInterval(interval);
	});

	async function loadVolcanoes() {
		try {
			isLoading = true;
			error = null;
			const allDisasters = await DisasterAPI.getRecentDisasters();
			volcanoes = allDisasters.filter(d => d.type === 'volcano');
		} catch (err) {
			error = 'Failed to load volcanic activity data';
			console.error('Failed to load volcanoes:', err);
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

	function getAlertLevel(severity: string): string {
		switch (severity) {
			case 'low': return 'Advisory';
			case 'medium': return 'Watch';
			case 'high': return 'Warning';
			case 'critical': return 'Emergency';
			default: return 'Monitoring';
		}
	}

	function getActivityDescription(severity: string): string {
		switch (severity) {
			case 'low': return 'Background activity - normal monitoring';
			case 'medium': return 'Elevated activity - increased monitoring';
			case 'high': return 'Heightened unrest - evacuation preparations';
			case 'critical': return 'Imminent eruption - immediate evacuation';
			default: return 'Activity level unknown';
		}
	}

	function getEruptionRisk(severity: string): string {
		switch (severity) {
			case 'low': return 'Minimal';
			case 'medium': return 'Elevated';
			case 'high': return 'High';
			case 'critical': return 'Imminent';
			default: return 'Unknown';
		}
	}

	function getEvacuationRadius(severity: string): string {
		switch (severity) {
			case 'low': return 'None required';
			case 'medium': return '5-10 km';
			case 'high': return '15-30 km';
			case 'critical': return '30+ km';
			default: return 'TBD';
		}
	}
</script>

<svelte:head>
	<title>Volcanic Activity - Earth Rain</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-3 mb-4">
				<span class="text-4xl">🌋</span>
				<div>
					<h1 class="text-3xl font-bold text-amber-900">Volcanic Activity</h1>
					<p class="text-amber-700">Active volcanoes and eruption monitoring</p>
				</div>
			</div>
			
			<div class="flex items-center space-x-4 text-sm text-amber-600">
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full"></div>
					<span>Advisory (Background)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<span>Watch (Elevated)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
					<span>Warning (Heightened)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full"></div>
					<span>Emergency (Imminent)</span>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="text-center py-12">
				<div class="loading-spinner mx-auto mb-4"></div>
				<p class="text-amber-700">Loading volcanic activity data...</p>
			</div>
		{:else if error}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">⚠️</div>
				<p class="text-red-600 font-medium">{error}</p>
				<button 
					on:click={loadVolcanoes}
					class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
				>
					Retry
				</button>
			</div>
		{:else if volcanoes.length === 0}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">✅</div>
				<p class="text-amber-700">No heightened volcanic activity</p>
				<p class="text-sm text-amber-600 mt-1">All volcanoes at background levels</p>
			</div>
		{:else}
			<!-- Volcano Grid -->
			<div class="space-y-6">
				{#each volcanoes as volcano}
					<div class="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-shadow">
						<!-- Alert Banner -->
						<div class="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<span class="text-2xl">🌋</span>
									<div>
										<h3 class="text-xl font-bold">{volcano.title}</h3>
										<p class="text-red-100">{getAlertLevel(volcano.severity)} Level</p>
									</div>
								</div>
								<div class="text-right">
									<div class="text-sm opacity-90">{formatTimestamp(volcano.timestamp)}</div>
									<div class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20 border border-white/30">
										{volcano.severity.toUpperCase()}
									</div>
								</div>
							</div>
						</div>

						<div class="p-6">
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Volcano Details -->
								<div>
									<h4 class="font-semibold text-amber-900 mb-3">Volcanic Information</h4>
									<p class="text-amber-700 mb-4">{volcano.description}</p>

									<div class="space-y-2 text-sm">
										<div class="flex justify-between">
											<span class="text-amber-600">Location:</span>
											<span class="text-amber-800 font-medium">{volcano.location.name}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Alert Level:</span>
											<span class="text-amber-800 font-medium">{getAlertLevel(volcano.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Eruption Risk:</span>
											<span class="text-amber-800 font-medium">{getEruptionRisk(volcano.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Evacuation Zone:</span>
											<span class="text-amber-800 font-medium">{getEvacuationRadius(volcano.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Coordinates:</span>
											<span class="text-amber-800 font-medium">{volcano.location.lat.toFixed(2)}°, {volcano.location.lon.toFixed(2)}°</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Last Update:</span>
											<span class="text-amber-800 font-medium">{formatAlertTimeGMT(volcano.timestamp)} UTC</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Source:</span>
											<span class="text-amber-800 font-medium">{volcano.source}</span>
										</div>
									</div>
								</div>

								<!-- Safety Information -->
								<div class="bg-amber-50 rounded-lg p-4">
									<h4 class="font-semibold text-amber-900 mb-3 flex items-center">
										<span class="mr-2">⚠️</span>
										Safety Precautions
									</h4>
									
									<div class="space-y-3 text-sm">
										{#if volcano.severity === 'critical'}
											<div class="flex items-start space-x-2 text-red-700">
												<span class="text-red-500 mt-0.5">🚨</span>
												<span>Evacuate immediately! Imminent eruption expected.</span>
											</div>
										{:else if volcano.severity === 'high'}
											<div class="flex items-start space-x-2 text-orange-700">
												<span class="text-orange-500 mt-0.5">⚠️</span>
												<span>Prepare for evacuation. Heightened volcanic unrest.</span>
											</div>
										{:else if volcano.severity === 'medium'}
											<div class="flex items-start space-x-2 text-yellow-700">
												<span class="text-yellow-500 mt-0.5">⚡</span>
												<span>Elevated activity detected. Monitor conditions closely.</span>
											</div>
										{:else}
											<div class="flex items-start space-x-2 text-blue-700">
												<span class="text-blue-500 mt-0.5">📊</span>
												<span>Background activity. Normal monitoring in effect.</span>
											</div>
										{/if}

										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🏠</span>
											<span>Know evacuation routes and emergency assembly points.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">😷</span>
											<span>Prepare masks for ash protection and respiratory safety.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🚗</span>
											<span>Keep vehicle fueled and emergency kit ready.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">💨</span>
											<span>Stay indoors during ashfall. Close windows and doors.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">📱</span>
											<span>Monitor official channels for evacuation orders.</span>
										</div>
									</div>

									{#if volcano.url}
										<a 
											href={volcano.url} 
											target="_blank" 
											rel="noopener noreferrer"
											class="mt-4 block w-full text-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
										>
											Observatory Updates →
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
				<h2 class="text-xl font-semibold text-amber-900 mb-4">Volcanic Activity Summary</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">{volcanoes.length}</div>
						<div class="text-sm text-amber-600">Active Volcanoes</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-red-600">
							{volcanoes.filter(v => v.severity === 'critical').length}
						</div>
						<div class="text-sm text-amber-600">Emergency Level</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">
							{volcanoes.filter(v => v.severity === 'high').length}
						</div>
						<div class="text-sm text-amber-600">Warning Level</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-yellow-600">
							{volcanoes.filter(v => v.severity === 'medium').length}
						</div>
						<div class="text-sm text-amber-600">Watch Level</div>
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