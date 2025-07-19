import { writable } from 'svelte/store';
import { TimeAPI } from '../api/time.js';

// Current UTC time from API
export const currentTime = writable<Date>(new Date());
export const isTimeLoading = writable<boolean>(true);
export const timeError = writable<string | null>(null);

// Update interval for time sync
let timeUpdateInterval: NodeJS.Timeout | null = null;

/**
 * Start the time synchronization service
 * Updates time every 30 seconds from API and every second locally
 */
export async function startTimeSync(): Promise<void> {
	// Initial time fetch
	await updateTimeFromAPI();
	
	// Set up API sync every 30 seconds
	const apiSyncInterval = setInterval(updateTimeFromAPI, 30000);
	
	// Set up local time increment every second
	timeUpdateInterval = setInterval(() => {
		currentTime.update(time => new Date(time.getTime() + 1000));
	}, 1000);
	
	// Store cleanup function
	if (typeof window !== 'undefined') {
		window.addEventListener('beforeunload', () => {
			clearInterval(apiSyncInterval);
			if (timeUpdateInterval) {
				clearInterval(timeUpdateInterval);
			}
		});
	}
}

/**
 * Stop the time synchronization service
 */
export function stopTimeSync(): void {
	if (timeUpdateInterval) {
		clearInterval(timeUpdateInterval);
		timeUpdateInterval = null;
	}
}

/**
 * Manually update time from API
 */
export async function updateTimeFromAPI(): Promise<void> {
	try {
		isTimeLoading.set(true);
		timeError.set(null);
		
		const apiTime = await TimeAPI.getCurrentUTCTime();
		currentTime.set(apiTime);
		
		isTimeLoading.set(false);
	} catch (error) {
		console.error('Failed to update time from API:', error);
		timeError.set('Failed to sync time');
		isTimeLoading.set(false);
		
		// Continue with local time if API fails
		currentTime.set(new Date());
	}
}

/**
 * Force refresh time from API (clears cache)
 */
export async function refreshTimeFromAPI(): Promise<void> {
	TimeAPI.clearCache();
	await updateTimeFromAPI();
}