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

useGLTF.preload('/petals_v001.glb')

const MODEL_POSITION = [0, 0, 0]
const MODEL_ROTATION = [Math.PI/2, Math.PI/2, 0]
const LERP_SPEED = 0.08

// Shared state refs for cross-context communication
const morphStateRef = { current: { activeIndex: 0, count: 1 } }

function PetalsModel({ scale, scrollState, inViewport }) {
  const modelRef = useRef()
  const meshRef = useRef()
  const morphNamesRef = useRef([])
  const { scene } = useGLTF('/petals_v001.glb')
  
  const clonedScene = useMemo(() => scene?.clone() || null, [scene])
  const size = scale.xy.min() * 0.5

  const modelBounds = useMemo(() => {
    if (!clonedScene) return null
    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const dimensions = box.getSize(new THREE.Vector3())
    return { center, maxDimension: Math.max(dimensions.x, dimensions.y, dimensions.z) }
  }, [clonedScene])
  
  const safeDistance = useMemo(() => {
    if (!modelBounds) return 10
    const distance = Math.max(size * 3, modelBounds.maxDimension * 2.5, 8)
    const aspectRatio = scale.xy.x / scale.xy.y
    return aspectRatio < 1 ? distance * Math.pow(1 / aspectRatio, 0.7) : distance
  }, [modelBounds, size, scale])

  useFrame((state) => {
    if (!modelBounds || !modelRef.current) return
    
    // Find mesh with morph targets on first frame
    if (!meshRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.morphTargetDictionary && !meshRef.current) {
          meshRef.current = child
          morphNamesRef.current = Object.keys(child.morphTargetDictionary)
          morphStateRef.current.count = morphNamesRef.current.length
        }
      })
    }
    
    const mesh = meshRef.current
    const morphNames = morphNamesRef.current
    if (!mesh || !morphNames.length) return
    
    const activeIndex = morphStateRef.current.activeIndex
    
    // Lerp all morph targets: active one toward 1, others toward 0
    morphNames.forEach((name, i) => {
      const idx = mesh.morphTargetDictionary[name]
      const target = i === activeIndex ? 1 : 0
      const current = mesh.morphTargetInfluences[idx] || 0
      mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(current, target, LERP_SPEED)
    })
    
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
    { id: 1, text: 'The petal of the S. Flava is long and narrow' },
    { id: 2, text: 'While the petal of the S. Rubra is much smaller' },
  ]
  
  const positions = ['3%', '30%']
  
  const handlePrev = () => {
    const { count } = morphStateRef.current
    morphStateRef.current.activeIndex = (morphStateRef.current.activeIndex - 1 + count) % count
  }
  const handleNext = () => {
    const { count } = morphStateRef.current
    morphStateRef.current.activeIndex = (morphStateRef.current.activeIndex + 1) % count
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
            <button className="PetalsButton" onClick={handlePrev} aria-label="Previous variety">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
            <button className="PetalsButton" onClick={handleNext} aria-label="Next variety">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
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

