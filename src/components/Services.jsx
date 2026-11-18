import { Sparkles, Flower2, Shirt, ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import TiltCard from './TiltCard'
import { goTo } from './Navbar'
import { SERVICES } from '../config/site'
const ICONS = { makeup: Sparkles, mehendi: Flower2, saree: Shirt }

export default function Services() {
  return (
    <section id="services" className="bg-ivory px-5 pb-10 pt-16 md:pt-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="eyebrow !text-burgundy">What We Offer</p>
          <h2 className="h2 mt-3 text-burgundy">Our <span className="italic">Services</span></h2>
        </Reveal>
        <div className="space-y-24">
          {SERVICES.map((s, idx) => {
            const Icon = ICONS[s.id]
            return (
              <div key={s.id} id={`svc-${s.id}`} className="grid items-center gap-10 lg:grid-cols-2">
                <div className={idx % 2 ? 'lg:order-2' : ''}>
                  <Reveal>
                    <TiltCard className="relative mx-auto max-w-md">
                      <div className="overflow-hidden rounded-[2rem] border border-gold/50 shadow-2xl shadow-burgundy/30">
                        <img src={s.image} alt={s.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-105" />
                      </div>
                      <div className="absolute -bottom-5 -right-3 flex h-16 w-16 items-center justify-center rounded-full bg-burgundy text-gold shadow-xl" style={{ transform: 'translateZ(70px)' }}><Icon /></div>
                    </TiltCard>
                  </Reveal>
                </div>
                <div>
                  <Reveal><p className="eyebrow">{s.kicker}</p><h3 className="font-display text-5xl text-burgundy md:text-6xl">{s.title}</h3>
                    <p className="mt-4 max-w-lg text-cocoa/80">{s.blurb}</p></Reveal>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {s.items.map(([name, desc], i) => (
                      <Reveal key={name} delay={i * 0.07} y={25}>
                        <TiltCard className="group h-full rounded-2xl border border-gold/40 bg-white/70 p-5 transition hover:bg-burgundy hover:shadow-xl">
                          <h4 className="font-display text-2xl text-burgundy transition group-hover:text-gold">{name}</h4>
                          <p className="mt-1 text-sm text-cocoa/70 transition group-hover:text-ivory/85">{desc}</p>
                        </TiltCard>
                      </Reveal>
                    ))}
                  </div>
                  <Reveal delay={0.2}><button onClick={() => goTo('booking')} className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-burgundy transition-all hover:gap-4">Book {s.title} <ArrowRight size={16} /></button></Reveal>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
