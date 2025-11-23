import { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'

export default function PetalDiagram({ data, species }) {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const previousMeasurementsRef = useRef(null)
  const previousMeasurementLinesRef = useRef(null)
  
  // Scale factor to make measurements visible (8x multiplier)
  const SCALE_FACTOR = 8
  
  // Get current species or default to first
  const currentSpecies = species || (data ? Object.keys(data)[0] : null)
  const measurements = currentSpecies && data ? data[currentSpecies] : null
  
  // Calculate fixed viewBox that accommodates all species
  const fixedViewBox = useMemo(() => {
    if (!data) return { x: -100, y: -200, width: 1000, height: 400 }
    
    // Find max dimensions across all species
    let maxA = 0
    let maxB = 0
    let maxC = 0
    let maxD = 0
    
    Object.values(data).forEach(meas => {
      maxA = Math.max(maxA, meas.A || 0)
      maxB = Math.max(maxB, meas.B || 0)
      maxC = Math.max(maxC, meas.C || 0)
      maxD = Math.max(maxD, meas.D || 0)
    })
    
    const maxWidth = Math.max(maxB, maxC, maxD) * SCALE_FACTOR
    const maxLength = maxA * SCALE_FACTOR
    const padding = 100
    
    // Center the viewBox horizontally
    return {
      x: -maxLength / 2 - padding,
      y: -maxWidth / 2 - padding,
      width: maxLength + padding * 2,
      height: maxWidth + padding * 2
    }
  }, [data])
  
  // Helper function to generate path from measurements
  const generatePathFromMeasurements = (meas) => {
    if (!meas) return ''
    
    const { A, B, C, D, E, F } = meas
    const scale = SCALE_FACTOR
    
    // Scaled measurements
    const sA = A * scale
    const sB = B * scale
    const sC = C * scale
    const sD = D * scale
    const sE = E * scale
    const sF = F * scale
    
    // Center the petal horizontally (so it scales from center, not left)
    const centerOffset = -sA / 2
    
    // Key X positions (centered around x=0)
    const xLeft = centerOffset
    const xConstriction = centerOffset + sE  // Where D is measured
    const xRight = centerOffset + sA  // Total length
    
    // Measurement positions
    const xC = centerOffset + sE * 0.5  // C is at 50% of E
    const xB = centerOffset + sE + (sF * 0.7)  // B is at 70% along F
    
    // Flat edge calculation
    // Distance from C to D = sE - xC = sE - 0.5*sE = 0.5*sE
    // Flat edge starts at: xC - 0.5*sE = 0.5*sE - 0.5*sE = 0
    // But wait, let me reconsider...
    // Actually: flat edge is "to the right of C" and should be positioned
    // such that distance from flat edge start to C = distance from C to D
    const distCD = xConstriction - xC  // = 0.5*sE
    const xFlatStart = xC - distCD  // = 0 (left end)
    const flatEdgeLength = 0.75 * sC  // 3/4 of C's width
    const xFlatEnd = xFlatStart + flatEdgeLength
    
    // Rounded edge calculation (to right of B)
    // Radius based on B's width
    const roundRadius = sB * 0.5  // Half of B's width
    const xRoundStart = xB  // Start of rounded section
    const xRoundEnd = xRight  // End at tip
    
    // Y positions (centered around y=0)
    const yCenter = 0
    const yTopC = -sC / 2
    const yBottomC = sC / 2
    const yTopD = -sD / 2
    const yBottomD = sD / 2
    const yTopB = -sB / 2
    const yBottomB = sB / 2
    
    // Build path
    let path = `M ${xLeft} ${yCenter}`  // Start at left center
    
    // Left section: from left to flat edge
    path += ` L ${xFlatStart} ${yTopC}`
    
    // Flat edge (top)
    path += ` L ${xFlatEnd} ${yTopC}`
    
    // From flat edge to C measurement point (top)
    path += ` L ${xC} ${yTopC}`
    
    // From C to constriction (top) - tapering
    path += ` L ${xConstriction} ${yTopD}`
    
    // From constriction to B (top) - widening
    path += ` L ${xB} ${yTopB}`
    
    // Rounded edge (top) - using quadratic curve
    const roundControlX = xRoundStart + (xRoundEnd - xRoundStart) * 0.5
    const roundControlY = yTopB - roundRadius
    path += ` Q ${roundControlX} ${roundControlY} ${xRight} ${yCenter}`
    
    // Rounded edge (bottom) - mirror
    path += ` Q ${roundControlX} ${-roundControlY} ${xB} ${yBottomB}`
    
    // From B to constriction (bottom) - narrowing
    path += ` L ${xConstriction} ${yBottomD}`
    
    // From constriction to C (bottom) - widening
    path += ` L ${xC} ${yBottomC}`
    
    // From C to flat edge (bottom)
    path += ` L ${xFlatEnd} ${yBottomC}`
    
    // Flat edge (bottom)
    path += ` L ${xFlatStart} ${yBottomC}`
    
    // Back to start
    path += ` Z`
    
    return path
  }
  
  // Generate parametric petal path from measurements
  const petalPath = useMemo(() => {
    return generatePathFromMeasurements(measurements)
  }, [measurements])
  
  // Helper function to calculate measurement line positions from measurements
  const calculateMeasurementLines = (meas) => {
    if (!meas) return null
    
    const { A, B, C, D, E, F } = meas
    const scale = SCALE_FACTOR
    
    const sA = A * scale
    const sB = B * scale
    const sC = C * scale
    const sD = D * scale
    const sE = E * scale
    const sF = F * scale
    
    // Center the petal horizontally (same as path generation)
    const centerOffset = -sA / 2
    
    const xC = centerOffset + sE * 0.5
    const xB = centerOffset + sE + (sF * 0.7)
    const xConstriction = centerOffset + sE
    const yCenter = 0
    
    // Calculate bounding box for label positioning
    const maxWidth = Math.max(sB, sC, sD)
    const labelOffset = maxWidth * 0.6 + 30
    
    return {
      A: {
        type: 'horizontal',
        x1: centerOffset,
        y1: -maxWidth / 2 - 20,
        x2: centerOffset + sA,
        y2: -maxWidth / 2 - 20,
        labelX: centerOffset + sA / 2,
        labelY: -maxWidth / 2 - 35,
        value: A
      },
      B: {
        type: 'vertical',
        x1: xB,
        y1: -sB / 2,
        x2: xB,
        y2: sB / 2,
        labelX: xB + labelOffset,
        labelY: 0,
        value: B
      },
      C: {
        type: 'vertical',
        x1: xC,
        y1: -sC / 2,
        x2: xC,
        y2: sC / 2,
        labelX: xC + labelOffset,
        labelY: 0,
        value: C
      },
      D: {
        type: 'vertical',
        x1: xConstriction,
        y1: -sD / 2,
        x2: xConstriction,
        y2: sD / 2,
        labelX: xConstriction + labelOffset,
        labelY: 0,
        value: D
      },
      E: {
        type: 'horizontal',
        x1: centerOffset,
        y1: maxWidth / 2 + 20,
        x2: centerOffset + sE,
        y2: maxWidth / 2 + 20,
        labelX: centerOffset + sE / 2,
        labelY: maxWidth / 2 + 35,
        value: E
      },
      F: {
        type: 'horizontal',
        x1: xConstriction,
        y1: maxWidth / 2 + 20,
        x2: centerOffset + sA,
        y2: maxWidth / 2 + 20,
        labelX: xConstriction + sF / 2,
        labelY: maxWidth / 2 + 35,
        value: F
      }
    }
  }
  
  // Calculate measurement line positions
  const measurementLines = useMemo(() => {
    return calculateMeasurementLines(measurements)
  }, [measurements])
  
  // Animate path and lines when measurements change
  useEffect(() => {
    if (!svgRef.current || !pathRef.current || !measurementLines || !measurements) return
    
    const svg = d3.select(svgRef.current)
    const transition = d3.transition().duration(1200).ease(d3.easeCubicInOut)
    
    // Get previous measurements for interpolation
    const prevMeas = previousMeasurementsRef.current || measurements
    previousMeasurementsRef.current = measurements
    
    // Animate petal path using attrTween to interpolate measurements
    const pathElement = d3.select(pathRef.current)
    
    // Create interpolators for each measurement
    const interpolators = {
      A: d3.interpolateNumber(prevMeas.A, measurements.A),
      B: d3.interpolateNumber(prevMeas.B, measurements.B),
      C: d3.interpolateNumber(prevMeas.C, measurements.C),
      D: d3.interpolateNumber(prevMeas.D, measurements.D),
      E: d3.interpolateNumber(prevMeas.E, measurements.E),
      F: d3.interpolateNumber(prevMeas.F, measurements.F)
    }
    
    pathElement
      .transition(transition)
      .attrTween('d', function() {
        return function(t) {
          // Interpolate measurements at this point in the transition
          const interpMeas = {
            A: interpolators.A(t),
            B: interpolators.B(t),
            C: interpolators.C(t),
            D: interpolators.D(t),
            E: interpolators.E(t),
            F: interpolators.F(t)
          }
          // Generate path from interpolated measurements
          return generatePathFromMeasurements(interpMeas)
        }
      })
    
    // Get previous measurement lines for interpolation
    const prevLines = previousMeasurementLinesRef.current || measurementLines
    previousMeasurementLinesRef.current = measurementLines
    
    // Animate measurement lines with interpolation
    Object.keys(measurementLines).forEach(letter => {
      const line = measurementLines[letter]
      const prevLine = prevLines[letter]
      const group = svg.select(`[data-measurement="${letter}"]`)
      
      if (group.empty() || !prevLine) return
      
      // Create interpolators for line positions
      const x1Interp = d3.interpolateNumber(prevLine.x1, line.x1)
      const y1Interp = d3.interpolateNumber(prevLine.y1, line.y1)
      const x2Interp = d3.interpolateNumber(prevLine.x2, line.x2)
      const y2Interp = d3.interpolateNumber(prevLine.y2, line.y2)
      const labelXInterp = d3.interpolateNumber(prevLine.labelX, line.labelX)
      const labelYInterp = d3.interpolateNumber(prevLine.labelY, line.labelY)
      const valueInterp = d3.interpolateNumber(prevLine.value, line.value)
      
      // Animate main line with interpolation
      group.select('.measurement-line')
        .transition(transition)
        .attrTween('x1', () => x1Interp)
        .attrTween('y1', () => y1Interp)
        .attrTween('x2', () => x2Interp)
        .attrTween('y2', () => y2Interp)
      
      // Animate tick marks
      if (line.type === 'horizontal') {
        group.select('.tick-start')
          .transition(transition)
          .attrTween('x1', () => x1Interp)
          .attrTween('y1', (t) => y1Interp(t) - 5)
          .attrTween('x2', () => x1Interp)
          .attrTween('y2', (t) => y1Interp(t) + 5)
        
        group.select('.tick-end')
          .transition(transition)
          .attrTween('x1', () => x2Interp)
          .attrTween('y1', (t) => y2Interp(t) - 5)
          .attrTween('x2', () => x2Interp)
          .attrTween('y2', (t) => y2Interp(t) + 5)
      } else {
        group.select('.tick-start')
          .transition(transition)
          .attrTween('x1', (t) => x1Interp(t) - 5)
          .attrTween('y1', () => y1Interp)
          .attrTween('x2', (t) => x1Interp(t) + 5)
          .attrTween('y2', () => y1Interp)
        
        group.select('.tick-end')
          .transition(transition)
          .attrTween('x1', (t) => x2Interp(t) - 5)
          .attrTween('y1', () => y2Interp)
          .attrTween('x2', (t) => x2Interp(t) + 5)
          .attrTween('y2', () => y2Interp)
      }
      
      // Animate labels
      group.select('.label')
        .transition(transition)
        .attrTween('x', () => labelXInterp)
        .attrTween('y', () => labelYInterp)
      
      // Animate value with number interpolation
      group.select('.value')
        .transition(transition)
        .attrTween('x', () => labelXInterp)
        .attrTween('y', (t) => labelYInterp(t) + 15)
        .tween('text', function() {
          return function(t) {
            d3.select(this).text(Math.round(valueInterp(t)))
          }
        })
    })
  }, [petalPath, measurementLines, measurements])
  
  if (!data || !measurements) {
    return <div>No data available</div>
  }
  
  return (
    <svg 
      ref={svgRef}
      viewBox={`${fixedViewBox.x} ${fixedViewBox.y} ${fixedViewBox.width} ${fixedViewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="petal-diagram"
      style={{ width: '100%', maxWidth: '1200px', height: 'auto' }}
    >
      <g className="petal-outline">
        <path 
          ref={pathRef}
          d={petalPath}
          fill="none"
          stroke="#333"
          strokeWidth="3"
        />
      </g>
      
      {measurementLines && (
        <g className="measurements">
          {Object.keys(measurementLines).map(letter => {
            const line = measurementLines[letter]
            
            return (
              <g 
                key={letter} 
                className="measurement" 
                data-measurement={letter}
              >
                <line 
                  className="measurement-line" 
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#666"
                  strokeWidth="2"
                />
                {line.type === 'horizontal' ? (
                  <>
                    <line 
                      className="tick-mark tick-start" 
                      x1={line.x1}
                      y1={line.y1 - 5}
                      x2={line.x1}
                      y2={line.y1 + 5}
                      stroke="#666"
                      strokeWidth="1.5"
                    />
                    <line 
                      className="tick-mark tick-end" 
                      x1={line.x2}
                      y1={line.y2 - 5}
                      x2={line.x2}
                      y2={line.y2 + 5}
                      stroke="#666"
                      strokeWidth="1.5"
                    />
                  </>
                ) : (
                  <>
                    <line 
                      className="tick-mark tick-start" 
                      x1={line.x1 - 5}
                      y1={line.y1}
                      x2={line.x1 + 5}
                      y2={line.y1}
                      stroke="#666"
                      strokeWidth="1.5"
                    />
                    <line 
                      className="tick-mark tick-end" 
                      x1={line.x2 - 5}
                      y1={line.y2}
                      x2={line.x2 + 5}
                      y2={line.y2}
                      stroke="#666"
                      strokeWidth="1.5"
                    />
                  </>
                )}
                <text 
                  className="label"
                  x={line.labelX}
                  y={line.labelY}
                  fill="#333"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {letter}
                </text>
                <text 
                  className="value"
                  x={line.labelX}
                  y={line.labelY + 15}
                  fill="#666"
                  fontSize="14"
                  textAnchor="middle"
                >
                  {line.value}
                </text>
              </g>
            )
          })}
        </g>
      )}
    </svg>
  )
}

