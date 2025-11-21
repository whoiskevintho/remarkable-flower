import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { a, config, useSpring } from '@react-spring/three'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'

// Preload the model
useGLTF.preload('/flower_v001.glb')

function SpinningModel({ scale, scrollState, inViewport }) {
  const modelRef = useRef()
  const { scene } = useGLTF('/flower_v001.glb')
  const clonedScene = useMemo(() => {
    if (!scene) return null
    return scene.clone()
  }, [scene])
  const size = scale.xy.min() * 0.5
  
  // Reusable vector for current position calculation
  const currentPosition = useRef(new THREE.Vector3())

  // Calculate model bounding box to determine its actual size
  const modelBounds = useMemo(() => {
    if (!clonedScene) return null
    
    const box = new THREE.Box3()
    box.setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z)
    
    // Log model dimensions (check browser console to see actual size)
    console.log('Model bounding box (unscaled):', {
      center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
      size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) },
      maxDimension: maxDimension.toFixed(2)
    })
    
    return { center, size, maxDimension }
  }, [clonedScene])
  
  // Define three camera positions (created once, reused every frame)
  // Using model bounds to set appropriate distances that account for model size
  const cameraPositions = useMemo(() => {
    // Calculate safe distance based on model size
    // The model is scaled by 'size', so we need to account for both base size and scale
    let safeDistance = 10 // Default fallback
    
    if (modelBounds) {
      // Model's base max dimension
      const baseMaxDim = modelBounds.maxDimension
      // Account for the scale being applied (size)
      // The effective model size will be: baseMaxDim * (size / baseMaxDim) = size
      // So we use size directly, but add a multiplier for safety
      safeDistance = Math.max(size * 3, baseMaxDim * 2.5, 8)
      
      console.log('Camera distance calculation:', {
        baseMaxDimension: baseMaxDim.toFixed(2),
        modelScale: size.toFixed(2),
        safeDistance: safeDistance.toFixed(2)
      })
    }
    
    return {
      start: new THREE.Vector3(0, safeDistance * 0.5, safeDistance * 0.5),   // Start position
      middle: new THREE.Vector3(-safeDistance * 0.8, safeDistance * 0.5, safeDistance * 0.8),   // Middle position
      end: new THREE.Vector3(0, safeDistance * 0.2, safeDistance * 1.2)        // End position
    }
  }, [modelBounds, size])

  // Find mesh and morph target index once
  const { mesh, morphIndex } = useMemo(() => {
    if (!clonedScene) return { mesh: null, morphIndex: null }
    
    const foundMesh = clonedScene.getObjectByName('top_petal')
    if (!foundMesh || !foundMesh.morphTargetDictionary) {
      return { mesh: null, morphIndex: null }
    }
    
    const index = foundMesh.morphTargetDictionary['blend_001']
    return { 
      mesh: foundMesh, 
      morphIndex: index !== undefined ? index : null 
    }
  }, [clonedScene])

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollState.progress * Math.PI * 2
    }
    
    // Update morph target based on scroll progress
    if (mesh && morphIndex !== null) {
      // Map scroll progress (0-1) to morph influence (0-1)
      // Adjust these values to control when morph starts/ends
      const morphStart = 0.75  // Start morphing at 30% scroll
      const morphEnd = 0.8     // Complete morph at 70% scroll
      
      let morphInfluence = 0
      if (scrollState.progress >= morphStart) {
        if (scrollState.progress >= morphEnd) {
          morphInfluence = 1
        } else {
          // Linear interpolation between start and end
          morphInfluence = (scrollState.progress - morphStart) / (morphEnd - morphStart)
        }
      }
      
      mesh.morphTargetInfluences[morphIndex] = morphInfluence
    }
    
    // Interpolate camera between three positions based on scroll progress
    const progress = scrollState.progress // 0 to 1
    
    if (progress <= 0.5) {
      // First half: interpolate from start to middle
      const t = progress * 2 // Map 0-0.5 to 0-1
      currentPosition.current.lerpVectors(cameraPositions.start, cameraPositions.middle, t)
    } else {
      // Second half: interpolate from middle to end
      const t = (progress - 0.5) * 2 // Map 0.5-1 to 0-1
      currentPosition.current.lerpVectors(cameraPositions.middle, cameraPositions.end, t)
    }
    
    state.camera.position.copy(currentPosition.current)
    state.camera.lookAt(0, 0, 0) // Look at model center
  })

  const spring = useSpring({
    scale: inViewport ? size : size * 0.0,
    config: inViewport ? config.wobbly : config.stiff
  })

  if (!clonedScene) return null

  return (
    <a.primitive 
      ref={modelRef} 
      object={clonedScene} 
      scale={spring.scale}
    />
  )
}

export default function StickySection() {
  const el = useRef()
  return (
    <section>
      <div className="StickyContainer">
        <div ref={el} className="SomeStickyContent Debug">
          <p>This element is position:sticky and will be tracked.</p>
        </div>
      </div>
      <UseCanvas>
        <StickyScrollScene track={el}>
          {(props) => (
            <>
              <Environment preset="apartment" />
              <SpinningModel {...props} />
            </>
          )}
        </StickyScrollScene>
      </UseCanvas>
    </section>
  )
}

