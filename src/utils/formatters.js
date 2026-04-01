export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function monthLabel(date) {
  return new Date(date).toLocaleString('en-US', { month: 'short', year: '2-digit' })
}
