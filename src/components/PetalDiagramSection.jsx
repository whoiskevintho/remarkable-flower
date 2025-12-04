import { useState } from 'react'
import { petalSizes } from '../config/petalSizes'
import './PetalDiagramSection.css'

export default function PetalDiagramSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="petal-diagram-section">
      <div className="petal-diagram-container">
        <img 
          src="/petal_diagram.png" 
          alt="Petal diagram showing measurement points" 
          className="petal-diagram-image"
        />
      </div>
      
      <div className="accordion-container">
        <button 
          className="accordion-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>View the data</span>
          <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
        </button>
        
        {isOpen && (
          <div className="accordion-content">
            <div className="data-table-container">
              <table className="petal-data-table">
                <thead>
                  <tr>
                    <th>Species</th>
                    <th>n</th>
                    <th>L</th>
                    <th>A</th>
                    <th>A<sub>s</sub></th>
                    <th>B</th>
                    <th>B<sub>s</sub></th>
                    <th>C</th>
                    <th>C<sub>s</sub></th>
                    <th>D</th>
                    <th>D<sub>s</sub></th>
                    <th>E</th>
                    <th>E<sub>s</sub></th>
                    <th>F</th>
                    <th>F<sub>s</sub></th>
                  </tr>
                </thead>
                <tbody>
                  {petalSizes.map((row, index) => (
                    <tr key={index}>
                      <td>{row.species}</td>
                      <td>{row.n}</td>
                      <td>{row.L != null ? row.L : 'N/A'}</td>
                      <td>{row.A}</td>
                      <td>{row.As}</td>
                      <td>{row.B}</td>
                      <td>{row.Bs}</td>
                      <td>{row.C}</td>
                      <td>{row.Cs}</td>
                      <td>{row.D}</td>
                      <td>{row.Ds}</td>
                      <td>{row.E}</td>
                      <td>{row.Es}</td>
                      <td>{row.F}</td>
                      <td>{row.Fs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="data-table-note">
                S. <i>rosea</i> data added from Naczi et al. (1999)
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

