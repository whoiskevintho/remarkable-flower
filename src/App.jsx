import React, { useState, useEffect } from 'react'
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { Analytics } from '@vercel/analytics/react'

import Logo from './Logo'
import HeroSection from './components/HeroSection'
import IntroSection from './components/IntroSection'
import StickySection from './components/StickySection'
import BodySection from './components/BodySection'
import PetalsSection from './components/PetalsSection'
import MethodsSection from './components/MethodsSection'
import FinalSection from './components/FinalSection'
import './index.css'

export default function App() {
  const [isTouch, setTouch] = useState(false)
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    setTouch(isTouch)
  }, [])
  return (
    <>
      <GlobalCanvas style={{ zIndex: -1 }}>{/* UseCanvas children will be inserted here */}</GlobalCanvas>
      <SmoothScrollbar>
        {(bind) => (
          <article {...bind}>
            <HeroSection />
            <IntroSection isTouch={isTouch} />
            <StickySection />
            <BodySection />
            <PetalsSection />
            <FinalSection />
            <MethodsSection />
          </article>
        )}
      </SmoothScrollbar>
      <Analytics />
    </>
  )
}
