import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

function TagLine({ 
  startPoint,
  endPoint,
  scrollState,
  showStart = 0,
  showEnd = 1,
  fadeOutStart = 0.9,
  fadeOutEnd = 1,
  color = 'rgba(255, 255, 255, 0.5)',
  lineWidth = 2,
  shortenBy = 0.1 // Shorten line by 8% of distance
}) {
  const lineRef = useRef()
  const currentOpacityRef = useRef(0)
  
  // Configure material to always render on top (sprite-like behavior)
  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.renderOrder = 999
      if (lineRef.current.material) {
        lineRef.current.material.depthTest = false
        lineRef.current.material.depthWrite = false
      }
    }
  }, [])
  
  // Calculate shortened endpoint - move back from tag center towards model point
  const adjustedEndPoint = useMemo(() => {
    if (!startPoint || !endPoint) return [0, 0, 0]
    
    const start = new THREE.Vector3(...startPoint)
    const end = new THREE.Vector3(...endPoint)
    const direction = new THREE.Vector3().subVectors(end, start).normalize()
    const distance = start.distanceTo(end)
    
    // Move endpoint back by shortenBy percentage of the distance
    const shortenedDistance = distance * (1 - shortenBy)
    const adjusted = start.clone().add(direction.multiplyScalar(shortenedDistance))
    
    return adjusted.toArray()
  }, [startPoint, endPoint, shortenBy])
  
  const points = useMemo(() => {
    if (!startPoint || !adjustedEndPoint) return [[0, 0, 0], [0, 0, 0]]
    return [startPoint, adjustedEndPoint]
  }, [startPoint, adjustedEndPoint])
  
  useFrame(() => {
    if (!lineRef.current || !scrollState) return
    
    const progress = scrollState.progress
    let targetOpacity = 0
    
    if (progress >= showStart && progress <= fadeOutEnd) {
      if (progress < showEnd) {
        targetOpacity = (progress - showStart) / (showEnd - showStart)
      } else if (progress < fadeOutStart) {
        targetOpacity = 1
      } else {
        targetOpacity = 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart)
      }
    }
    
    // Smooth opacity transition
    const diff = targetOpacity - currentOpacityRef.current
    currentOpacityRef.current += diff * 0.15
    
    // Update material opacity
    if (lineRef.current.material) {
      lineRef.current.material.opacity = currentOpacityRef.current
    }
  })
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      transparent
      lineWidth={lineWidth}
      opacity={0}
      renderOrder={999}
    />
  )
}

export default TagLine

