/**
 * Time utility functions for consistent GMT+0 (UTC) time handling
 */

/**
 * Format time in GMT+0 timezone with HH:MM:SS format
 */
export function formatTimeGMT(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		timeZone: 'UTC',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
}

/**
 * Format date in GMT+0 timezone with full date format
 */
export function formatDateGMT(date: Date): string {
	return date.toLocaleDateString('en-US', {
		timeZone: 'UTC',
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Format time in GMT+0 timezone with HH:MM format (for updates)
 */
export function formatShortTimeGMT(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		timeZone: 'UTC',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	});
}

/**
 * Format alert/event time in GMT+0 timezone
 */
export function formatAlertTimeGMT(date: Date): string {
	return date.toLocaleString('en-US', {
		timeZone: 'UTC',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
}

/**
 * Get current GMT+0 time
 */
export function getCurrentGMTTime(): Date {
	return new Date();
}

/**
 * Convert any date to GMT+0 string representation
 */
export function toGMTString(date: Date): string {
	return date.toISOString();
}

/**
 * Format date for display with timezone indicator
 */
export function formatDateTimeWithTimezone(date: Date): string {
	return `${formatTimeGMT(date)} UTC`;
}