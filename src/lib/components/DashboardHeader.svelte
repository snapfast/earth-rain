<script lang="ts">
	import { onMount } from 'svelte';
	import { currentLocation } from '../stores/weather.js';
	import { currentTime, startTimeSync, stopTimeSync } from '../stores/time.js';
	import { formatTimeGMT, formatDateGMT, formatShortTimeGMT } from '../utils/time.js';
	
	export let lastUpdate: Date;
	
	onMount(() => {
		startTimeSync();
		
		return () => {
			stopTimeSync();
		};
	});
</script>

<header class="widget">
	<div class="flex justify-between items-center">
		<div class="flex items-center space-x-4">
			<div class="flex items-center space-x-2">
				<div class="text-2xl">🌍</div>
				<div>
					<h1 class="text-2xl font-bold text-amber-900">Earth Rain</h1>
					<p class="text-sm text-amber-700">Weather & Disaster Monitoring</p>
				</div>
			</div>
			
			{#if $currentLocation}
				<div class="flex items-center space-x-2 text-amber-800">
					<div class="text-lg">📍</div>
					<span class="text-lg font-medium">
						{$currentLocation.name}, {$currentLocation.country}
					</span>
				</div>
			{/if}
		</div>
		
		<div class="text-right">
			<div class="text-2xl font-mono text-amber-900">
				{formatTimeGMT($currentTime)} UTC
			</div>
			<div class="text-sm text-amber-700">
				{formatDateGMT($currentTime)}
			</div>
			<div class="text-xs text-amber-600 mt-1">
				Last updated: {formatShortTimeGMT(lastUpdate)} UTC
			</div>
		</div>
	</div>
</header>