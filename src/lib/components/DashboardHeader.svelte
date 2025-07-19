<script lang="ts">
	import { onMount } from 'svelte';
	import { currentLocation, isCitiesLoading } from '../stores/weather.js';
	import { currentTime, startTimeSync, stopTimeSync, isTimeLoading } from '../stores/time.js';
	import { isLoadingDisasters } from '../stores/disaster.js';
	import { formatTimeGMT, formatDateGMT, formatShortTimeGMT } from '../utils/time.js';
	
	export let lastUpdate: Date;
	export let popularCities: Array<{name: string, country: string, state: string, lat: number, lon: number}> = [];
	export let onCitySelect: (city: any) => void = () => {};
	
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
			<div>
				<h1 class="text-2xl font-bold text-amber-900">Earth Rain</h1>
				<p class="text-sm text-amber-700">Weather & Disaster Monitoring</p>
			</div>
			
			{#if popularCities.length > 0}
				<div class="flex items-center space-x-2 text-amber-800">
					<div class="text-lg">📍</div>
					<select 
						class="city-dropdown text-lg font-medium bg-transparent border-none outline-none cursor-pointer text-amber-800 hover:text-amber-900"
						value={$currentLocation ? `${$currentLocation.name}, ${$currentLocation.country}` : ''}
						on:change={(e) => {
							const selectedValue = e.target.value;
							const selectedCity = popularCities.find(city => `${city.name}, ${city.country}` === selectedValue);
							if (selectedCity) {
								onCitySelect(selectedCity);
							}
						}}
					>
						{#each popularCities as city}
							<option value="{city.name}, {city.country}">
								{city.name}, {city.country}
							</option>
						{/each}
					</select>
				</div>
			{:else if $currentLocation}
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