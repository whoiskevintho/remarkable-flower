import React, { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { a, config, useSpring } from '@react-spring/three'
import { useSpring as useSpringWeb, animated } from '@react-spring/web'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import ScrollyTextContainer from './ScrollyTextContainer'
import ImageModal from './ImageModal'
import { useFadeOut } from '../hooks/useFadeOut'
import { getMorphDisplayName, getMorphImage, getMorphSubtitle, getMorphCaption } from '../config/petalMorphs'
import { applyMaterialsToScene, updateMaterialTextureForMorph, preloadMorphTextures } from '../shaders/petalMaterials'
import './PetalsSection.css'

// Preload the model
useGLTF.preload('/petals_v004.glb')

// ============================================================================
// MORPH TARGET CONFIGURATION
// ============================================================================
// Change these to use different morph targets from your GLB model
// Check the console for available morph target names when the component loads
const FIRST_MORPH_TARGET_NAME = 'Flava'      // First morph target to animate
const SECOND_MORPH_TARGET_NAME = 'RubraRubra' // Second morph target to animate

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
    secondMorphIndex: null, // Index of SECOND_MORPH_TARGET_NAME
    morphNames: [],       // Array of morph target names (for React component access)
    mesh: null            // Reference to the mesh for texture updates
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
  const previousProgressRef = useRef(0) // Track previous scroll progress to detect direction
  const currentScrollTextureRef = useRef(null) // Track active scroll texture
  const DEFAULT_TEXTURE_MORPH = 'PurpureaPurpurea' // Default/base texture morph target
  
  const { scene } = useGLTF('/petals_v004.glb')
  
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone()
    
    // Apply all materials from the material loader
    // This will create materials for all meshes based on MATERIAL_CONFIG
    applyMaterialsToScene(cloned, {
      overrideExisting: true
    })
    
    return cloned
  }, [scene])
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
        const morphNames = Object.keys(foundMesh.morphTargetDictionary)
        morphNamesRef.current = morphNames
        
        // Store morph names in shared state for React component access
        morphStateRef.current.morphNames = morphNames
        
        // Store mesh reference for texture updates
        morphStateRef.current.mesh = foundMesh
        
        // Store indices for scroll-based morph targets
        morphStateRef.current.firstMorphIndex = foundMesh.morphTargetDictionary[FIRST_MORPH_TARGET_NAME] ?? null
        morphStateRef.current.secondMorphIndex = foundMesh.morphTargetDictionary[SECOND_MORPH_TARGET_NAME] ?? null
        
        if (morphStateRef.current.firstMorphIndex === null) {
          console.warn(`Morph target "${FIRST_MORPH_TARGET_NAME}" not found. Available targets:`, morphNames)
        }
        if (morphStateRef.current.secondMorphIndex === null) {
          console.warn(`Morph target "${SECOND_MORPH_TARGET_NAME}" not found. Available targets:`, morphNames)
        }
        
        // Store max index in shared state for button handlers
        if (foundMesh.morphTargetInfluences) {
          morphStateRef.current.maxIndex = foundMesh.morphTargetInfluences.length - 1
          // Initialize all morph targets to 0
          for (let i = 0; i < foundMesh.morphTargetInfluences.length; i++) {
            foundMesh.morphTargetInfluences[i] = 0
          }
        }
        
        // Preload all morph textures
        preloadMorphTextures()
        
        initializedRef.current = true
      }
    }
    
    // Unified morph target system: calculate targets, then lerp all morphs
    if (meshRef.current && meshRef.current.morphTargetInfluences) {
      const { progress } = scrollState
      const isScrollingUp = progress < previousProgressRef.current
      previousProgressRef.current = progress
      
      // Switch back to scroll mode when scrolling up into scroll section
      if (morphStateRef.current.useButtonMode && isScrollingUp && progress < SECOND_MORPH_END) {
        morphStateRef.current.useButtonMode = false
      }
      
      const { useButtonMode, firstMorphIndex, secondMorphIndex, activeIndex, maxIndex } = morphStateRef.current
      const influences = meshRef.current.morphTargetInfluences
      const targets = new Array(influences.length).fill(0)
      
      // Calculate target values based on mode
      if (useButtonMode && progress >= SECOND_MORPH_END) {
        // BUTTON MODE: target is the active button-selected morph
        let clampedIndex = activeIndex
        if (clampedIndex < 0) {
          clampedIndex = maxIndex
          morphStateRef.current.activeIndex = clampedIndex
        } else if (clampedIndex > maxIndex) {
          clampedIndex = 0
          morphStateRef.current.activeIndex = clampedIndex
        }
        targets[clampedIndex] = 1
      } else {
        // SCROLL MODE: calculate scroll-based targets
        let secondMorphTarget = 0
        if (secondMorphIndex !== null && progress >= SECOND_MORPH_START) {
          secondMorphTarget = progress >= SECOND_MORPH_END 
            ? 1 
            : (progress - SECOND_MORPH_START) / (SECOND_MORPH_END - SECOND_MORPH_START)
        }
        
        let firstMorphTarget = 0
        if (firstMorphIndex !== null && progress >= FIRST_MORPH_START) {
          if (progress < FIRST_MORPH_END) {
            firstMorphTarget = (progress - FIRST_MORPH_START) / (FIRST_MORPH_END - FIRST_MORPH_START)
          } else if (progress < SECOND_MORPH_START) {
            firstMorphTarget = 1
          } else {
            firstMorphTarget = 1 - secondMorphTarget
          }
        }
        
        if (firstMorphIndex !== null) targets[firstMorphIndex] = firstMorphTarget
        if (secondMorphIndex !== null) targets[secondMorphIndex] = secondMorphTarget
        
        //TO-DO: Implimentation of this scroll logic is buggy - come back and fix it
        // Update texture for scroll-based morphs - use morph target values to determine dominant texture
        let targetTexture = null
        if (secondMorphTarget > firstMorphTarget && secondMorphTarget > 0) {
          // Second morph is dominant
          targetTexture = SECOND_MORPH_TARGET_NAME
        } else if (firstMorphTarget > 0) {
          // First morph is active
          targetTexture = FIRST_MORPH_TARGET_NAME
        } else {
          // Below first morph start - use default texture
          targetTexture = DEFAULT_TEXTURE_MORPH
        }
        
        // Update texture if it needs to change
        if (targetTexture !== currentScrollTextureRef.current && meshRef.current) {
          updateMaterialTextureForMorph(meshRef.current, targetTexture)
          currentScrollTextureRef.current = targetTexture
        }
      }
      
      // Unified lerping: all morphs lerp toward their targets
      for (let i = 0; i < influences.length; i++) {
        influences[i] = THREE.MathUtils.lerp(influences[i], targets[i], LERP_SPEED)
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
  const [currentMorphName, setCurrentMorphName] = useState('')
  const [currentMorphDisplayName, setCurrentMorphDisplayName] = useState('Explore the many varieties in Sarracenia flower petals')
  const [currentMorphSubtitle, setCurrentMorphSubtitle] = useState('')
  const [currentMorphImage, setCurrentMorphImage] = useState('')
  const [currentMorphCaption, setCurrentMorphCaption] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // React Spring animation for image
  const imageSpring = useSpringWeb({
    opacity: hasInteracted && currentMorphImage ? 1 : 0,
    transform: hasInteracted && currentMorphImage ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 30 }
  })
  
  // Sync React state with morphStateRef when activeIndex or morphNames change
  useEffect(() => {
    const updateCurrentMorph = () => {
      const { activeIndex, morphNames } = morphStateRef.current
      if (morphNames.length > 0 && activeIndex >= 0 && activeIndex < morphNames.length) {
        const name = morphNames[activeIndex]
        setCurrentMorphName(name)
        setCurrentMorphDisplayName(getMorphDisplayName(name))
        setCurrentMorphSubtitle(getMorphSubtitle(name) || '')
        setCurrentMorphImage(getMorphImage(name) || '')
        setCurrentMorphCaption(getMorphCaption(name))
      }
    }
    
    // Initial update
    updateCurrentMorph()
    
    // Poll for changes when morph names are available
    const interval = setInterval(() => {
      if (morphStateRef.current.morphNames.length > 0) {
        updateCurrentMorph()
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  const textBoxes = [
    {
      id: 1,
      text: 'The petal of the S. Flava is long and yellow'
    },
    {
      id: 2,
      text: 'While the petal of the S. Rubra is much smaller and red'
    }
  ]
  
  const positions = ['3%', '30%']
  
  const handleButtonClick = (direction) => {
    // Mark that user has interacted on first button click
    if (!hasInteracted) {
      setHasInteracted(true)
    }
    
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
    
    // Update React state immediately
    const { morphNames, mesh } = morphStateRef.current
    if (morphNames.length > 0 && newIndex >= 0 && newIndex < morphNames.length) {
      const name = morphNames[newIndex]
      setCurrentMorphName(name)
      setCurrentMorphDisplayName(getMorphDisplayName(name))
      setCurrentMorphSubtitle(getMorphSubtitle(name) || '')
      setCurrentMorphImage(getMorphImage(name) || '')
      setCurrentMorphCaption(getMorphCaption(name))
      
      // Update material texture for the new morph
      if (mesh) {
        updateMaterialTextureForMorph(mesh, name)
      }
    }
  }
  
  return (
    <section className="petals-section">
      <div className="PetalsStickyContainer">
        <div ref={el} className="PetalsStickyContent" />
        <ScrollyTextContainer textBoxes={textBoxes} positions={positions} />
        
        {/* Spacer to control when buttons appear - adjust height to control scroll position */}
        <div className="PetalsButtonsSpacer" />
        
        {/* New: Buttons and Dialogue Container - scrolls up then sticks */}
        <div className="PetalsButtonsContainer">
          <div className="PetalsDialogueWrapper">
            <div className="PetalsDialogue">
              <p>{hasInteracted ? currentMorphDisplayName : 'Explore the many varieties in Sarracenia flower petals'}</p>
              {hasInteracted && currentMorphSubtitle && (
                <p className="PetalsSubtitle">{currentMorphSubtitle}</p>
              )}
            </div>
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
            
            {/* Image container between the two buttons - always rendered to prevent layout shift */}
            <div className="PetalsImageContainer">
              {hasInteracted && currentMorphImage && (
                <animated.img 
                  src={currentMorphImage} 
                  alt={currentMorphName}
                  className="PetalsImage"
                  style={{ ...imageSpring, cursor: 'pointer' }}
                  onClick={() => setIsModalOpen(true)}
                />
              )}
            </div>
            
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
            <PetalsModel {...props} />
          )}
        </StickyScrollScene>
      </UseCanvas>
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={currentMorphImage}
        caption={
          currentMorphCaption ? (
            <>
              {currentMorphDisplayName} ({currentMorphSubtitle}) • Photo by{' '}
              <a href={currentMorphCaption.link} target="_blank" rel="noopener noreferrer">
                {currentMorphCaption.photographer}
              </a>
            </>
          ) : (
            currentMorphSubtitle || currentMorphDisplayName
          )
        }
      />
    </section>
  )
}

