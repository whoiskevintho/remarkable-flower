import React, { useMemo, useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { flowerSizeLatitudeData } from '../config/flowerSizeLatitudeData'
import './FlowerSizeLatitudeChart.css'

// Custom shape component for bars that span from latitudeMin to latitudeMax
// For vertical bars: Y-axis is latitude, bars extend vertically from min to max
const CustomBar = (props) => {
  const { payload, x, y, width, height } = props
  
  // Get flower color from payload
  const flowerColor = payload?.flowerColor ?? '#888888'
  
  // For vertical bar chart (default layout):
  // - x: left edge of the category space (species position)
  // - y: bottom of the bar (this is calculated by Recharts based on latitudeMin + latitudeRange)
  // - width: the barSize value - this is the bar thickness (horizontal)
  // - height: the bar height (calculated by Recharts based on latitudeRange)
  
  // The stacked bar approach means:
  // - First bar (invisible) positions us at latitudeMin
  // - Second bar (visible) extends from there by latitudeRange
  // So y is already at the correct position, and height is the range
  
  const barThickness = 40
  const barX = x + (width - barThickness) / 2
  const barWidth = barThickness
  const barY = y
  const barHeight = height || 0
  
  // Only render if we have valid dimensions
  if (barHeight <= 0 || barWidth <= 0) {
    return null
  }
  
  return (
    <rect
      x={barX}
      y={barY}
      width={barWidth}
      height={barHeight}
      fill={flowerColor}
      stroke={flowerColor}
      strokeWidth={1.5}
      rx={3}
      ry={3}
    />
  )
}

export default function FlowerSizeLatitudeChart() {
  // Track viewport height for responsive chart sizing
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Transform data for the chart
  // We need to structure it so bars span from latitudeMin to latitudeMax
  // Using stacked bars: 
  // - First invisible bar: from 0 to latitudeMin (absolute value)
  // - Second visible bar: from latitudeMin to latitudeMax (the range)
  // Recharts will position the stack total at the correct Y position
  const chartData = useMemo(() => {
    return flowerSizeLatitudeData.map(item => ({
      species: item.species,
      latitudeMin: item.latitudeMin,
      latitudeMax: item.latitudeMax,
      // First stack: invisible bar from 0 to latitudeMin (absolute value)
      // This positions the visible bar starting at latitudeMin
      latitudeMinStack: item.latitudeMin,
      // Second stack: visible bar from latitudeMin to latitudeMax
      latitudeRange: item.latitudeMax - item.latitudeMin,
      flowerColor: item.flowerColor
    }))
  }, [])

  // Calculate responsive chart height based on viewport with minimum
  const chartHeight = useMemo(() => {
    const minHeight = chartData.length * 50
    const viewportBasedHeight = viewportHeight * 0.6
    return Math.max(minHeight, viewportBasedHeight)
  }, [chartData.length, viewportHeight])

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="flower-tooltip">
          <p className="tooltip-species">{data.species}</p>
          <p className="tooltip-info">Latitude Range: {data.latitudeMin}°N - {data.latitudeMax}°N</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flower-chart-container">
      <h2 className="flower-chart-title">Latitude Range by Species</h2>
      <p className="flower-chart-subtitle">
        Bar color represents flower color
      </p>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.5)" />
          <XAxis 
            type="category"
            dataKey="species"
            stroke="#f2f2f2"
            tick={{ fontSize: 12, fill: '#f2f2f2' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            type="number"
            domain={[0, 80]}
            stroke="#f2f2f2"
            tick={{ fill: '#f2f2f2' }}
            tickCount={9}
            allowDecimals={false}
            label={{ 
              value: 'Latitude (°N)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#f2f2f2' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Invisible bar from 0 to latitudeMin (positions the visible bar) */}
          <Bar dataKey="latitudeMinStack" stackId="a" fill="transparent" />
          {/* Visible bar with custom shape for latitude range (latitudeMin to latitudeMax) */}
          <Bar 
            dataKey="latitudeRange" 
            stackId="a"
            barSize={40}
            barCategoryGap="20%"
            shape={CustomBar}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
