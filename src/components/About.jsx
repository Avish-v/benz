import Reveal from './Reveal'
import TiltCard from './TiltCard'
import { goTo } from './Navbar'
import { IMG, SITE } from '../config/site'
// Replace the copy below with the artist's real story. No qualifications/years/awards are claimed on purpose.
export default function About() {
  return (
    <section id="about" className="bg-blush px-5 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <TiltCard className="relative mx-auto max-w-md">
            <div className="absolute -inset-3 rounded-[2.5rem] border border-gold/70" />
            <img src={IMG.about} alt="Founder of BENZ BEAUTY STUDIO" loading="lazy" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl" />
          </TiltCard>
        </Reveal>
        <div>
          <Reveal><p className="eyebrow !text-burgundy">Meet The Artist</p><h2 className="h2 mt-3 text-burgundy">The Story Behind <span className="italic">{SITE.name}</span></h2></Reveal>
          <Reveal delay={0.1}><p className="mt-6 text-lg leading-relaxed text-cocoa/85">BENZ BEAUTY STUDIO is a beauty studio built around one belief: <em>{SITE.tagline}</em> Every client is treated as an individual, and every look is created to make you feel like yourself at your most radiant.</p></Reveal>
          <Reveal delay={0.2}><h3 className="mt-8 font-display text-3xl text-burgundy">Our Beauty Philosophy</h3>
            <p className="mt-2 text-cocoa/80">Beauty is personal. We enhance your natural features, respect your traditions and pay attention to the details that make your day memorable.</p></Reveal>
          <Reveal delay={0.3}><h3 className="mt-8 font-display text-3xl text-burgundy">What We Do</h3>
            <p className="mt-2 text-cocoa/80">Professional makeup and beautician services, bridal and traditional mehendi, and saree pleating and draping, all in one place.</p>
            <button onClick={() => goTo('booking')} className="btn mt-8 bg-burgundy text-ivory hover:bg-wine">Book Your Look</button></Reveal>
        </div>
      </div>
    </section>
  )
}
