export function exportTransactionsAsJson(transactions) {
  const payload = JSON.stringify(transactions, null, 2)
  downloadBlob(payload, 'transactions.json', 'application/json')
}

export function exportTransactionsAsCsv(transactions) {
  const headers = ['id', 'date', 'amount', 'category', 'type', 'note']
  const lines = transactions.map((tx) =>
    headers
      .map((header) => {
        const raw = tx[header] ?? ''
        const value = String(raw).replaceAll('"', '""')
        return /[",\n]/.test(value) ? `"${value}"` : value
      })
      .join(','),
  )

  const csv = [headers.join(','), ...lines].join('\n')
  downloadBlob(csv, 'transactions.csv', 'text/csv;charset=utf-8;')
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
}
