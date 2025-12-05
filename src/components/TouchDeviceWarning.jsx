export default function TouchDeviceWarning() {
  return (
    <section>
      <p style={{ color: 'orange' }}>
        You are on a touch device which means the WebGL won't sync with the native scroll. This story is best viewed on a desktop computer.
      </p>
    </section>
  )
}

