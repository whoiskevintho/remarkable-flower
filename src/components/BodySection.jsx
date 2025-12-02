import SmellStrengthChart from './SmellStrengthChart'

export default function BodySection() {
  return (
    <>
      <section className="intro-text">
        <p>
        The anatomy of the sarracenia flower is consistent throughout the genus - however there are difference in floral coloration, 
        size, proportion, and scent. All these traits are useful when identifying a species, and can be helpful when trying to distinguish 
        the parentage in a complex hybrid. 
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

    </>
  )
}