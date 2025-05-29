export function formatDateTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('en-US', {
    month: 'short', // Jan, Feb, etc
    day: '2-digit', // 01, 02
    year: 'numeric', // 2024
    hour: '2-digit', // 00-23
    minute: '2-digit', // 00-59
    hour12: false, // 24-hour format
  })
}
