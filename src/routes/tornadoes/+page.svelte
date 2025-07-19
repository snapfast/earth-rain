<script lang="ts">
	import { onMount } from 'svelte';
	import { DisasterAPI } from '../../lib/api/disaster.js';
	import { formatAlertTimeGMT } from '../../lib/utils/time.js';
	import type { DisasterEvent } from '../../lib/types/disaster.js';

	let tornadoes: DisasterEvent[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		await loadTornadoes();
		// Refresh every 5 minutes
		const interval = setInterval(loadTornadoes, 300000);
		return () => clearInterval(interval);
	});

	async function loadTornadoes() {
		try {
			isLoading = true;
			error = null;
			const allDisasters = await DisasterAPI.getRecentDisasters();
			tornadoes = allDisasters.filter(d => d.type === 'tornado');
		} catch (err) {
			error = 'Failed to load tornado data';
			console.error('Failed to load tornadoes:', err);
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

	function getTornadoRating(severity: string): string {
		switch (severity) {
			case 'low': return 'EF0-EF1';
			case 'medium': return 'EF2';
			case 'high': return 'EF3-EF4';
			case 'critical': return 'EF5';
			default: return 'Unknown';
		}
	}

	function getWindSpeed(severity: string): string {
		switch (severity) {
			case 'low': return '65-110 mph';
			case 'medium': return '111-165 mph';
			case 'high': return '166-250 mph';
			case 'critical': return '250+ mph';
			default: return 'Unknown';
		}
	}

	function getDamageDescription(severity: string): string {
		switch (severity) {
			case 'low': return 'Light to moderate damage';
			case 'medium': return 'Considerable damage to structures';
			case 'high': return 'Severe damage - well-built homes leveled';
			case 'critical': return 'Incredible destruction - total devastation';
			default: return 'Damage assessment pending';
		}
	}
</script>

<svelte:head>
	<title>Tornado Warnings - Earth Rain</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-3 mb-4">
				<span class="text-4xl">🌪️</span>
				<div>
					<h1 class="text-3xl font-bold text-amber-900">Tornado Warnings</h1>
					<p class="text-amber-700">Active tornado watches, warnings, and confirmed sightings</p>
				</div>
			</div>
			
			<div class="flex items-center space-x-4 text-sm text-amber-600">
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-green-500 rounded-full"></div>
					<span>EF0-EF1 (Light)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<span>EF2 (Strong)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
					<span>EF3-EF4 (Violent)</span>
				</div>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 bg-red-500 rounded-full"></div>
					<span>EF5 (Incredible)</span>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="text-center py-12">
				<div class="loading-spinner mx-auto mb-4"></div>
				<p class="text-amber-700">Loading tornado data...</p>
			</div>
		{:else if error}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">⚠️</div>
				<p class="text-red-600 font-medium">{error}</p>
				<button 
					on:click={loadTornadoes}
					class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
				>
					Retry
				</button>
			</div>
		{:else if tornadoes.length === 0}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">✅</div>
				<p class="text-amber-700">No active tornado warnings</p>
				<p class="text-sm text-amber-600 mt-1">Weather conditions stable</p>
			</div>
		{:else}
			<!-- Tornado Grid -->
			<div class="space-y-6">
				{#each tornadoes as tornado}
					<div class="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-shadow">
						<!-- Alert Banner -->
						<div class="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<span class="text-2xl">🌪️</span>
									<div>
										<h3 class="text-xl font-bold">{tornado.title}</h3>
										<p class="text-purple-100">{getTornadoRating(tornado.severity)} Rating</p>
									</div>
								</div>
								<div class="text-right">
									<div class="text-sm opacity-90">{formatTimestamp(tornado.timestamp)}</div>
									<div class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20 border border-white/30">
										{tornado.severity.toUpperCase()}
									</div>
								</div>
							</div>
						</div>

						<div class="p-6">
							<div class="grid md:grid-cols-2 gap-6">
								<!-- Tornado Details -->
								<div>
									<h4 class="font-semibold text-amber-900 mb-3">Storm Information</h4>
									<p class="text-amber-700 mb-4">{tornado.description}</p>

									<div class="space-y-2 text-sm">
										<div class="flex justify-between">
											<span class="text-amber-600">Location:</span>
											<span class="text-amber-800 font-medium">{tornado.location.name}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">EF Rating:</span>
											<span class="text-amber-800 font-medium">{getTornadoRating(tornado.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Wind Speed:</span>
											<span class="text-amber-800 font-medium">{getWindSpeed(tornado.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Damage Level:</span>
											<span class="text-amber-800 font-medium">{getDamageDescription(tornado.severity)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Coordinates:</span>
											<span class="text-amber-800 font-medium">{tornado.location.lat.toFixed(2)}°, {tornado.location.lon.toFixed(2)}°</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Last Update:</span>
											<span class="text-amber-800 font-medium">{formatAlertTimeGMT(tornado.timestamp)} UTC</span>
										</div>
										<div class="flex justify-between">
											<span class="text-amber-600">Source:</span>
											<span class="text-amber-800 font-medium">{tornado.source}</span>
										</div>
									</div>
								</div>

								<!-- Safety Information -->
								<div class="bg-amber-50 rounded-lg p-4">
									<h4 class="font-semibold text-amber-900 mb-3 flex items-center">
										<span class="mr-2">⚠️</span>
										Safety Instructions
									</h4>
									
									<div class="space-y-3 text-sm">
										{#if tornado.severity === 'critical'}
											<div class="flex items-start space-x-2 text-red-700">
												<span class="text-red-500 mt-0.5">🚨</span>
												<span>Extreme danger! Seek underground shelter immediately.</span>
											</div>
										{:else if tornado.severity === 'high'}
											<div class="flex items-start space-x-2 text-orange-700">
												<span class="text-orange-500 mt-0.5">⚠️</span>
												<span>Take cover immediately in interior room on lowest floor.</span>
											</div>
										{:else if tornado.severity === 'medium'}
											<div class="flex items-start space-x-2 text-yellow-700">
												<span class="text-yellow-500 mt-0.5">⚡</span>
												<span>Seek sturdy shelter. Stay away from windows.</span>
											</div>
										{:else}
											<div class="flex items-start space-x-2 text-blue-700">
												<span class="text-blue-500 mt-0.5">🌪️</span>
												<span>Monitor conditions. Be prepared to take cover.</span>
											</div>
										{/if}

										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🏠</span>
											<span>Go to interior room on lowest floor, away from windows.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🚗</span>
											<span>If in vehicle, abandon it and seek sturdy shelter.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🏢</span>
											<span>If in mobile home, evacuate to sturdy building.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">🛡️</span>
											<span>Cover yourself with mattress or heavy blankets.</span>
										</div>
										<div class="flex items-start space-x-2 text-amber-700">
											<span class="text-amber-500 mt-0.5">📱</span>
											<span>Keep weather radio or phone for emergency alerts.</span>
										</div>
									</div>

									{#if tornado.url}
										<a 
											href={tornado.url} 
											target="_blank" 
											rel="noopener noreferrer"
											class="mt-4 block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
										>
											Storm Tracking →
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
				<h2 class="text-xl font-semibold text-amber-900 mb-4">Tornado Activity</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-amber-900">{tornadoes.length}</div>
						<div class="text-sm text-amber-600">Active Warnings</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-red-600">
							{tornadoes.filter(t => t.severity === 'critical').length}
						</div>
						<div class="text-sm text-amber-600">EF5 Events</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-orange-600">
							{tornadoes.filter(t => t.severity === 'high').length}
						</div>
						<div class="text-sm text-amber-600">Violent (EF3-EF4)</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-yellow-600">
							{tornadoes.filter(t => t.severity === 'low' || t.severity === 'medium').length}
						</div>
						<div class="text-sm text-amber-600">Weak-Strong (EF0-EF2)</div>
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