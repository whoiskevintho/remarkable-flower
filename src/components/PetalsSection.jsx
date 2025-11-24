import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { a, config, useSpring } from '@react-spring/three'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import ScrollyTextContainer from './ScrollyTextContainer'
import { useFadeOut } from '../hooks/useFadeOut'
import './PetalsSection.css'

// Preload the model
useGLTF.preload('/petals_v001.glb')

// Morph target animation constants
const FLAVA_MORPH_START = 0.2
const FLAVA_MORPH_END = 0.3
const PSITTACINA_MORPH_START = 0.4
const PSITTACINA_MORPH_END = 0.5

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

  // Find mesh with morph targets and get indices for Flava and Psittacina
  const { mesh, flavaIndex, psittacinaIndex } = useMemo(() => {
    if (!clonedScene) return { mesh: null, flavaIndex: null, psittacinaIndex: null }
    
    let foundMesh = null
    clonedScene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary && !foundMesh) {
        foundMesh = child
      }
    })
    
    if (!foundMesh?.morphTargetDictionary) {
      console.warn('No mesh with morph targets found in petals_v001.glb')
      return { mesh: null, flavaIndex: null, psittacinaIndex: null }
    }
    
    const morphTargetNames = Object.keys(foundMesh.morphTargetDictionary)
    console.log('Available morph targets:', morphTargetNames)
    
    const flavaIdx = foundMesh.morphTargetDictionary['Flava'] ?? null
    const psittacinaIdx = foundMesh.morphTargetDictionary['Psittacina'] ?? null
    
    if (flavaIdx === null) {
      console.warn('Flava morph target not found')
    }
    if (psittacinaIdx === null) {
      console.warn('Psittacina morph target not found')
    }
    
    return { 
      mesh: foundMesh, 
      flavaIndex: flavaIdx,
      psittacinaIndex: psittacinaIdx
    }
  }, [clonedScene])

  useFrame((state) => {
    if (!inViewport || !modelBounds) return
    
    const { progress } = scrollState
    
    // Calculate Psittacina influence first (needed for Flava calculation)
    let psittacinaInfluence = 0
    if (mesh && psittacinaIndex !== null) {
      if (progress >= PSITTACINA_MORPH_START) {
        psittacinaInfluence = progress >= PSITTACINA_MORPH_END 
          ? 1 
          : (progress - PSITTACINA_MORPH_START) / (PSITTACINA_MORPH_END - PSITTACINA_MORPH_START)
      }
      
      mesh.morphTargetInfluences[psittacinaIndex] = psittacinaInfluence
    }
    
    // Update Flava morph target influence
    // Flava increases 0.2-0.4, stays at 1 from 0.4-0.6, then decreases to 0 as Psittacina increases 0.6-0.8
    if (mesh && flavaIndex !== null) {
      let flavaInfluence = 0
      
      if (progress >= FLAVA_MORPH_START) {
        if (progress < FLAVA_MORPH_END) {
          // Increasing phase: 0.2 to 0.4
          flavaInfluence = (progress - FLAVA_MORPH_START) / (FLAVA_MORPH_END - FLAVA_MORPH_START)
        } else if (progress < PSITTACINA_MORPH_START) {
          // Hold phase: 0.4 to 0.6 - stay at 1
          flavaInfluence = 1
        } else {
          // Decreasing phase: 0.6 to 0.8 - decrease inversely to Psittacina
          flavaInfluence = 1 - psittacinaInfluence
        }
      }
      
      mesh.morphTargetInfluences[flavaIndex] = flavaInfluence
    }
    
    // Center camera on model - update on every frame to handle resize
    state.camera.position.set(0, 0, safeDistance * 2)
    state.camera.lookAt(modelBounds.center)
  })

  const spring = useSpring({
    from: { scale: 0 },
    scale: inViewport ? size : 0,
    config: inViewport ? config.wobbly : config.slow
  })

  // Fade out the model as scroll progresses
  useFadeOut(scrollState, { fadeStart: 0.95, fadeEnd: 1.0 }, modelRef)

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
  
  const textBoxes = [
    {
      id: 1,
      text: 'The petal of the S. Flava is long and narrow'
    },
    {
      id: 2,
      text: 'While the petal of the S. Psittacina is much smaller'
    },
  ]
  
  const positions = ['3%', '30%']
  
  const handleButtonClick = (variety) => {
    console.log(`Selected variety: ${variety}`)
    // Add your button click handler logic here
  }
  
  return (
    <section className="petals-section">
      <div className="PetalsStickyContainer">
        <div ref={el} className="PetalsStickyContent Debug">
          <p>Petals section - sticky tracked element.</p>
        </div>
        <ScrollyTextContainer textBoxes={textBoxes} positions={positions} />
        
        {/* Spacer to control when buttons appear - adjust height to control scroll position */}
        <div className="PetalsButtonsSpacer" />
        
        {/* New: Buttons and Dialogue Container - scrolls up then sticks */}
        <div className="PetalsButtonsContainer">
          <div className="PetalsDialogue">
            <p>Explore more varieties in Sarracenia flower petals</p>
          </div>
          <div className="PetalsButtons">
            <button 
              className="PetalsButton"
              onClick={() => handleButtonClick('previous')}
              aria-label="Previous variety"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="PetalsButtonIcon">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button 
              className="PetalsButton"
              onClick={() => handleButtonClick('next')}
              aria-label="Next variety"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="PetalsButtonIcon">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
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

