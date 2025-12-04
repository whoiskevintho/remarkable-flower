import PetalSizeRadarChart from './PetalSizeRadarChart'
import ParallelCoordinatesChart from './ParallelCoordinatesChart'
import { petalSizes } from '../config/petalSizes'

export default function FinalSection() {
  return (
    <>
      <section className="intro-text">
        <p>
          As you can see, there is a lot of diversity in Sarracenia flowers!
          A big part of that variation simply comes down to the conditions in which the plant grew - sunlight exposure, soil, water, all of it.
          That said, averages from wild sarracenia populations have been measured, and the petal shapes you saw above are scaled accurately relative to each other.
          This data comes from Schnell & McPherson (2011).
          <br />
          <br />
          Here is the same information laid out as a table, along with a diagram showing which parts of the petal were measured.
        </p>
      </section>

      <section className="intro-text">
        <p>
          Lets chart this information so we can more easily identify the trends in flower size. Note that the measurements have been normalized.
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
          If you love big flowers and enjoy smelling them, then Sarracenia leucophylla is probably your best bet to grow.
          But if you prefer yellow flowers, you’ll want S. minor—as long as you don’t mind that you’ll only have about two weeks to sniff them each year.
          If you like yellow flowers but don’t really care about scent, then go with S. flava.
          Now, what’s this? You like the smell of cat pee and want a large red flower? Then S. purpurea ssp. venosa is perfect for you.
          And finally, if you want a sweet-smelling flower, but on the smaller side, go with a species in the S. rubra complex.

        </p>
      </section>

      <section className="intro-text">
        <p>
          Bonuse content, if you interested in learning about the Sarracenia distribution across north america, check out my map here: https://carnivorous-plant-mapping.vercel.app/
        </p>
      </section>
    </>
  )
}