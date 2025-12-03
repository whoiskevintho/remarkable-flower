import React, { useMemo, useState, useEffect } from 'react'
import { 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { petalSizes } from '../config/petalSizes'
import './PetalSizeRadarChart.css'

// Contrasting color palette for species visualization
const speciesColors = [
  '#E63946', // red
  '#00B4D8', // lightblue
  '#F1C40F', // yellow
  '#8E44AD', // purple
  '#FF6F91', // pink
  '#F39C12', // orange
  '#2ECC71', // green
  '#3F51B5', // darkblue
  '#00695C', // deepteal
  '#E040FB', // magenta
  '#FF1744', // bright red
  '#00E676', // bright green
  '#FF6D00', // deep orange
  '#651FFF'  // deep purple
]

export default function PetalSizeRadarChart() {
  const [normalize, setNormalize] = useState(false)

  // Calculate max values across all species for fixed axis scales
  const maxValues = useMemo(() => {
    return {
      A: Math.max(...petalSizes.map(s => s.A)),
      B: Math.max(...petalSizes.map(s => s.B)),
      C: Math.max(...petalSizes.map(s => s.C)),
      D: Math.max(...petalSizes.map(s => s.D)),
      E: Math.max(...petalSizes.map(s => s.E)),
      F: Math.max(...petalSizes.map(s => s.F))
    }
  }, [])

  // Calculate overall max for fixed domain (when not normalized)
  const overallMax = useMemo(() => {
    return Math.max(...Object.values(maxValues))
  }, [maxValues])

  // Transform data for a single species
  const getSpeciesData = (speciesData, index) => {
    const subjects = ['A', 'B', 'C', 'D', 'E', 'F']
    
    return subjects.map(subject => {
      const value = speciesData[subject]
      const normalizedValue = normalize 
        ? (value / maxValues[subject]) * 100 
        : value
      
      return {
        subject,
        value: normalizedValue,
        actualValue: value, // Keep actual value for tooltip
        fullMark: normalize ? 100 : overallMax
      }
    })
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="petal-tooltip">
          <p className="tooltip-measurement">Measurement {data.subject}</p>
          <p className="tooltip-value">
            {normalize 
              ? `${data.actualValue.toFixed(1)} mm (${data.value.toFixed(1)}%)`
              : `${data.actualValue} mm`
            }
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="petal-radar-chart-container">
      <h2 className="petal-radar-chart-title">Petal Size Measurements</h2>
      <p className="petal-radar-chart-subtitle">
        Dimensions A through F for all species
      </p>
      
      <div className="petal-radar-controls">
        <div className="control-group">
          <label className="control-label">
            <input
              type="checkbox"
              checked={normalize}
              onChange={(e) => setNormalize(e.target.checked)}
              className="normalize-checkbox"
            />
            Normalize to percentage
          </label>
        </div>
      </div>

      <div className="petal-radar-info">
        <p className="info-text">
          Showing all {petalSizes.length} species | 
          Measurements in <strong>{normalize ? 'percentage' : 'mm'}</strong>
        </p>
      </div>

      <div className="petal-radar-grid">
        {petalSizes.map((speciesData, index) => {
          const chartData = getSpeciesData(speciesData, index)
          const color = speciesColors[index % speciesColors.length]
          
          return (
            <div key={speciesData.species} className="petal-radar-chart-item">
              <h3 className="chart-species-title">{speciesData.species}</h3>
              <p className="chart-species-info">n = {speciesData.n}</p>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.3)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#f2f2f2', fontSize: 10 }}
                    stroke="#f2f2f2"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={normalize ? [0, 100] : [0, overallMax]}
                    tick={{ fill: '#f2f2f2', fontSize: 9 }}
                    stroke="#f2f2f2"
                    tickFormatter={(value) => normalize ? `${value}%` : `${value}`}
                  />
                  <Radar
                    name={speciesData.species}
                    dataKey="value"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}
