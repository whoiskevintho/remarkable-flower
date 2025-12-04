import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import './Cladogram.css'
import { cladogramData } from '../config/cladogramData'

const MARGIN = { top: 60, right: 200, bottom: 60, left: 60 }
const HEIGHT_SCALE = 0.5
const STROKE_COLOR = '#f2f2f2'

export default function Cladogram() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth - 64,
          height: (containerRef.current.clientHeight - 64) * HEIGHT_SCALE
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const boundsWidth = dimensions.width - MARGIN.right - MARGIN.left
  const boundsHeight = dimensions.height - MARGIN.top - MARGIN.bottom

  const dendrogram = useMemo(() => {
    if (boundsWidth <= 0 || boundsHeight <= 0) return null
    
    const hierarchy = d3.hierarchy(cladogramData)
    const dendrogram = d3.cluster().size([boundsHeight, boundsWidth])(hierarchy)
    
    // Evenly space leaf nodes
    const leaves = dendrogram.leaves()
    const spacing = leaves.length > 1 ? boundsHeight / (leaves.length - 1) : 0
    leaves.forEach((leaf, i) => { leaf.x = i * spacing })
    
    // Recalculate internal node positions
    dendrogram.eachAfter(node => {
      if (node.children) {
        node.x = d3.mean(node.children, d => d.x) || 0
      }
    })
    
    return dendrogram
  }, [boundsWidth, boundsHeight])

  useEffect(() => {
    if (!svgRef.current || !dendrogram || dimensions.width === 0 || dimensions.height === 0) return

    const svg = d3.select(svgRef.current)
    svg.attr('width', dimensions.width).attr('height', dimensions.height)
    svg.selectAll('*').remove()

    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)

    const linkGenerator = d3.linkHorizontal()

    // Draw links
    g.selectAll('path.link')
      .data(dendrogram.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', STROKE_COLOR)
      .attr('stroke-width', 2)
      .attr('d', d => linkGenerator({
        source: [d.source.y, d.source.x],
        target: [d.target.y, d.target.x]
      }))

    // Draw nodes
    const nodes = g.selectAll('g.node')
      .data(dendrogram.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y}, ${d.x})`)

    nodes.append('circle')
      .attr('r', 5)
      .attr('stroke', 'transparent')
      .attr('fill', STROKE_COLOR)

    nodes.filter(d => !d.children)
      .append('text')
      .attr('x', 15)
      .attr('fontSize', 14)
      .attr('textAnchor', 'left')
      .attr('alignmentBaseline', 'middle')
      .attr('fill', STROKE_COLOR)
      .text(d => d.data.name)

  }, [dendrogram, dimensions])

  return (
    <div className="cladogram-container">
      <h2 className="cladogram-title">Sarracenia Phylogeny</h2>
      <div className="cladogram-wrapper" ref={containerRef}>
        <svg ref={svgRef} className="cladogram-svg" />
      </div>
    </div>
  )
}

