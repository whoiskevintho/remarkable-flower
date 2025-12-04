import React, { useMemo, useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts'
import { smellData } from '../config/smellData'
import './SmellStrengthChart.css'

export default function SmellStrengthChart() {
  // Track viewport height for responsive chart sizing
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Color mapping for scent types
  const scentColors = {
    watermelon: '#FF6B9D',
    sweet: '#C9A9DD',
    feline: '#FFC857',
    sweet_feline: '#FF964F'
  }

  // Emoji mapping for scent types (customize as needed)
  const scentEmojis = {
    watermelon: '🍉',
    sweet: '🌸',
    feline: '🐱',
    sweet_feline: '🐱/🌸'
  }

  // Transform data: one bar per species, colored by scent type
  const chartData = useMemo(() => {
    return smellData.map(item => {
      return {
        species: item.species,
        smellStrength: item.smellStrength,
        scentType: item.scentType,
        fill: scentColors[item.scentType] || '#999999',
        emoji: scentEmojis[item.scentType] || '🌿'
      }
    })
  }, [])

  // Calculate responsive chart height based on viewport with minimum
  const chartHeight = useMemo(() => {
    // Minimum height based on number of bars (ensures all bars are visible)
    const minHeight = chartData.length * 50
    // Responsive height based on viewport (60% of viewport height)
    const viewportBasedHeight = viewportHeight * 0.6
    // Use the larger of the two, ensuring minimum is always met
    return Math.max(minHeight, viewportBasedHeight)
  }, [chartData.length, viewportHeight])

  return (
    <div className="smell-chart-container">
      <h2 className="smell-chart-title">Species and Scent Type / Strength</h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.5)" />
          <XAxis 
            type="number" 
            stroke="#f2f2f2"
            tick={{ fill: '#f2f2f2' }}
            allowDecimals={true}
            domain={[0, 'auto']}
            label={{ 
              value: 'Smell Strength', 
              position: 'insideBottom', 
              offset: -5,
              style: { fill: '#f2f2f2' }
            }}
          />
          <YAxis 
            type="category" 
            dataKey="species" 
            width={140}
            tick={{ fontSize: 18, fill: '#f2f2f2' }}
            stroke="#f2f2f2"
          />
          {/* Single bar per species, colored by scent type */}
          <Bar 
            dataKey="smellStrength" 
            barSize={40}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList 
              dataKey="emoji" 
              position="center"
              style={{ fontSize: '24px', fill: '#fff' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Custom legend with color cubes and labels */}
      <div className="smell-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: scentColors.feline }}></span>
          <span className="legend-label">Feline</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: scentColors.sweet }}></span>
          <span className="legend-label">Sweet</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: scentColors.watermelon }}></span>
          <span className="legend-label">Watermelon</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: scentColors.sweet_feline }}></span>
          <span className="legend-label">Sweet/Feline</span>
        </div>
      </div>
    </div>
  )
}

