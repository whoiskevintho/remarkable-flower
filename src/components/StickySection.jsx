import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { a, config, useSpring } from '@react-spring/three'
import { UseCanvas } from '@14islands/r3f-scroll-rig'
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups'

const AnimatedRoundedBox = a(RoundedBox)

function SpinningBox({ scale, scrollState, inViewport }) {
  const box = useRef()
  const size = scale.xy.min() * 0.5

  useFrame(() => {
    box.current.rotation.y = scrollState.progress * Math.PI * 2
  })

  const spring = useSpring({
    scale: inViewport ? size : size * 0.0,
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 100 : 0
  })

  return (
    <AnimatedRoundedBox ref={box} {...spring}>
      <meshNormalMaterial />
    </AnimatedRoundedBox>
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
              <SpinningBox {...props} />
            </>
          )}
        </StickyScrollScene>
      </UseCanvas>
    </section>
  )
}

