import SmellStrengthChart from './SmellStrengthChart'
import FlowerSizeLatitudeChart from './FlowerSizeLatitudeChart'
import Cladogram from './Cladogram'

export default function BodySection() {
  return (
    <>
      <section className="intro-text">
        <p>
          Few plants have evolved such a complex pollination scheme. Their one-way pollination pathway strongly favors cross-pollination (or 'outcrossing'),
          and many researchers believe this is a major reason pitcher plants show such a range in morphological diversity. Ironically,
          this reliance on cross-pollination also means the genus carries a heavy genetic load. When self-pollination
          does occur, those hidden deleterious genes are suddenly expressed, leading to rapid inbreeding depression.
        </p>
      </section>
      <section className="intro-text">
        <Cladogram />
      </section>

      <section className="intro-text">
        <p>
          This complex design also means that the humble bumble bee is the primary pollinator of Sarracenia, and one of the few insects that knows how to enter and exit its complex flower.
          In this way, the bumble bee and the Sarracenia are bound together by fate - if the bumble bee were to go away, the Sarracenia would have a hard time finding other insects to pick up the slack.
          So what draws a bumblebee to a Sarracenia flower? Like most blooms, it comes down to sight and scent.
        </p>
      </section>

      <section className="intro-text">
        <SmellStrengthChart />
      </section>

      <section className="intro-text">
        <p>
          Despite the beautiful intricacies of the flower design, their fragrance is less enchanting. Unless you’re a cat, because several Sarracenia species produce flowers with a distinctly feline musk.
          This is fortunate for the plants, because bumblebees seem to ‘like’ it. This is unfortunate for us gardeners, becasue they smell like cat pee. Sarracenia are large, full-sun, temperate bog plants though, so they’re meant to live outdoors anyway.
          Don’t expect to grow one inside and wake up to the gentle smell of spring blossoms.
          <br />
          <br />
          As we continue our quest to find the most desirable Sarracenia species, we'll keep in mind that S. minor smells subtley of watermelon, that the S. rubra complex has a sweet fragrance,
          and that S. flava smells of pee.
        </p>
      </section >

      <section className="intro-text">
        <p>
          Let’s take a closer look at the petal morphology and explore the range of traits in Sarracenia flowers.
        </p>
      </section>

    </>
  )
}