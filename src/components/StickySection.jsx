import React, { useRef, useMemo } from 'react'
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

