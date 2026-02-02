/**
 * Format numbers in compact notation (1000 → 1K)
 */
export function formatCompactNum(num: number) {
	return new Intl.NumberFormat('en', {
		notation: 'compact',
		compactDisplay: 'short' // 'short' for 'K', 'long' for 'thousand'
	}).format(num);
}
