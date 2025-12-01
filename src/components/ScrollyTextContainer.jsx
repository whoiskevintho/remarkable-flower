import React from 'react'

export default function ScrollyTextContainer({ textBoxes, positions = ['5%', '20%', '25%', '50%'] }) {
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
