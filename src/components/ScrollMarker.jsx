import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

function ScrollMarker({ 
  position = [0, 0, 0],
  children,
  scrollState,
  showStart = 0,
  showEnd = 1,
  fadeInDuration = 0.1,
  fadeOutStart = 0.9,
  fadeOutEnd = 1,
  minScale = 0.25,
  flip = 'none' // 'none', 'horizontal', 'vertical', or 'both'
}) {
  const containerRef = useRef(null)
  const currentScaleRef = useRef(0)
  const targetScaleRef = useRef(0)
  
  // Calculate target scale based on scroll progress
  const calculateScale = (progress) => {
    if (progress < showStart) {
      return minScale
    }
    
    if (progress < showEnd) {
      const fadeInEnd = showStart + (showEnd - showStart) * fadeInDuration
      if (progress < fadeInEnd) {
        const t = (progress - showStart) / (fadeInEnd - showStart)
        return minScale + (1 - minScale) * t
      }
      return 1
    }
    
    if (progress < fadeOutStart) {
      return 1
    }
    
    if (progress < fadeOutEnd) {
      const t = (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart)
      return 1 - (1 - minScale) * t
    }
    
    return minScale
  }
  
  // Update scale smoothly in useFrame
  useFrame(() => {
    if (!scrollState || !containerRef.current) return
    
    const targetScale = calculateScale(scrollState.progress)
    targetScaleRef.current = targetScale
    
    const diff = targetScale - currentScaleRef.current
    currentScaleRef.current += diff * 0.15
    
    const scale = currentScaleRef.current
    let scaleX = scale
    let scaleY = scale
    
    if (flip === 'horizontal' || flip === 'both') {
      scaleX = -scale
    }
    if (flip === 'vertical' || flip === 'both') {
      scaleY = -scale
    }
    
    containerRef.current.style.transform = `scale(${scaleX}, ${scaleY})`
    containerRef.current.style.opacity = scale > minScale + 0.01 ? 1 : 0
    containerRef.current.style.pointerEvents = scale > minScale + 0.01 ? 'auto' : 'none'
  })
  
  return (
    <Html
      position={position}
      transform
      center
      distanceFactor={1000}
    >
      <div
        ref={containerRef}
        style={{
          transform: `scale(${flip === 'horizontal' || flip === 'both' ? -minScale : minScale}, ${flip === 'vertical' || flip === 'both' ? -minScale : minScale})`,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s'
        }}
      >
        {children}
      </div>
    </Html>
  )
}

export default ScrollMarker

