export default function TouchDeviceWarning() {
  return (
    <section>
      <p style={{ color: 'orange' }}>
        You are on a touch device which means the WebGL won't sync with the native scroll. Consider disabling ScrollScenes for
        touch devices, or experiment with the `smoothTouch` setting on Lenis.
      </p>
    </section>
  )
}

