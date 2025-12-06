import SmellStrengthChart from './SmellStrengthChart'
import FlowerSizeLatitudeChart from './FlowerSizeLatitudeChart'
import Cladogram from './Cladogram'

export default function BodySection() {
  return (
    <>
      <section className="intro-text">
        <p>
          Few plants have evolved such a complex pollination scheme. Their one-way pollination pathway strongly favors cross-pollination, or 'outcrossing'.
          Many researchers believe this is a major reason <i>Sarracenia</i> have such a range of morphological traits. Ironically,
          this reliance on cross-pollination also means the genus carries a heavy 'genetic load'. When self-pollination
          does occur, those hidden deleterious genes are more-likely to be expressed, leading to rapid inbreeding depression.
          <br />
          <br />
          We’ll be referring to the specific <i>Sarracenia</i> species throughout the rest of the story, so here is a cladogram to get you oriented.
        </p>
      </section>
      <section className="intro-text">
        <Cladogram />
      </section>

      <section className="intro-text">
        <p>
          This complex design also means that the humble bumble bee is the primary pollinator of Sarracenia, and one of the few insects that knows how to enter and exit its complex flower.
          In this way, <i>Sarracenia</i> bound to the bumble bee by fate. If the bumble bee were to go away, the <i>Sarracenia</i> would have a hard time finding other insects to pick up the slack.
          So what draws a bumblebee to a <i>Sarracenia</i> flower? Like most blooms, it comes down to sight and scent.
        </p>
      </section>

      <section className="intro-text">
        <SmellStrengthChart />
      </section>

      <section className="intro-text">
        <p>
          Despite the beautiful intricacies of the flower design, their fragrance can be less enchanting. Unless you’re a cat, because several <i>Sarracenia</i> species produce flowers with a distinctly feline musk.
          This is fortunate for the plants, because bumblebees seem to like it. This is unfortunate for us gardeners, because they smell like cat pee. But <i>Sarracenia</i> are large, full-sun, temperate bog plants, 
          so they’re meant to live outdoors anyway. Don’t expect to grow <i>S. flava</i> inside and wake up to the gentle smell of spring blossoms.
          <br />
          <br />
          If we group the species by scent alone, <i>S. minor</i> lands in the 'fruit-like' category, the rubra complex is consistently sweet and pleasant, and <i>S. flava</i> smells a lot like pee.
        </p>
      </section >

      <section className="intro-text">
        <p>
          Let’s take a closer look at the petal morphology and explore the range of traits in <i>Sarracenia</i> flowers.
        </p>
      </section>

    </>
  )
}