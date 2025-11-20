import React, { useState, useEffect } from 'react'
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig'

import Logo from './Logo'
import Header from './components/Header'
import TouchDeviceWarning from './components/TouchDeviceWarning'
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
            <section>
              <h1>A "sticky" ScrollScene</h1>
            </section>
            {isTouch && <TouchDeviceWarning />}
            <section>
              <p>StickyScrollScene is built on top of the scroll-rig and not part of core.</p>
              <p>
                The <code>powerups</code> package contains some example components that can be used for quick prototyping.
              </p>
            </section>
            <section>
              <p>Some extra space before the action starts...</p>
            </section>
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
