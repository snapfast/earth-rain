/**
 * Time API service using WorldTimeAPI (free, no key required)
 */

export interface TimeData {
	datetime: string;
	utc_datetime: string;
	timezone: string;
	utc_offset: string;
	unixtime: number;
}

export class TimeAPI {
	private static readonly BASE_URL = 'https://worldtimeapi.org/api';
	private static cachedTime: { time: Date; fetchTime: number } | null = null;
	private static readonly CACHE_DURATION = 30000; // 30 seconds

	private static async fetchJson(url: string): Promise<any> {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Time API error: ${response.status} ${response.statusText}`);
		}
		return response.json();
	}

	/**
	 * Get current UTC time from WorldTimeAPI
	 */
	static async getCurrentUTCTime(): Promise<Date> {
		try {
			// Check cache first
			if (this.cachedTime) {
				const timeSinceCache = Date.now() - this.cachedTime.fetchTime;
				if (timeSinceCache < this.CACHE_DURATION) {
					// Return cached time adjusted for elapsed time
					return new Date(this.cachedTime.time.getTime() + timeSinceCache);
				}
			}

			// Fetch fresh time from API
			const url = `${this.BASE_URL}/timezone/UTC`;
			const data: TimeData = await this.fetchJson(url);
			
			const currentTime = new Date(data.utc_datetime);
			
			// Cache the result
			this.cachedTime = {
				time: currentTime,
				fetchTime: Date.now()
			};

			return currentTime;
		} catch (error) {
			console.error('Failed to fetch time from API, falling back to system time:', error);
			// Fallback to system UTC time
			return new Date();
		}
	}

	/**
	 * Get time for a specific timezone
	 */
	static async getTimeForTimezone(timezone: string): Promise<Date> {
		try {
			const url = `${this.BASE_URL}/timezone/${timezone}`;
			const data: TimeData = await this.fetchJson(url);
			return new Date(data.datetime);
		} catch (error) {
			console.error('Failed to fetch timezone time:', error);
			throw error;
		}
	}

	/**
	 * Get list of available timezones
	 */
	static async getAvailableTimezones(): Promise<string[]> {
		try {
			const url = `${this.BASE_URL}/timezone`;
			return await this.fetchJson(url);
		} catch (error) {
			console.error('Failed to fetch timezones:', error);
			throw error;
		}
	}

	/**
	 * Clear the time cache (useful for manual refresh)
	 */
	static clearCache(): void {
		this.cachedTime = null;
	}
}