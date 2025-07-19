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

/**
 * Format relative time (e.g., "5 hours ago")
 */
export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMinutes < 1) {
		return 'just now';
	} else if (diffMinutes < 60) {
		return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
	} else if (diffHours < 24) {
		return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
	} else if (diffDays < 7) {
		return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
	} else {
		return formatAlertTimeGMT(date);
	}
}

/**
 * Format alert time with UTC and relative time
 */
export function formatAlertTimeWithRelative(date: Date): string {
	return `${formatAlertTimeGMT(date)} UTC, ${formatRelativeTime(date)}`;
}