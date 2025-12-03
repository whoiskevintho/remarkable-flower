import React, { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import './ParallelCoordinatesChart.css'

// Color palette
const speciesColors = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
  '#86BCB6',
  '#FFBE7D',
  '#C44E52',
  '#8172B3'
]

export default function ParallelCoordinatesChart({ data = [] }) {
  const [hoveringDataKey, setHoveringDataKey] = useState(null)

  const ranges = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        A: { min: 0, max: 1 }, B: { min: 0, max: 1 }, C: { min: 0, max: 1 },
        D: { min: 0, max: 1 }, E: { min: 0, max: 1 }, F: { min: 0, max: 1 }
      }
    }

    const dimensions = ['A', 'B', 'C', 'D', 'E', 'F']
    const ranges = {}
    dimensions.forEach(dim => {
      const values = data.map(item => item[dim]).filter(val => val != null)
      ranges[dim] = values.length > 0
        ? { min: Math.min(...values), max: Math.max(...values) }
        : { min: 0, max: 1 }
    })
    return ranges
  }, [data])

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    const dimensions = ['A', 'B', 'C', 'D', 'E', 'F']
    return dimensions.map(dim => {
      const point = { axis: dim }
      data.forEach((species, index) => {
        const speciesName = species.name || species.species || `Species ${index + 1}`
        const value = species[dim]
        const range = ranges[dim]
        point[speciesName] = (value != null && range.max !== range.min)
          ? (value - range.min) / (range.max - range.min)
          : 0
      })
      return point
    })
  }, [data, ranges])

  const speciesInfo = useMemo(() => {
    return data.map((species, index) => ({
      name: species.name || species.species || `Species ${index + 1}`,
      color: speciesColors[index % speciesColors.length]
    }))
  }, [data])

  const handleMouseEnter = (payload) => setHoveringDataKey(payload.dataKey)
  const handleMouseLeave = () => setHoveringDataKey(null)

  if (!data || data.length === 0) {
    return (
      <div className="parallel-chart-container">
        <p className="no-data-message">No data available</p>
      </div>
    )
  }

  return (
    <div className="parallel-chart-container">
      <h2 className="parallel-chart-title">Parallel Coordinates Chart</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
            style={{ cursor: 'default' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="axis"
              type="category"
              tick={{ fill: '#f2f2f2', fontSize: 14, fontWeight: 500 }}
              stroke="#f2f2f2"
              height={60}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fill: '#f2f2f2', fontSize: 12 }}
              stroke="#f2f2f2"
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            {speciesInfo.map((species) => {
              const strokeOpacity = hoveringDataKey && hoveringDataKey !== species.name ? 0.15 : 1
              return (
                <Line
                  key={species.name}
                  type="monotone"
                  dataKey={species.name}
                  stroke={species.color}
                  strokeOpacity={strokeOpacity}
                  strokeWidth={2}
                  dot={{ r: 3, fill: species.color }}
                  activeDot={false}
                  name={species.name}
                  connectNulls
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
        <div className="legend-container">
          {speciesInfo.map((species) => (
            <div
              key={species.name}
              className="legend-item"
              onMouseEnter={() => setHoveringDataKey(species.name)}
              onMouseLeave={() => setHoveringDataKey(null)}
            >
              <span
                className="legend-color"
                style={{ backgroundColor: species.color }}
              ></span>
              <span className="legend-label">{species.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
