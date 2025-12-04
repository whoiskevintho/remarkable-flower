import React, { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import { flowerSizeLatitudeData } from '../config/flowerSizeLatitudeData'
import './ParallelCoordinatesChart.css'

// Default color palette
const defaultColors = [
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

// Create a map of species names to flower colors
const flowerColorMap = new Map()
flowerSizeLatitudeData.forEach(item => {
  flowerColorMap.set(item.species, item.flowerColor)
})

export default function ParallelCoordinatesChart({ data = [] }) {
  const [hoveringDataKey, setHoveringDataKey] = useState(null)
  const [currentPalette, setCurrentPalette] = useState('petal color')

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
    return data.map((species, index) => {
      const speciesName = species.name || species.species || `Species ${index + 1}`
      let color
      
      if (currentPalette === 'petal color') {
        // Use the actual flower color for this species, or fallback to default
        color = flowerColorMap.get(speciesName) || defaultColors[index % defaultColors.length]
      } else {
        // Use default color palette
        color = defaultColors[index % defaultColors.length]
      }
      
      return {
        name: speciesName,
        color
      }
    })
  }, [data, currentPalette])

  const handleMouseEnter = (payload) => setHoveringDataKey(payload.dataKey)
  const handleMouseLeave = () => setHoveringDataKey(null)

  if (!data || data.length === 0) {
    return (
      <div className="parallel-chart-container">
        <p className="no-data-message">No data available</p>
      </div>
    )
  }

  const handlePaletteChange = () => {
    setCurrentPalette(currentPalette === 'default' ? 'petal color' : 'default')
  }

  const buttonLabel = currentPalette === 'petal color' 
    ? 'Show Separate Colors' 
    : 'Show Petal Colors'

  return (
    <div className="parallel-chart-container">
      <div className="chart-header">
        <h2 className="parallel-chart-title">Parallel Coordinates Plot for <i>Sarracenia</i> Petals</h2>
        <button 
          className="color-scheme-button"
          onClick={handlePaletteChange}
          title="Change color scheme"
        >
          <span className="color-scheme-icon">🎨</span>
          <span className="color-scheme-label">{buttonLabel}</span>
        </button>
      </div>
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
              type="number"
              tick={{ fill: '#f2f2f2', fontSize: 12 }}
              stroke="#f2f2f2"
              tickFormatter={(value) => `${(value * 100).toFixed(0)}`}
              allowDataOverflow={false}
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
