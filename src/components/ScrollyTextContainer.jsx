import React from 'react'

export default function ScrollyTextContainer() {
  const textBoxes = [
    {
      id: 1,
      text: 'And here is! The remarkable flower.'
    },
    {
      id: 2,
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.'
    },
    {
      id: 3,
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.'
    },
    {
      id: 4,
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.'
    }
  ]
  
  // Position sections at different scroll points: 20%, 50%, 80% through the 500vh container
  const positions = ['0%', '20%', '40%', '60%']
  
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
