import { writable, derived } from 'svelte/store';
import type { DisasterEvent, DisasterType } from '../types/disaster.js';

// Disaster events store
export const disasterEvents = writable<DisasterEvent[]>([]);
export const isLoadingDisasters = writable<boolean>(true);
export const disasterError = writable<string | null>(null);

// Filter options
export const selectedDisasterTypes = writable<DisasterType[]>([
	'earthquake',
	'flood',
	'hurricane',
	'tornado',
	'wildfire',
	'severe_weather'
]);

export const minimumSeverity = writable<'low' | 'medium' | 'high' | 'critical'>('medium');

// Derived stores for filtered events
export const filteredDisasterEvents = derived(
	[disasterEvents, selectedDisasterTypes, minimumSeverity],
	([$events, $types, $severity]) => {
		const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
		const minSeverityLevel = severityOrder[$severity];

		return $events.filter(event => 
			$types.includes(event.type) && 
			severityOrder[event.severity] >= minSeverityLevel
		);
	}
);

export const criticalEvents = derived(
	disasterEvents,
	($events) => $events.filter(event => event.severity === 'critical')
);

export const recentEvents = derived(
	disasterEvents,
	($events) => {
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		return $events.filter(event => event.timestamp > oneHourAgo);
	}
);

export const eventsByType = derived(
	disasterEvents,
	($events) => {
		const grouped: Record<DisasterType, DisasterEvent[]> = {} as any;
		
		$events.forEach(event => {
			if (!grouped[event.type]) {
				grouped[event.type] = [];
			}
			grouped[event.type].push(event);
		});

		return grouped;
	}
);

// Helper functions
export function addDisasterEvent(event: DisasterEvent) {
	disasterEvents.update(events => {
		// Remove any existing event with the same ID
		const filtered = events.filter(e => e.id !== event.id);
		// Add the new event and sort by timestamp (newest first)
		return [event, ...filtered].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
	});
}

export function setDisasterEvents(events: DisasterEvent[]) {
	disasterEvents.set(events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
	disasterError.set(null);
}

export function setDisasterError(errorMessage: string) {
	disasterError.set(errorMessage);
	isLoadingDisasters.set(false);
}

export function setDisasterLoadingState(loading: boolean) {
	isLoadingDisasters.set(loading);
	if (loading) {
		disasterError.set(null);
	}
}