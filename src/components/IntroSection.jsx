import TouchDeviceWarning from './TouchDeviceWarning'
import ImageGallery from './ImageGallery'

export default function IntroSection({ isTouch }) {
  const venusFlytrapImages = [
    {
      src: '/images/VFT_1_alancressler.webp',
      alt: 'Venus flytrap',
      caption: (
        <>
          Venus flytrap (Dionaea muscipula) • Photo by{' '}
          <a href="https://flic.kr/p/WqM92" target="_blank" rel="noopener noreferrer">
            Alan Cressler
          </a>
        </>
      )
    },
    {
      src: '/images/VFT_2_alancressler.webp',
      alt: 'Venus flytrap',
      caption: (
        <>
          Venus flytrap (Dionaea muscipula) • Photo by{' '}
          <a href="https://flic.kr/p/WqM5D" target="_blank" rel="noopener noreferrer">
            Alan Cressler
          </a>
        </>
      )
    },
    {
      src: '/images/VFT_3_alancressler.webp',
      alt: 'Venus flytrap',
      caption: (
        <>
          Venus flytrap (Dionaea muscipula) • Photo by{' '}
          <a href="https://flic.kr/p/cRnMWh" target="_blank" rel="noopener noreferrer">
            Alan Cressler
          </a>
        </>
      )
    }
  ]

  const pitcherPlants = [
    {
      src: '/images/heliamphora_bogmanplantenstein.webp',
      alt: 'Heliamphora',
      caption: (
        <>
          Sun Pitcher Plant (Heliamphora uncinata) • Photo by{' '}
          <a href="https://www.burymeinthebog.com/photos/amuri-tepui" target="_blank" rel="noopener noreferrer">
            Bogman Plantenstein
          </a>
        </>
      )
    },
    {
      src: '/images/flava_willstuart.webp',
      alt: 'Sarracenia Flava',
      caption: (
        <>
          Yellow Pitcher Plant (Sarracenia flava) • Photo by{' '}
          <a href="https://fsus.ncbg.unc.edu/main.php?pg=show-taxon.php&&plantname=sarracenia&limit=1&offset=5&taxonid=4610" target="_blank" rel="noopener noreferrer">
            Will Stuart
          </a>
        </>
      )
    },
    {
      src: '/images/darlingtonia_bradwilson.webp',
      alt: 'California Pitcher Plant',
      caption: (
        <>
          California Pitcher Plant (Darlingtonia californica) • Photo by{' '}
          <a href="https://flic.kr/p/aLVD1Z" target="_blank" rel="noopener noreferrer">
            Brad Wilson
          </a>
        </>
      )
    }
  ]

  const sarraceniaVariation = [
    {
      src: '/images/leucophylla_white_alancressler.webp',
      alt: 'White Pitcher Plant',
      caption: (
        <>
          White Pitcher Plant (Sarracenia leucophylla) • Photo by{' '}
          <a href="https://flic.kr/p/2hng622" target="_blank" rel="noopener noreferrer">
            Alan Cressler
          </a>
        </>
      )
    },
    {
      src: '/images/purpurea_purple_mikewang.webp',
      alt: 'Purple Pitcher Plant',
      caption: (
        <>
          Purple Pitcher Plant (Sarracenia purpurea ssp. purpurea) • Photo by{' '}
          <a href="https://flic.kr/p/2rB914a" target="_blank" rel="noopener noreferrer">
            Mike Wang
          </a>
        </>
      )
    },
    {
      src: '/images/rubra_sheridan_mikewang.webp',
      alt: 'Sweet Pitcher Plant',
      caption: (
        <>
          Sweet Pitcher Plant (Sarracenia rubra) • Photo by{' '}
          <a href="https://fsus.ncbg.unc.edu/main.php?pg=show-taxon.php&&plantname=sarracenia&limit=1&offset=5&taxonid=4610" target="_blank" rel="noopener noreferrer">
            Mike Wang
          </a>
        </>
      )
    },
  ]

  return (
    <>
      {isTouch && <TouchDeviceWarning />}
      <section className="intro-text">
        <p>
          You're most likely familiar with the Venus flytrap. It's the poster child of the carnivorous plant world - gaping maws lined with red 'teeth' waiting for unsuspecting arthropods
          to wander in.  All it takes is to touch one and watch it snap shut around your finger to spark your curiosity (but for the record, triggering the traps with your
          finger wastes the plant's energy and should be avoided unless you're a professional). Most people are surprised to learn these iconic plants aren't from some alien world.
          They're endemic to a tiny region of the coastal Carolinas, not Mars.
        </p>
      </section>

      <section style={{ margin: '0vw 0', padding: '0 5vw' }}>
        <ImageGallery images={venusFlytrapImages} />
      </section>

      <section className="intro-text">
        <p>
          For many, Venus flytraps are the gateway drug into carnivorous plants. The next stop down the rabbit hole (or perhaps more appropriately, as you fall into the pitfall trap)
          is the largest group of carnivorous plants: the pitcher plants. These plants have evolved long, cylindrical leaves filled with digestive fluid.
          This trap style is called pitfall trap - but the leaves are most commonly referred to as pitchers. Insects slip inside, can’t climb out, and slowly dissolve into nutrients.
        </p>
      </section>

      <section style={{ margin: '0vw 0', padding: '0 5vw' }}>
        <ImageGallery images={pitcherPlants} />
      </section>

      <section className="intro-text">
        <p>
          Among them, the North American pitcher plants (Sarracenia if you want to sound technical or maybe roman) are one of the most spectacular genera. As the name suggests,
          they’re native to North America, ranging from the Gulf Coast of Texas and Louisiana up the Atlantic seaboard and the Appalachian range, all the way to Maine, to Quebec,
          through Saskatchewan and over to Alberta.
          <br />
          <br />
          Their most remarkable feature is the carnivorous leaves, or pitchers. (Technically they’re “insectivorous,” but carnivorous sounds cooler.)
          The pitchers are what most growers fall in love with first. Across the ~8 species, Sarracenia produce an incredible diversity of forms: short,
          stout pitchers; tall, elegant ones; green and heavily veined; deep red; snowy white; hooded and hoodless. Despite their dramatic differences,
          the species are closely related genetically and readily hybridize, letting growers breed endless new variants and traits.
        </p>
      </section>

      <section style={{ margin: '0vw 0', padding: '0 5vw' }}>
        <ImageGallery images={sarraceniaVariation} />
      </section>

      <section className="intro-text">
        <p>
        But a lesser appreciated reason to grow these plants is their flowers. 
        They look like alien lanterns hanging down from long curved lamp posts. 
        Like claw machines arms dangling a prize over the gaping maws of the pitchers below them.
        <br />
        <br />
        So let’s reuse a metaphor and fall deeper into the pitfall trap, to learn what makes these flowers remarkable. 
        Is it worth growing for the blooms alone? Can flowers hold their own against the more famous carnivorous leaves? 
        And are some species more desirable than others? 
        After spending a fair amount of time at the Mertz Botanical Library, I don’t think there are concrete answers to these vague and subjective questions! 
        But I’ll provide as much information as I can to let you decide for yourself.
        </p>
      </section >

      <section className="intro-text">
        <p>
        First things first - let’s look at the flower itself and how it’s designed.
        </p>
      </section>
    </>
  )
}

