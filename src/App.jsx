import React, { useState, useEffect } from 'react'
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'

import Logo from './Logo'
import Header from './components/Header'
import IntroSection from './components/IntroSection'
import StickySection from './components/StickySection'
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
            <Header />
            <IntroSection isTouch={isTouch} />
            <StickySection />
            <Logo />
            <Logo />
            <Logo />
            <Logo />
            <Logo />
          </article>
        )}
      </SmoothScrollbar>
    </>
  )
}
