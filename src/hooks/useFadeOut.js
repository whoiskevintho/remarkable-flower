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
      const processedMaterials = new Set() // Track processed materials to avoid duplicate updates
      
      sceneRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((material) => {
            if (material && !processedMaterials.has(material)) {
              processedMaterials.add(material)
              
              // Handle shader materials with opacity uniform
              if (material.uniforms && material.uniforms.uOpacity !== undefined) {
                material.uniforms.uOpacity.value = opacity
              } else if (material.uniforms && material.uniforms.opacity !== undefined) {
                material.uniforms.opacity.value = opacity
              } else {
                // Standard material opacity - always update
                const previousOpacity = material.opacity
                material.opacity = opacity
                
                // Set transparent flag - needed for opacity < 1 to work
                const wasTransparent = material.transparent
                material.transparent = opacity < 1
                
                // Force material update if transparency state changed or opacity changed
                if (wasTransparent !== material.transparent || previousOpacity !== opacity) {
                  material.needsUpdate = true
                }
              }
            }
          })
          
          // Handle dual-sided back meshes
          if (child.userData?.dualSidedBackMesh) {
            const backMesh = child.userData.dualSidedBackMesh
            if (backMesh.material) {
              const backMaterials = Array.isArray(backMesh.material) ? backMesh.material : [backMesh.material]
              backMaterials.forEach((material) => {
                if (material && !processedMaterials.has(material)) {
                  processedMaterials.add(material)
                  
                  if (material.uniforms && material.uniforms.uOpacity !== undefined) {
                    material.uniforms.uOpacity.value = opacity
                  } else if (material.uniforms && material.uniforms.opacity !== undefined) {
                    material.uniforms.opacity.value = opacity
                  } else {
                    // Standard material opacity - always update
                    const previousOpacity = material.opacity
                    material.opacity = opacity
                    
                    // Set transparent flag - needed for opacity < 1 to work
                    const wasTransparent = material.transparent
                    material.transparent = opacity < 1
                    
                    // Force material update if transparency state changed or opacity changed
                    if (wasTransparent !== material.transparent || previousOpacity !== opacity) {
                      material.needsUpdate = true
                    }
                  }
                }
              })
            }
          }
        }
      })
    }
  })
  
  return opacityRef.current
}

