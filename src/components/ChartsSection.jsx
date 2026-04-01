import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/formatters'

const PALETTE = ['#14b8a6', '#f59e0b', '#6366f1', '#f43f5e', '#10b981', '#f97316', '#0ea5e9']

function BalanceTrendChart({ data }) {
  const [activePoint, setActivePoint] = useState(null)
  const width = 520
  const height = 240
  const padding = 34

  const values = data.map((d) => d.balance)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = Math.max(maxValue - minValue, 1)

  const points = data.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1)
    const y = height - padding - ((d.balance - minValue) / range) * (height - padding * 2)
    return { x, y, ...d }
  })

  const yTicks = useMemo(() => {
    const count = 4
    return Array.from({ length: count + 1 }, (_, i) => {
      const ratio = i / count
      const value = maxValue - ratio * range
      const y = padding + ratio * (height - padding * 2)
      return { y, value }
    })
  }, [maxValue, range])

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <div className="line-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" role="img" aria-label="Balance trend chart">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => (
          <g key={tick.y}>
            <line x1={padding} x2={width - padding} y1={tick.y} y2={tick.y} className="grid-line" />
            <text x={8} y={tick.y + 4} className="axis-text">
              {formatCurrency(Math.round(tick.value))}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#trendFill)" className="line-area" />
        <path d={linePath} className="line-stroke" />

        {points.map((p) => (
          <g key={p.label}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              className="line-dot"
              onMouseEnter={() => setActivePoint(p)}
              onMouseLeave={() => setActivePoint(null)}
            />
          </g>
        ))}

        {activePoint && (
          <g className="chart-tooltip">
            <rect x={activePoint.x - 72} y={activePoint.y - 46} width="144" height="34" rx="8" className="tooltip-box" />
            <text x={activePoint.x} y={activePoint.y - 25} textAnchor="middle" className="tooltip-text">
              {`${activePoint.label}: ${formatCurrency(activePoint.balance)}`}
            </text>
          </g>
        )}
      </svg>
      <div className="x-labels">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

function SpendingDonutChart({ data }) {
  const [activeSegment, setActiveSegment] = useState(null)
  const size = 240
  const stroke = 28
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  let cumulative = 0
  const segments = data.map((item, index) => {
    const fraction = total ? item.amount / total : 0
    const segmentLength = fraction * circumference
    const dasharray = `${segmentLength} ${circumference - segmentLength}`
    const dashoffset = -cumulative
    cumulative += segmentLength

    return {
      ...item,
      color: PALETTE[index % PALETTE.length],
      dasharray,
      dashoffset,
      percent: Math.round(fraction * 100),
    }
  })

  return (
    <div className="donut-layout">
      <div className="donut-wrap">
        <svg viewBox={`0 0 ${size} ${size}`} className="donut-chart" role="img" aria-label="Spending breakdown chart">
          <circle cx={size / 2} cy={size / 2} r={radius} className="donut-track" />
          {segments.map((segment) => (
            <circle
              key={segment.category}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className={`donut-segment ${activeSegment?.category === segment.category ? 'active' : ''}`}
              style={{
                stroke: segment.color,
                strokeDasharray: segment.dasharray,
                strokeDashoffset: segment.dashoffset,
              }}
              onMouseEnter={() => setActiveSegment(segment)}
              onMouseLeave={() => setActiveSegment(null)}
            />
          ))}
        </svg>
        <div className="donut-center">
          <p>{activeSegment ? activeSegment.category : 'Total'}</p>
          <strong>{formatCurrency(activeSegment ? activeSegment.amount : total)}</strong>
          {activeSegment && <small>{activeSegment.percent}%</small>}
        </div>
      </div>

      <ul className="chart-legend">
        {segments.map((segment) => (
          <li
            key={segment.category}
            onMouseEnter={() => setActiveSegment(segment)}
            onMouseLeave={() => setActiveSegment(null)}
            className={activeSegment?.category === segment.category ? 'active' : ''}
          >
            <span className="swatch" style={{ backgroundColor: segment.color }} />
            <span>{segment.category}</span>
            <strong>{segment.percent}%</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ChartsSection({ monthlyTrend, categorySpend }) {
  return (
    <section className="charts-grid">
      <article className="panel">
        <h3>Balance Trend</h3>
        {monthlyTrend.length ? <BalanceTrendChart data={monthlyTrend} /> : <p className="empty">No data available for trend chart.</p>}
      </article>

      <article className="panel">
        <h3>Spending Breakdown</h3>
        {categorySpend.length ? <SpendingDonutChart data={categorySpend} /> : <p className="empty">No expenses yet. Add an expense to view breakdown.</p>}
      </article>
    </section>
  )
}
