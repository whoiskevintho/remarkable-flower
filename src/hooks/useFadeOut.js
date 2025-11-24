import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Reusable hook to fade out GLB models based on scroll progress
 * @param {Object} scrollState - Scroll state from StickyScrollScene with progress (0-1)
 * @param {Object} options - Configuration options
 * @param {number} options.fadeStart - Scroll progress (0-1) when fade starts (default: 0.7)
 * @param {number} options.fadeEnd - Scroll progress (0-1) when fade completes (default: 1.0)
 * @param {React.Ref} sceneRef - Ref to the scene/primitive object to fade
 * @returns {number} Opacity value (0-1)
 */
export function useFadeOut(scrollState, { fadeStart = 0.7, fadeEnd = 1.0 } = {}, sceneRef) {
  const opacityRef = useRef(1)
  
  // Calculate opacity based on scroll progress
  useFrame(() => {
    const { progress } = scrollState
    
    let opacity = 1
    if (progress >= fadeStart) {
      if (progress >= fadeEnd) {
        opacity = 0
      } else {
        // Linear interpolation between fadeStart and fadeEnd
        opacity = 1 - (progress - fadeStart) / (fadeEnd - fadeStart)
      }
    }
    
    opacityRef.current = opacity
    
    // Apply opacity to all materials in the scene if ref is provided
    if (sceneRef?.current) {
      sceneRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((material) => {
            material.opacity = opacity
            material.transparent = opacity < 1
          })
        }
      })
    }
  })
  
  return opacityRef.current
}

