import TouchDeviceWarning from './TouchDeviceWarning'

export default function IntroSection({ isTouch }) {
  return (
    <>
      {isTouch && <TouchDeviceWarning />}
      <section className="intro-text">
        <p>
        You’re most likely familiar with the Venus flytrap. It’s the poster child of the carnivorous plant world - gaping maws lined with red ‘teeth’ waiting for unsuspecting arthropods 
        to wander in.  All it takes is to touch one and watch it snap shut around your finger to spark curiosity in newcomers (though, for the record, triggering the traps with your 
        finger wastes the plant’s energy). Most people are surprised to learn these iconic plants aren’t from some alien world. 
        They’re endemic to a tiny region of the coastal Carolinas, not Mars.
        </p>
      </section>

      <section className="intro-text">
        <p>
        For many, Venus flytraps are the gateway drug into carnivorous plants. The next stop down the rabbit hole (or perhaps more appropriately, as you fall into the pitfall trap) 
        is the largest group of carnivorous plants: the pitcher plants. These plants have evolved long, cylindrical leaves filled with digestive fluid. 
        This trap style is called pitfall trap - but the leaves are most commonly referred to as pitchers. Insects slip inside, can’t climb out, and slowly dissolve into nutrients.
        <br />
        <br/>
        Among them, the North American pitcher plants (Sarracenia if you want to sound technical or maybe roman) are one of the most spectacular genera. As the name suggests, 
        they’re native to North America, ranging from the Gulf Coast of Texas and Louisiana up the Atlantic seaboard and the Appalachian range, all the way to Maine, to Quebec, 
        through Saskatchewan and over to Alberta.
        </p>
      </section>

      <section className="intro-text">
        <p>
        Their most remarkable feature is the carnivorous leaves, or pitchers. (Technically they’re “insectivorous,” but carnivorous sounds cooler.) 
        The pitchers are what most growers fall in love with first. Across the ~8 species, Sarracenia produce an incredible diversity of forms: short, 
        stout pitchers; tall, elegant ones; green and heavily veined; deep red; snowy white; hooded and hoodless. Despite their dramatic differences, 
        the species are closely related genetically and readily hybridize, letting growers breed endless new variants and traits.
        <br />
        <br/>
        But a lesser-known, and perhaps underappreciated, reason to grow these plants is their flowers. 
        They hang like alien lanterns on long, curved stems, like claw-machine arms suspending a prize above over the pitchers below. 
        There is simply no other flower in the plant kingdom quite like it.
        </p>
      </section>
    </>
  )
}

