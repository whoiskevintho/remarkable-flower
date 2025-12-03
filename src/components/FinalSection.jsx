import PetalSizeRadarChart from './PetalSizeRadarChart'
import ParallelCoordinatesChart from './ParallelCoordinatesChart'
import { petalSizes } from '../config/petalSizes'

export default function FinalSection() {
  return (
    <>
      <section className="intro-text">
        <p>
          And that it folks! Thanks for taking the time to learn about these remarkable flowers.
        </p>
      </section>

      {/* <section className="intro-text">
        <PetalSizeRadarChart />
      </section> */}

      <section className="intro-text">
        <ParallelCoordinatesChart data={petalSizes} />
      </section>

      <section className="intro-text">
        <p>
          Bonuse content, if you interested in learning about the Sarracenia distribution across north america, check out my map here: https://carnivorous-plant-mapping.vercel.app/
        </p>
      </section>
    </>
  )
}