import React from 'react'

export default function ScrollyTextContainer() {
  const textBoxes = [
    {
      id: 1,
      text: 'Here we see the anatomy of a Sarracenia flower. Pollen is produced on the anthers and must reach the stigma for fertilization.'
    },
    {
      id: 2,
      text: 'Most flowers avoid self-pollination to maintain genetic diversity. So how does this flower stop its own pollen from landing on the stigma?'
    },
    {
      id: 3,
      text: 'Pollinators, like bumble bees, enter beneath the sepal and pass over the stigma as they move into the flower.'
    },
    {
      id: 4,
      text: `They exit beneath the petal along a different route, creating a one-way path. Pollen carried by visitors is more likely to reach another flower’s stigma, promoting cross-fertilization.`
    }
  ]
  
  // Position sections at different scroll points: 20%, 50%, 80% through the 500vh container
  const positions = ['10%', '30%', '60%', '80%']
  
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
