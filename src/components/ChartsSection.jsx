import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/formatters'

const PALETTE = ['var(--chart-c1)', 'var(--chart-c2)', 'var(--chart-c3)', 'var(--chart-c4)', 'var(--chart-c5)', 'var(--chart-c6)', 'var(--chart-c7)']

function BalanceTrendChart({ data }) {
  const [activePoint, setActivePoint] = useState(null)
  const width = 520
  const height = 240
  const padding = {
    top: 18,
    right: 20,
    bottom: 32,
    left: 86,
  }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom

  const values = data.map((d) => d.balance)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = Math.max(maxValue - minValue, 1)

  const points = data.map((d, index) => {
    const x = padding.left + (index * plotWidth) / Math.max(data.length - 1, 1)
    const y = height - padding.bottom - ((d.balance - minValue) / range) * plotHeight
    return { x, y, ...d }
  })

  const yTicks = useMemo(() => {
    const count = 4
    return Array.from({ length: count + 1 }, (_, i) => {
      const ratio = i / count
      const value = maxValue - ratio * range
      const y = padding.top + ratio * plotHeight
      return { y, value }
    })
  }, [maxValue, plotHeight, range])

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`

  const tooltip = useMemo(() => {
    if (!activePoint) return null
    const boxWidth = 156
    const boxHeight = 34
    const spacing = 12
    const minX = 4
    const maxX = width - boxWidth - 4
    const minY = 4
    const maxY = height - boxHeight - 4
    const preferredX = activePoint.x - boxWidth / 2
    const preferredY = activePoint.y - boxHeight - spacing
    const x = Math.min(Math.max(preferredX, minX), maxX)
    const y = Math.min(Math.max(preferredY, minY), maxY)

    return {
      x,
      y,
      textX: x + boxWidth / 2,
      textY: y + 21,
      boxWidth,
      boxHeight,
    }
  }, [activePoint, height, width])

  return (
    <div className="line-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" role="img" aria-label="Balance trend chart">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity="0.38" />
            <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => (
          <g key={tick.y}>
            <line x1={padding.left} x2={width - padding.right} y1={tick.y} y2={tick.y} className="grid-line" />
            <text x={padding.left - 8} y={tick.y + 4} textAnchor="end" className="axis-text">
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

        {activePoint && tooltip && (
          <g className="chart-tooltip">
            <rect x={tooltip.x} y={tooltip.y} width={tooltip.boxWidth} height={tooltip.boxHeight} rx="8" className="tooltip-box" />
            <text x={tooltip.textX} y={tooltip.textY} textAnchor="middle" className="tooltip-text">
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
