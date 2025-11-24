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

// ============================================================================
// MORPH TARGET CONFIGURATION
// ============================================================================
// Change these to use different morph targets from your GLB model
// Check the console for available morph target names when the component loads
const FIRST_MORPH_TARGET_NAME = 'Flava'      // First morph target to animate
const SECOND_MORPH_TARGET_NAME = 'RubraSspRubra' // Second morph target to animate

// Animation timing constants (0.0 to 1.0 based on scroll progress)
const FIRST_MORPH_START = 0.2   // When first morph starts increasing
const FIRST_MORPH_END = 0.3      // When first morph reaches full influence
const SECOND_MORPH_START = 0.4   // When second morph starts increasing
const SECOND_MORPH_END = 0.5     // When second morph reaches full influence
// ============================================================================

// ============================================================================
// MORPH TARGET STATE - Module-level shared state for cross-context communication
// ============================================================================
const morphStateRef = { 
  current: { 
    activeIndex: 0,        // Start with first morph target (index 0)
    maxIndex: 0,           // Will be set when mesh is initialized
    useButtonMode: false,  // false = scroll mode, true = button mode
    firstMorphIndex: null, // Index of FIRST_MORPH_TARGET_NAME
    secondMorphIndex: null // Index of SECOND_MORPH_TARGET_NAME
  } 
}
const LERP_SPEED = 0.08 // Controls smoothness of morph transitions

// Model transform constants - CHANGE THESE TO ADJUST POSITION AND ROTATION
const MODEL_POSITION = [0, 0, 0] // [x, y, z] position
const MODEL_ROTATION = [Math.PI/2, Math.PI/2, 0] // [x, y, z] rotation in radians

function PetalsModel({ scale, scrollState, inViewport }) {
  const modelRef = useRef()
  const meshRef = useRef(null) // Ref to store the actual rendered mesh
  const morphNamesRef = useRef([]) // Ref to store morph target names
  const initializedRef = useRef(false) // Track if we've found the mesh
  
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

  useFrame((state) => {
    if (!inViewport || !modelBounds) return
    
    // Find mesh with morph targets from the rendered model (first frame only)
    if (!initializedRef.current && modelRef.current) {
      let foundMesh = null
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.morphTargetDictionary && !foundMesh) {
          foundMesh = child
        }
      })
      
      if (foundMesh?.morphTargetDictionary) {
        meshRef.current = foundMesh
        morphNamesRef.current = Object.keys(foundMesh.morphTargetDictionary)
        console.log('Available morph targets:', morphNamesRef.current)
        
        // Store indices for scroll-based morph targets
        morphStateRef.current.firstMorphIndex = foundMesh.morphTargetDictionary[FIRST_MORPH_TARGET_NAME] ?? null
        morphStateRef.current.secondMorphIndex = foundMesh.morphTargetDictionary[SECOND_MORPH_TARGET_NAME] ?? null
        
        if (morphStateRef.current.firstMorphIndex === null) {
          console.warn(`Morph target "${FIRST_MORPH_TARGET_NAME}" not found. Available targets:`, morphNamesRef.current)
        }
        if (morphStateRef.current.secondMorphIndex === null) {
          console.warn(`Morph target "${SECOND_MORPH_TARGET_NAME}" not found. Available targets:`, morphNamesRef.current)
        }
        
        // Store max index in shared state for button handlers
        if (foundMesh.morphTargetInfluences) {
          morphStateRef.current.maxIndex = foundMesh.morphTargetInfluences.length - 1
          // Initialize all morph targets to 0
          for (let i = 0; i < foundMesh.morphTargetInfluences.length; i++) {
            foundMesh.morphTargetInfluences[i] = 0
          }
        }
        
        initializedRef.current = true
      }
    }
    
    // Apply morph target influences based on mode
    if (meshRef.current && meshRef.current.morphTargetInfluences) {
      const { useButtonMode, firstMorphIndex, secondMorphIndex, activeIndex } = morphStateRef.current
      
      if (useButtonMode) {
        // BUTTON MODE: Lerp morph target influences - active one toward 1, all others toward 0
        const influences = meshRef.current.morphTargetInfluences
        const maxIndex = influences.length - 1
        
        // Clamp activeIndex to valid range
        let clampedIndex = activeIndex
        if (clampedIndex < 0) {
          clampedIndex = maxIndex // Wrap to end
          morphStateRef.current.activeIndex = clampedIndex
        } else if (clampedIndex > maxIndex) {
          clampedIndex = 0 // Wrap to beginning
          morphStateRef.current.activeIndex = clampedIndex
        }
        
        // Lerp all morph targets
        for (let i = 0; i < influences.length; i++) {
          const target = i === clampedIndex ? 1 : 0
          influences[i] = THREE.MathUtils.lerp(influences[i], target, LERP_SPEED)
        }
      } else {
        // SCROLL MODE: Blend between two specific morph targets based on scroll progress
        const { progress } = scrollState
        const mesh = meshRef.current
        
        // Calculate second morph influence first (needed for first morph calculation)
        let secondMorphInfluence = 0
        if (secondMorphIndex !== null) {
          if (progress >= SECOND_MORPH_START) {
            secondMorphInfluence = progress >= SECOND_MORPH_END 
              ? 1 
              : (progress - SECOND_MORPH_START) / (SECOND_MORPH_END - SECOND_MORPH_START)
          }
          
          mesh.morphTargetInfluences[secondMorphIndex] = secondMorphInfluence
        }
        
        // Update first morph target influence
        // First morph increases, stays at 1, then decreases to 0 as second morph increases
        if (firstMorphIndex !== null) {
          let firstMorphInfluence = 0
          
          if (progress >= FIRST_MORPH_START) {
            if (progress < FIRST_MORPH_END) {
              // Increasing phase: ramp from 0 to 1
              firstMorphInfluence = (progress - FIRST_MORPH_START) / (FIRST_MORPH_END - FIRST_MORPH_START)
            } else if (progress < SECOND_MORPH_START) {
              // Hold phase: stay at 1
              firstMorphInfluence = 1
            } else {
              // Decreasing phase: decrease inversely to second morph
              firstMorphInfluence = 1 - secondMorphInfluence
            }
          }
          
          mesh.morphTargetInfluences[firstMorphIndex] = firstMorphInfluence
        }
      }
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
      text: 'While the petal of the S. Rubra is much smaller'
    },
  ]
  
  const positions = ['3%', '30%']
  
  const handleButtonClick = (direction) => {
    // Switch to button mode when a button is clicked
    morphStateRef.current.useButtonMode = true
    
    const currentIndex = morphStateRef.current.activeIndex
    const maxIndex = morphStateRef.current.maxIndex
    let newIndex
    
    if (direction === 'next') {
      // Cycle forward through morph targets
      newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1
    } else if (direction === 'previous') {
      // Cycle backward through morph targets
      newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1
    } else {
      return
    }
    
    // Update the active index
    morphStateRef.current.activeIndex = newIndex
    console.log(`Switching to morph target index: ${newIndex} (max: ${maxIndex})`)
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

