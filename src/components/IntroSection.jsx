import TouchDeviceWarning from './TouchDeviceWarning'

export default function IntroSection({ isTouch }) {
  return (
    <>
      {isTouch && <TouchDeviceWarning />}
      <section className="intro-text">
        <p>
          Over the past couple of years, I've gotten into houseplants. At first it was mostly pothos and monsteras. These came naturally to me since they're some of the most popular plants around, 
          but slowly my interests broadened into a more unusual and fascinating genus: carnivorous plants. Technically, they're insectivores, but 'carnivorous' sounds more alluring.
        </p>
      </section>

      <section className="intro-text">
        <p>
        Venus flytraps are the poster child of the group - but as most carnivorous plant enthusiasts will attest, after the gateway-drug effect of the flytrap wears off, 
        you start to gravitate toward the showier and more impressive species: the pitcher plants. There are three types of pitcher plants: Nepenthes, Heliamphora, Darlingtonia, 
        and of course—the North American pitcher plants.
        <br />
        <br/>
        North American pitcher plants, or Sarracenia, are unique in their immense genetic and morphological diversity. You can have squat and fat pitchers, 
        tall and thin pitchers, green, yellow, red, even purple pitchers. Cultivists become obsessed with collecting unique morphologies (called cultivars) 
        bred by professional growers—and some even begin breeding their own.
        </p>
      </section>

      <section className="intro-text">
        <p>
        To breed sarracenia, you need to understand the anatomy of the Sarracenia flower. Its floral structure is also used to delineate species and subspecies, since each has distinctive morphological traits.
        </p>
      </section>
    </>
  )
}

