/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				dashboard: {
					bg: '#faf7f2',
					surface: '#f5f0e8',
					border: '#e5d5c3'
				},
				severity: {
					low: '#059669',
					medium: '#d97706',
					high: '#dc2626',
					critical: '#991b1b'
				}
			},
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Oxygen',
					'Ubuntu',
					'Cantarell',
					'Fira Sans',
					'Droid Sans',
					'Helvetica Neue',
					'sans-serif'
				]
			},
			animation: {
				'pulse-alert': 'pulse-alert 2s ease-in-out infinite'
			},
			keyframes: {
				'pulse-alert': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				}
			}
		}
	},
	plugins: []
};