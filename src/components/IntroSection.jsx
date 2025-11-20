import TouchDeviceWarning from './TouchDeviceWarning'

export default function IntroSection({ isTouch }) {
  return (
    <>
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
    </>
  )
}

