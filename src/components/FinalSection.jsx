import PetalSizeRadarChart from './PetalSizeRadarChart'
import ParallelCoordinatesChart from './ParallelCoordinatesChart'
import PetalDiagramSection from './PetalDiagramSection'
import ImageGallery from './ImageGallery'
import { petalSizes } from '../config/petalSizes'

export default function FinalSection() {

  const sarraceniaHybrids = [
    {
      src: '/images/sarracenierehderi.webp',
      alt: 'Sarracenia x rehderi',
      caption: (
        <>
          Sarracenia x rehderi (Sarracenia rubra x sarracenia minor) • Photo by{' '}
          <a href="https://flic.kr/p/nuAc1A" target="_blank" rel="noopener noreferrer">
            Alan Cressler
          </a>
        </>
      )
    },
    {
      src: '/images/sarracenia_catesbaei.webp',
      alt: 'Sarracenia x catesbaei',
      caption: (
        <>
          Sarracenia x catesbaei (Sarracenia flava x Sarracenia purpurea) • Photo by{' '}
          <a href="https://www.flytrapcare.com/store/sarracenia-x-catesbaei?srsltid=AfmBOoqt6L4QoAxKULa29ZmFyfU6DxqJ65vTo7MtAHNP-Z-YDPLXWXRa" target="_blank" rel="noopener noreferrer">
            Matt Miller
          </a>
        </>
      )
    },
    {
      src: '/images/areolata_jyd.webp',
      alt: 'Sarracenia x areolata',
      caption: (
        <>
          Sarracenia x areolata with snowwhite flower (complex hybrid) • Photo by{' '}
          <a href="https://sarracenia.proboards.com/post/49636" target="_blank" rel="noopener noreferrer">
            jyd - Sarracenia Forum
          </a>
        </>
      )
    },
  ]

  return (
    <>
      <section className="intro-text">
        <p>
          As you can see, there is a lot of diversity in <i>Sarracenia</i> flowers!
          A big part of that variation simply comes down to the conditions in which the plant grew - sunlight exposure, soil, water, all of it.
          That said, averages from wild <i>Sarracenia</i> populations have been measured, and the petal shapes you saw above are scaled accurately relative to each other.
          This data comes from Schnell & McPherson (2011).
          <br />
          <br />
          Here is the same information laid out as a table, along with a diagram showing which parts of the petal were measured.
        </p>
      </section>

      <section className="intro-text">
        <PetalDiagramSection />
      </section>

      <section className="intro-text">
        <p>
          Lets chart this information so we can more easily identify the trends in flower size. Note that the measurements have been normalized.
        </p>
      </section>

      <section className="intro-text">
        <ParallelCoordinatesChart data={petalSizes} />
      </section>

      <section className="intro-text">
        <p>
          Clearly, <i>S. flava</i>, <i>S. alata</i>, and <i>S. rosea</i> are your best bets if you’re interested in larger flowers!
          Notice the inverted curve of <i>S. leucophylla</i> and <i>S. oreophila</i> - on average, the base of the petal is wider than the tip. Neat!
          We can also see a slight trend in the color of <i>Sarracenia</i> flowers: larger flowers tend to display a greater diversity of colors.
          But I’m not a biologist - I’m just a guy trapped in a pitfall of mostly useless plant knowledge.
          <br />
          <br />
          What’s really interesting is the variation in flower types you can get from outcrossing different species of <i>Sarracenia</i>.
          This is the main reason gardeners obsess over these plants. It’s fun and easy to cross plants and see which traits appear.
          In every tiny seed lies a new and never-before-seen mix of characteristics.
          Most horticulturists focus on breeding for pitchers, but here are some interesting flowers that result from hybridization!
        </p>
      </section>

      <section style={{ margin: '0vw 0', padding: '0 5vw' }}>
        <ImageGallery images={sarraceniaHybrids} />
      </section>

      <section className="intro-text">
        <p>
          I’m drawn to carnivorous plants because they’re just dang cool. A plant that eats!? Ludicrous. You might not have even heard of <i>Sarracenia</i> before reading this -
          let alone heard about their flowers. Eating bugs is cool and all, but their flowers make them strange, inconsistent, and wholly unique.
          They reward curiosity with more than the dramatic snap of a fly trap around a stray finger (again, unless you really really want to) - there is a slow burn and reveal of form while a gardner breeds and grows these plants.
          And that’s all thanks to their remarkable flowers!
          <br />
          <br />
          If you want to continue your journey down the pitfall trap - I’ve put together an interactive map you can use to explore the distribution of <i>Sarracenia</i> species across North America.
        </p>
      </section>

      <section className="intro-text">
        <a href="https://carnivorous-plant-mapping.vercel.app/" target="_blank" rel="noopener noreferrer"> Link to Map </a>
      </section>
      
    </>
  )
}