import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { a, config, useSpring } from '@react-spring/three'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import ScrollMarker from './ScrollMarker'
import TagLabel from './TagLabel'
import TagLine from './TagLine'
import ScrollyTextContainer from './ScrollyTextContainer'
import { flowerTags } from '../config/flowerTags'
import { useFadeOut } from '../hooks/useFadeOut'

// Preload the model
useGLTF.preload('/flower_v003.glb')

function SpinningModel({ scale, scrollState, inViewport }) {
  const modelRef = useRef()
  const { scene } = useGLTF('/flower_v003.glb')
  const clonedScene = useMemo(() => {
    if (!scene) return null
    return scene.clone()
  }, [scene])
  const size = scale.xy.min() * 0.5
  
  // Rotation controls
  const rotationStart = 1 // Starting rotation in radians
  const rotationSpeed = 0.8 // Rotation multiplier (1 = full rotation, 2 = two rotations, etc.)
  
  // Reusable vectors for current position and lookAt calculation
  const currentPosition = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())
  
  // Store transformed model points (updated each frame to follow model rotation)
  const [transformedModelPoints, setTransformedModelPoints] = useState(() => {
    const initial = new Map()
    flowerTags.forEach((tag) => {
      if (tag.modelPoint) {
        initial.set(tag.label, [
          tag.modelPoint[0] * size,
          tag.modelPoint[1] * size,
          tag.modelPoint[2] * size
        ])
      }
    })
    return initial
  })

  // Calculate model bounding box to determine its actual size
  const modelBounds = useMemo(() => {
    if (!clonedScene) return null
    
    const box = new THREE.Box3()
    box.setFromObject(clonedScene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z)
    
    return { center, size, maxDimension }
  }, [clonedScene])
  
  // Calculate safe distance based on model size (shared for camera and tags)
  const safeDistance = useMemo(() => {
    let distance = 10 // Default fallback
    
    if (modelBounds) {
      // Model's base max dimension
      const baseMaxDim = modelBounds.maxDimension
      // Account for the scale being applied (size)
      // The effective model size will be: baseMaxDim * (size / baseMaxDim) = size
      // So we use size directly, but add a multiplier for safety
      distance = Math.max(size * 3, baseMaxDim * 2.5, 8)
      
      // Adjust for aspect ratio: zoom out when viewport is narrow (portrait mode)
      const aspectRatio = scale.xy.x / scale.xy.y
      if (aspectRatio < 1) {
        // Portrait mode: apply smooth multiplier to push camera back
        // Using power curve (0.7) for smoother scaling, prevents over-zooming
        const aspectMultiplier = Math.pow(1 / aspectRatio, 0.7)
        distance *= aspectMultiplier
      }
    }
    
    return distance
  }, [modelBounds, size, scale])

  // Define five camera positions (created once, reused every frame)
  // Using model bounds to set appropriate distances that account for model size
  const cameraPositions = useMemo(() => {
    return {
      start: new THREE.Vector3(0, safeDistance * 0.1, safeDistance),   // Start position
      betweenStartMiddle: new THREE.Vector3(-safeDistance * 0.4, safeDistance * 0.1, safeDistance * 1.2),   // Between start and middle
      middle: new THREE.Vector3(-safeDistance * 0.8, safeDistance * 0.1, safeDistance * 1.2),   // Middle position
      betweenMiddleEnd: new THREE.Vector3(-safeDistance * 0.4, safeDistance * 0.15, safeDistance * 0.75),   // Between middle and end
      end: new THREE.Vector3(-safeDistance * 0.3, -safeDistance * 0.6, safeDistance * 0.75)        // End position
    }
  }, [safeDistance])

  // Define five lookAt positions (created once, reused every frame)
  // Parallel structure to cameraPositions for smooth interpolation
  const lookAtPositions = useMemo(() => {
    return {
      start: new THREE.Vector3(0, 0, 0),   // Look at model center
      betweenStartMiddle: new THREE.Vector3(0, 0, 0),   // Slightly above center
      middle: new THREE.Vector3(0, 0, 0),   // Above center
      betweenMiddleEnd: new THREE.Vector3(0, -safeDistance * 0.2, 0),   // Slightly above center
      end: new THREE.Vector3(-safeDistance * 0.4, -safeDistance * 0.3, 0)        // Slightly above center
    }
  }, [safeDistance])

  // Find mesh and morph target index once
  const { mesh, morphIndex } = useMemo(() => {
    if (!clonedScene) return { mesh: null, morphIndex: null }
    
    const foundMesh = clonedScene.getObjectByName('style')
    if (!foundMesh || !foundMesh.morphTargetDictionary) {
      return { mesh: null, morphIndex: null }
    }
    
    const index = foundMesh.morphTargetDictionary['style_morph_001']
    return { 
      mesh: foundMesh, 
      morphIndex: index !== undefined ? index : null 
    }
  }, [clonedScene])

  // Reusable vectors for model point transformation
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const tempVector = useRef(new THREE.Vector3())
  
  useFrame((state, delta) => {
    if (modelRef.current) {
      const rotationY = rotationStart + scrollState.progress * Math.PI * 2 * rotationSpeed
      modelRef.current.rotation.y = rotationY
      
      // Update model points to follow model rotation
      const newPoints = new Map()
      const vec = tempVector.current
      flowerTags.forEach((tag) => {
        if (tag.modelPoint) {
          // Scale modelPoint by size (as originally calibrated), then apply rotation
          vec.set(
            tag.modelPoint[0] * size,
            tag.modelPoint[1] * size,
            tag.modelPoint[2] * size
          )
          // Apply Y-axis rotation to match model
          vec.applyAxisAngle(yAxis, rotationY)
          newPoints.set(tag.label, [vec.x, vec.y, vec.z])
        }
      })
      setTransformedModelPoints(newPoints)
    }
    
    // Update morph target based on scroll progress
    if (mesh && morphIndex !== null) {
      // Map scroll progress (0-1) to morph influence (0-1)
      // Adjust these values to control when morph starts/ends
      const morphStart = 0.2  // Start morphing at 30% scroll
      const morphEnd = 0.25     // Complete morph at 70% scroll
      
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
    
    // Interpolate camera between five positions based on scroll progress
    const progress = scrollState.progress // 0 to 1
    
    if (progress <= 0.25) {
      // First quarter: interpolate from start to betweenStartMiddle
      const t = progress * 4 // Map 0-0.25 to 0-1
      currentPosition.current.lerpVectors(cameraPositions.start, cameraPositions.betweenStartMiddle, t)
      currentLookAt.current.lerpVectors(lookAtPositions.start, lookAtPositions.betweenStartMiddle, t)
    } else if (progress <= 0.5) {
      // Second quarter: interpolate from betweenStartMiddle to middle
      const t = (progress - 0.25) * 4 // Map 0.25-0.5 to 0-1
      currentPosition.current.lerpVectors(cameraPositions.betweenStartMiddle, cameraPositions.middle, t)
      currentLookAt.current.lerpVectors(lookAtPositions.betweenStartMiddle, lookAtPositions.middle, t)
    } else if (progress <= 0.75) {
      // Third quarter: interpolate from middle to betweenMiddleEnd
      const t = (progress - 0.5) * 4 // Map 0.5-0.75 to 0-1
      currentPosition.current.lerpVectors(cameraPositions.middle, cameraPositions.betweenMiddleEnd, t)
      currentLookAt.current.lerpVectors(lookAtPositions.middle, lookAtPositions.betweenMiddleEnd, t)
    } else {
      // Fourth quarter: interpolate from betweenMiddleEnd to end
      const t = (progress - 0.75) * 4 // Map 0.75-1 to 0-1
      currentPosition.current.lerpVectors(cameraPositions.betweenMiddleEnd, cameraPositions.end, t)
      currentLookAt.current.lerpVectors(lookAtPositions.betweenMiddleEnd, lookAtPositions.end, t)
    }
    
    state.camera.position.copy(currentPosition.current)
    state.camera.lookAt(currentLookAt.current) // Look at interpolated target
  })

  const spring = useSpring({
    from: { scale: 0 },
    scale: inViewport ? size : 0,
    config: inViewport ? config.wobbly : config.slow
  })

  // Fade out the model as scroll progresses
  useFadeOut(scrollState, { fadeStart: 0.95, fadeEnd: 1.0 }, modelRef)

  // Calculate aspect ratio once for all tags
  const aspectRatio = useMemo(() => Math.pow(scale.xy.x / scale.xy.y, 0.5), [scale])

  if (!clonedScene) return null

  return (
    <>
      <a.primitive 
        ref={modelRef} 
        object={clonedScene} 
        scale={spring.scale}
      />
      
      {flowerTags.map((tag) => {
        // Scale relative position by safeDistance for dynamic positioning
        // X position is adjusted for aspect ratio to prevent clipping
        const scaledPosition = [
          tag.position[0] * safeDistance * aspectRatio,
          tag.position[1] * safeDistance,
          tag.position[2] * safeDistance
        ]
        
        // Get transformed model point (updated in useFrame to follow model rotation)
        const modelPointPosition = tag.modelPoint 
          ? transformedModelPoints.get(tag.label) || null
          : null
        
        return (
          <React.Fragment key={tag.label}>
            <ScrollMarker
              position={scaledPosition}
              scrollState={scrollState}
              showStart={tag.showStart}
              showEnd={tag.showEnd}
              fadeOutStart={tag.fadeOutStart}
              fadeOutEnd={tag.fadeOutEnd}
              flip={tag.flip}
            >
              <TagLabel label={tag.label} color={tag.color} />
            </ScrollMarker>
            
            {tag.modelPoint && modelPointPosition && (
              <TagLine
                startPoint={modelPointPosition}
                endPoint={scaledPosition}
                scrollState={scrollState}
                showStart={tag.showStart}
                showEnd={tag.showEnd}
                fadeOutStart={tag.fadeOutStart}
                fadeOutEnd={tag.fadeOutEnd}
                color={tag.color}
                lineWidth={1}
                shortenBy={tag.shortenBy}
              />
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

export default function StickySection() {
  const el = useRef()
  
  const textBoxes = [
    {
      id: 1,
      text: 'Here we see the anatomy of a Sarracenia flower. Pollen is produced on the anthers and must reach the stigma for fertilization.'
    },
    {
      id: 2,
      text: 'Most flowers avoid self-pollination to maintain genetic diversity. So how does this flower stop its own pollen from landing on the stigma?'
    },
    {
      id: 3,
      text: 'Pollinators, like bumble bees, enter beneath the sepal and pass over the stigma as they move into the flower.'
    },
    {
      id: 4,
      text: `They exit beneath the petal along a different route, creating a one-way path. Pollen carried by visitors is more likely to reach another flower's stigma, promoting cross-fertilization.`
    }
  ]
  
  const positions = ['10%', '30%', '60%', '80%']
  
  return (
    <section>
      <div className="StickyContainer">
        <div ref={el} className="SomeStickyContent">
        </div>
        <ScrollyTextContainer textBoxes={textBoxes} positions={positions} />
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

