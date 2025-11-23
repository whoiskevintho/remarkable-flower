import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { a, config, useSpring } from '@react-spring/three'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import './PetalsSection.css'

// Preload the model
useGLTF.preload('/petals_v001.glb')

// Morph target animation constants
const MORPH_START = 0.3
const MORPH_END = 0.7

// Model transform constants - CHANGE THESE TO ADJUST POSITION AND ROTATION
const MODEL_POSITION = [0, 0, 0] // [x, y, z] position
const MODEL_ROTATION = [Math.PI/2, Math.PI/2, 0] // [x, y, z] rotation in radians

function PetalsModel({ scale, scrollState, inViewport }) {
  const modelRef = useRef()
  const { scene } = useGLTF('/petals_v001.glb')
  
  const clonedScene = useMemo(() => scene?.clone() || null, [scene])
  const size = scale.xy.min() * 0.5

  // Calculate model bounding box for centering
  const modelBounds = useMemo(() => {
    if (!clonedScene) return null
    
    const box = new THREE.Box3()
    box.setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const dimensions = box.getSize(new THREE.Vector3())
    const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z)
    
    return { center, maxDimension }
  }, [clonedScene])
  
  // Calculate camera distance for proper framing
  const safeDistance = useMemo(() => {
    if (!modelBounds) return 10
    
    const distance = Math.max(size * 3, modelBounds.maxDimension * 2.5, 8)
    const aspectRatio = scale.xy.x / scale.xy.y
    
    // Adjust for portrait mode
    return aspectRatio < 1 
      ? distance * Math.pow(1 / aspectRatio, 0.7)
      : distance
  }, [modelBounds, size, scale])

  // Find mesh with morph targets
  const { mesh, morphIndex } = useMemo(() => {
    if (!clonedScene) return { mesh: null, morphIndex: null }
    
    let foundMesh = null
    clonedScene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary && !foundMesh) {
        foundMesh = child
      }
    })
    
    if (!foundMesh?.morphTargetDictionary) {
      console.warn('No mesh with morph targets found in petals_v001.glb')
      return { mesh: null, morphIndex: null }
    }
    
    const morphTargetNames = Object.keys(foundMesh.morphTargetDictionary)
    console.log('Available morph targets:', morphTargetNames)
    
    const index = foundMesh.morphTargetDictionary[morphTargetNames[0]]
    return { 
      mesh: foundMesh, 
      morphIndex: index ?? null 
    }
  }, [clonedScene])

  useFrame((state) => {
    if (!inViewport || !modelBounds) return
    
    // Update morph target influence
    if (mesh && morphIndex !== null) {
      const { progress } = scrollState
      let morphInfluence = 0
      
      if (progress >= MORPH_START) {
        morphInfluence = progress >= MORPH_END 
          ? 1 
          : (progress - MORPH_START) / (MORPH_END - MORPH_START)
      }
      
      mesh.morphTargetInfluences[morphIndex] = morphInfluence
    }
    
    // Center camera on model - update on every frame to handle resize
    state.camera.position.set(0, 0, safeDistance * 2)
    state.camera.lookAt(modelBounds.center)
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
      position={MODEL_POSITION}
      rotation={MODEL_ROTATION}
      scale={spring.scale}
    />
  )
}

export default function PetalsSection() {
  const el = useRef()
  
  return (
    <section className="petals-section">
      <div className="PetalsStickyContainer">
        <div ref={el} className="PetalsStickyContent Debug">
          <p>Petals section - sticky tracked element.</p>
        </div>
      </div>
      <UseCanvas>
        <StickyScrollScene track={el}>
          {(props) => (
            <>
              <Environment preset="apartment" />
              <PetalsModel {...props} />
            </>
          )}
        </StickyScrollScene>
      </UseCanvas>
    </section>
  )
}

