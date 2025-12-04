import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import './Cladogram.css'
import { cladogramData } from '../config/cladogramData'
import ImageModal from './ImageModal'

const MARGIN = { top: 60, right: 200, bottom: 60, left: 60 }
const STROKE_COLOR = '#f2f2f2'

// Available images from public/images folder
const AVAILABLE_IMAGES = [
  'alata_alancressler.webp',
  'darlingtonia_bradwilson.webp',
  'flava_brucesorrie.webp',
  'flava_willstuart.webp',
  'leucophylla_alancressler.webp',
  'leucophylla_white_alancressler.webp',
  'minor_alancressler.webp',
  'oreophila_alancressler.webp',
  'psittacina_scottward.webp',
  'purpurea_purple_mikewang.webp',
  'purpureapurpurea_smithrw.webp',
  'purpureavenosa_alancressler.webp',
  'rosea_alancressler.webp',
  'rubra_sheridan_mikewang.webp',
  'rubraalabamensis_alancressler.webp',
  'rubragulfensis_billboothe.webp',
  'rubrajonesii_alancressler.webp',
  'rubrarubra_alancressler.webp',
  'rubrawherryi_alancressler.webp'
]

// Helper function to match species name to image filename
const matchSpeciesToImage = (speciesName) => {
  const normalized = speciesName.toLowerCase()
    .replace(/^s\.\s*/, '')
    .replace(/\s+ssp\.\s+/g, '')
    .replace(/\s+/g, '')
    .replace(/alabemensis/g, 'alabamensis')
  
  const match = AVAILABLE_IMAGES.find(img => {
    const imgName = img.toLowerCase().replace(/_/g, '').replace('.webp', '')
    return imgName.includes(normalized) || normalized.includes(imgName.split('_')[0])
  })
  
  return match || AVAILABLE_IMAGES[Math.floor(Math.random() * AVAILABLE_IMAGES.length)]
}

export default function Cladogram() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [hoveredSpecies, setHoveredSpecies] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const padding = 64 // 2rem * 2 (left + right)
        const width = Math.max(800, Math.min(1400, rect.width - padding))
        const height = Math.max(300, Math.min(600, rect.height))
        setDimensions({ width, height })
      }
    }
    
    updateDimensions()
    
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    window.addEventListener('resize', updateDimensions)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const boundsWidth = dimensions.width - MARGIN.right - MARGIN.left
  const boundsHeight = dimensions.height - MARGIN.top - MARGIN.bottom

  // Extract all species names from cladogram
  const speciesNames = useMemo(() => {
    const hierarchy = d3.hierarchy(cladogramData)
    return hierarchy.leaves().map(leaf => leaf.data.name)
  }, [])

  // Create image mapping for species
  const imageMapping = useMemo(() => {
    return speciesNames.map(speciesName => ({
      speciesName,
      imagePath: `/images/${matchSpeciesToImage(speciesName)}`
    }))
  }, [speciesNames])

  // Split images into top and bottom rows
  const topImages = useMemo(() => imageMapping.slice(0, 7), [imageMapping])
  const bottomImages = useMemo(() => imageMapping.slice(7, 14), [imageMapping])

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
    svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
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
      .attr('class', d => `species-label species-${d.data.name.replace(/\s+/g, '-').toLowerCase()}`)
      .text(d => d.data.name)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function(event, d) {
        setHoveredSpecies(d.data.name)
      })
      .on('mouseleave', function() {
        setHoveredSpecies(null)
      })

  }, [dendrogram, dimensions])

  const handleImageHover = (speciesName) => {
    setHoveredSpecies(speciesName)
  }

  const handleImageLeave = () => {
    setHoveredSpecies(null)
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  // Update SVG highlighting when hoveredSpecies changes
  useEffect(() => {
    if (!svgRef.current || !dendrogram) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('text.species-label')
      .attr('fill', function() {
        const speciesName = d3.select(this).text()
        return hoveredSpecies === speciesName ? '#FFD700' : STROKE_COLOR
      })
      .attr('font-weight', function() {
        const speciesName = d3.select(this).text()
        return hoveredSpecies === speciesName ? 'bold' : 'normal'
      })
  }, [hoveredSpecies, dendrogram])

  return (
    <div className="cladogram-container">
      <h2 className="cladogram-title">Sarracenia Cladogram</h2>
      
      {/* Top image row */}
      <div className="cladogram-images-row cladogram-images-top">
        {topImages.map((item, index) => (
          <div
            key={index}
            className={`cladogram-image-item ${hoveredSpecies === item.speciesName ? 'highlighted' : ''}`}
            onMouseEnter={() => handleImageHover(item.speciesName)}
            onMouseLeave={handleImageLeave}
            onClick={() => handleImageClick({ src: item.imagePath, caption: item.speciesName })}
          >
            <img
              src={item.imagePath}
              alt={item.speciesName}
              className="cladogram-thumbnail"
            />
          </div>
        ))}
      </div>

      <div className="cladogram-wrapper" ref={containerRef}>
        <svg ref={svgRef} className="cladogram-svg" />
      </div>

      {/* Bottom image row */}
      <div className="cladogram-images-row cladogram-images-bottom">
        {bottomImages.map((item, index) => (
          <div
            key={index}
            className={`cladogram-image-item ${hoveredSpecies === item.speciesName ? 'highlighted' : ''}`}
            onMouseEnter={() => handleImageHover(item.speciesName)}
            onMouseLeave={handleImageLeave}
            onClick={() => handleImageClick({ src: item.imagePath, caption: item.speciesName })}
          >
            <img
              src={item.imagePath}
              alt={item.speciesName}
              className="cladogram-thumbnail"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={handleCloseModal}
          imageSrc={selectedImage.src}
          caption={selectedImage.caption}
        />
      )}
    </div>
  )
}

