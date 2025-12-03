import SmellStrengthChart from './SmellStrengthChart'
import FlowerSizeLatitudeChart from './FlowerSizeLatitudeChart'

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
        <SmellStrengthChart />
      </section>

      <section className="intro-text">
        <p>
        One of the main characteristics is scent, most sarracenia have a sweet smell, but others smell like cat urine. 
        Schnell & McPherson documented this variation amongst species in their monograph.
        </p>
      </section>

      <section className="intro-text">
        <p>
        The anatomy of the sarracenia flower is consistent throughout the genus - however there are difference in floral coloration, 
        size, proportion, and scent. All these traits are useful when identifying a species, and can be helpful when trying to distinguish 
        the parentage in a complex hybrid. 
        </p>
      </section>

      <section className="intro-text">
        <p>
        The anatomy of the sarracenia flower is consistent throughout the genus - however there are difference in floral coloration, 
        size, proportion, and scent. All these traits are useful when identifying a species, and can be helpful when trying to distinguish 
        the parentage in a complex hybrid. 
        </p>
      </section>

    </>
  )
}