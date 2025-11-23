import { useState } from 'react'
import PetalDiagram from './PetalDiagram'
import { petalMeasurements } from '../config/petalMeasurements'

export default function PetalSection() {
  const speciesList = Object.keys(petalMeasurements)
  const [currentSpeciesIndex, setCurrentSpeciesIndex] = useState(0)
  const currentSpecies = speciesList[currentSpeciesIndex]

  const handlePrevious = () => {
    setCurrentSpeciesIndex((prev) => (prev === 0 ? speciesList.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSpeciesIndex((prev) => (prev === speciesList.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <section className="intro-text">
        <p>
          Its floral structure is also used to delineate species and subspecies, since each has distinctive morphological traits.
        </p>
      </section>

      <section className="intro-text">
        <p>
          Lets take a closer look at the petals.
        </p>
      </section>

      <section className="intro-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <button 
            onClick={handlePrevious}
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#f2f2f2',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            Previous
          </button>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '120px', textAlign: 'center' }}>
            {currentSpecies}
          </span>
          <button 
            onClick={handleNext}
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#f2f2f2',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            Next
          </button>
        </div>
        <PetalDiagram data={petalMeasurements} species={currentSpecies} />
      </section>
    </>
  )
}
