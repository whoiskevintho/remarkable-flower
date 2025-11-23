import React from 'react'

export default function ScrollyTextContainer({ textBoxes, positions = ['10%', '30%', '60%', '80%'] }) {
  return (
    <>
      {textBoxes.map((box, index) => (
        <section 
          key={box.id} 
          className="scrolly-text-section"
          style={{ top: positions[index] }}
        >
          <div className="scrolly-text-content">{box.text}</div>
        </section>
      ))}
    </>
  )
}
