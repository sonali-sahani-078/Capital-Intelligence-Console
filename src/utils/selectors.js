import { monthLabel } from './formatters'

export function getSummary(transactions) {
  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  return { income, expenses, balance: income - expenses }
}

export function getFilteredTransactions(transactions, filters, sort) {
  const search = filters.search.trim().toLowerCase()
  const minAmount = filters.minAmount === '' ? null : Number(filters.minAmount)
  const maxAmount = filters.maxAmount === '' ? null : Number(filters.maxAmount)

  const next = transactions.filter((item) => {
    if (filters.type !== 'all' && item.type !== filters.type) return false
    if (filters.category !== 'all' && item.category !== filters.category) return false
    if (filters.fromDate && item.date < filters.fromDate) return false
    if (filters.toDate && item.date > filters.toDate) return false
    if (minAmount !== null && !Number.isNaN(minAmount) && item.amount < minAmount) return false
    if (maxAmount !== null && !Number.isNaN(maxAmount) && item.amount > maxAmount) return false
    if (!search) return true
    return (
      item.category.toLowerCase().includes(search) ||
      item.note.toLowerCase().includes(search) ||
      item.amount.toString().includes(search)
    )
  })

  next.sort((a, b) => {
    const dir = sort.direction === 'asc' ? 1 : -1
    if (sort.key === 'amount') return (a.amount - b.amount) * dir
    if (sort.key === 'category') return a.category.localeCompare(b.category) * dir
    if (sort.key === 'type') return a.type.localeCompare(b.type) * dir
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
  })

  return next
}

export function getGroupedTransactions(transactions, groupBy) {
  if (groupBy === 'none') return []

  const byKey = transactions.reduce((acc, tx) => {
    const key =
      groupBy === 'month'
        ? tx.date.slice(0, 7)
        : groupBy === 'category'
          ? tx.category
          : tx.type

    if (!acc[key]) {
      acc[key] = { key, label: groupBy === 'month' ? monthLabel(`${key}-01`) : key, count: 0, income: 0, expenses: 0 }
    }

    acc[key].count += 1
    if (tx.type === 'income') acc[key].income += tx.amount
    if (tx.type === 'expense') acc[key].expenses += tx.amount

    return acc
  }, {})

  return Object.values(byKey)
    .map((group) => ({ ...group, net: group.income - group.expenses }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function getMonthlyTrend(transactions) {
  const byMonth = transactions.reduce((acc, tx) => {
    const monthKey = tx.date.slice(0, 7)
    const label = monthLabel(tx.date)
    if (!acc[monthKey]) acc[monthKey] = { label, net: 0 }
    acc[monthKey].net += tx.type === 'income' ? tx.amount : -tx.amount
    return acc
  }, {})

  let running = 0
  return Object.keys(byMonth)
    .sort((a, b) => a.localeCompare(b))
    .map((monthKey) => {
      const month = byMonth[monthKey]
      running += month.net
      return { label: month.label, balance: running }
    })
}

export function getCategorySpend(transactions) {
  const byCategory = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount
      return acc
    }, {})

  return Object.entries(byCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function getInsights(transactions, categorySpend, formatCurrency) {
  if (!transactions.length) return null

  const topCategory = categorySpend[0]
  const monthExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => {
      const m = monthLabel(tx.date)
      acc[m] = (acc[m] || 0) + tx.amount
      return acc
    }, {})

  const monthList = Object.entries(monthExpense)
  const latest = monthList[monthList.length - 1]
  const previous = monthList[monthList.length - 2]
  let comparison = 'No monthly comparison available yet.'

  if (latest && previous) {
    const diff = latest[1] - previous[1]

    if (diff === 0) {
      comparison = `${latest[0]} spending is unchanged vs ${previous[0]}.`
    } else {
      const trend = diff > 0 ? 'higher' : 'lower'
      comparison = `${latest[0]} spending is ${formatCurrency(Math.abs(diff))} ${trend} vs ${previous[0]}.`
    }
  }

  const avgExpense = categorySpend.length
    ? categorySpend.reduce((sum, item) => sum + item.amount, 0) / categorySpend.length
    : 0
  const stable = avgExpense ? topCategory.amount < avgExpense * 1.2 : true

  return {
    topCategory: topCategory ? `${topCategory.category} (${formatCurrency(topCategory.amount)})` : 'No expense data',
    comparison,
    observation: stable
      ? 'Spending is relatively balanced across categories.'
      : `${topCategory.category} is materially higher than your category average.`,
  }
}
