import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { a, config, useSpring } from '@react-spring/three'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'
import ScrollMarker from './ScrollMarker'
import TagLabel from './TagLabel'
import { flowerTags } from '../config/flowerTags'

// Preload the model
useGLTF.preload('/flower_v001.glb')

function SpinningModel({ scale, scrollState, inViewport }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/flower_v001.glb')
  const clonedScene = useMemo(() => {
    if (!scene) return null
    return scene.clone()
  }, [scene])
  const size = scale.xy.min() * 0.5

  // Define five model positions and rotations for scroll animation
  const modelStates = useMemo(() => ({
    start: {
      position: [0, 100, 0],      // Start position
      rotation: [0, 0.5, 0]       // Start rotation
    },
    startToMiddle: {
      position: [-1, 100, 0.5],   // Between start and middle
      rotation: [0.1, Math.PI * 1.1, 0.05]  // Intermediate rotation
    },
    middle: {
      position: [-2, 100, 1],     // Middle position
      rotation: [0.05, Math.PI * 1.15, 0.05]  // Middle rotation (270 degrees on Y axis)
    },
    middleToEnd: {
      position: [-1, 150, 600],     // Between middle and end
      rotation: [0.6, Math.PI * 1.75, 0.05]  // Intermediate rotation
    },
    end: {
      position: [0, 100, 600],     // End position
      rotation: [-0.7, Math.PI * 2.1, 0]  // End rotation (360 degrees on Y axis, tilted towards viewer)
    }
  }), [])

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

  useFrame(() => {
    if (!groupRef.current) return
    
    const progress = scrollState.progress // 0 to 1
    
    // Interpolate model position and rotation between five states (4 segments)
    let currentPosition, currentRotation
    let fromState, toState, t
    
    if (progress <= 0.25) {
      // First quarter: start -> startToMiddle
      t = progress * 4 // Map 0-0.25 to 0-1
      fromState = modelStates.start
      toState = modelStates.startToMiddle
    } else if (progress <= 0.5) {
      // Second quarter: startToMiddle -> middle
      t = (progress - 0.25) * 4 // Map 0.25-0.5 to 0-1
      fromState = modelStates.startToMiddle
      toState = modelStates.middle
    } else if (progress <= 0.75) {
      // Third quarter: middle -> middleToEnd
      t = (progress - 0.5) * 4 // Map 0.5-0.75 to 0-1
      fromState = modelStates.middle
      toState = modelStates.middleToEnd
    } else {
      // Fourth quarter: middleToEnd -> end
      t = (progress - 0.75) * 4 // Map 0.75-1 to 0-1
      fromState = modelStates.middleToEnd
      toState = modelStates.end
    }
    
    // Interpolate position
    currentPosition = [
      fromState.position[0] + (toState.position[0] - fromState.position[0]) * t,
      fromState.position[1] + (toState.position[1] - fromState.position[1]) * t,
      fromState.position[2] + (toState.position[2] - fromState.position[2]) * t
    ]
    
    // Interpolate rotation
    currentRotation = [
      fromState.rotation[0] + (toState.rotation[0] - fromState.rotation[0]) * t,
      fromState.rotation[1] + (toState.rotation[1] - fromState.rotation[1]) * t,
      fromState.rotation[2] + (toState.rotation[2] - fromState.rotation[2]) * t
    ]
    
    // Apply position and rotation to group (not the primitive)
    groupRef.current.position.set(...currentPosition)
    groupRef.current.rotation.set(...currentRotation)
    
    // Update morph target based on scroll progress
    if (mesh && morphIndex !== null) {
      // Map scroll progress (0-1) to morph influence (0-1)
      // Adjust these values to control when morph starts/ends
      const morphStart = 0.75  // Start morphing at 75% scroll
      const morphEnd = 0.8     // Complete morph at 80% scroll
      
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
  })

  const spring = useSpring({
    scale: inViewport ? size : size * 0.0,
    config: inViewport ? config.wobbly : config.stiff
  })

  if (!clonedScene) return null

  return (
    <group ref={groupRef}>
      <a.primitive 
        object={clonedScene} 
        scale={spring.scale}
      />
      
      {flowerTags.map((tag) => (
        <ScrollMarker
          key={tag.label}
          position={tag.position}
          scrollState={scrollState}
          showStart={tag.showStart}
          showEnd={tag.showEnd}
          fadeOutStart={tag.fadeOutStart}
          fadeOutEnd={tag.fadeOutEnd}
          flip={tag.flip}
        >
          <TagLabel label={tag.label} color={tag.color} />
        </ScrollMarker>
      ))}
    </group>
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

