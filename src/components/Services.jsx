import { ArrowDown, Flower2, Heart, MessageCircle, Scissors, Shirt, Sparkles } from 'lucide-react'
import Reveal from './Reveal'
import { SITE, formatPrice } from '../config/site'
import { resolveImageUrl, useStudioData } from '../context/StudioData'

const ICONS = {
  makeup: Sparkles,
  mehendi: Flower2,
  saree: Shirt,
  hairstyle: Scissors,
  'saree-draping': Heart,
}

function packagePrice(value) {
  const number = Number(String(value || '').replace(/[^\d.]/g, ''))
  return Number.isFinite(number) && number > 0 ? number : null
}

export default function Services() {
  const { services, packages, settings } = useStudioData()
  const whatsapp = (settings.whatsapp || SITE.whatsapp).replace(/\D/g, '')
  const activeServices = services
    .filter((service) => service.active)
    .sort((a, b) => a.sort_order - b.sort_order)

  const bookLink = (service, item) => {
    const price = item?.price ? formatPrice(item.price) : (service.price ? formatPrice(service.price) : 'Please share your starting rate')
    const text = [
      `Hello ${settings.name || SITE.name}! I'd like to enquire about a service.`,
      '',
      `*Service category:* ${service.name}`,
      ...(item ? [`*Selected service:* ${item.name}`] : []),
      `*Starting price:* ${price}`,
      '',
      'Please let me know about availability and the final price for my requirements.',
    ].join('\n')
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
  }

  return (
    <section id="services" className="bg-ivory px-5 pb-16 pt-16 md:pb-24 md:pt-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow !text-burgundy">Thoughtfully Styled</p>
          <h2 className="h2 mt-3 text-burgundy">Services &amp; <span className="italic">Pricing</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-cocoa/70">A considered collection of beauty services for celebrations, bridal moments and everything in between.</p>
        </Reveal>

        <nav aria-label="Service categories" className="mb-8 flex flex-wrap justify-center gap-2">
          {activeServices.map((service) => (
            <a key={service.id} href={`#svc-${service.id}`} className="rounded-full border border-gold/50 bg-white/70 px-4 py-2 text-xs uppercase tracking-widest text-burgundy transition hover:bg-burgundy hover:text-ivory">
              {service.name}
            </a>
          ))}
        </nav>

        <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activeServices.map((service, index) => {
            const Icon = ICONS[service.id] || Sparkles
            const items = packages
              .filter((item) => item.service_id === service.id && item.active)
              .sort((a, b) => a.sort_order - b.sort_order)
            const startingPrice = items.map((item) => packagePrice(item.price)).filter(Boolean).sort((a, b) => a - b)[0]
            const visibleStartingPrice = startingPrice ? formatPrice(startingPrice) : formatPrice(service.price)

            return (
              <Reveal key={service.id} delay={index * 0.06}>
                <article id={`svc-${service.id}`} className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-gold/45 bg-white/80 shadow-lg shadow-burgundy/5 transition duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative overflow-hidden bg-blush">
                    <img
                      src={resolveImageUrl(service.image_url)}
                      alt={service.name}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition duration-700 hover:scale-105"
                    />
                    <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-wine/90 text-gold shadow-lg">
                      <Icon size={20} />
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="eyebrow !text-burgundy">{service.kicker || 'BENZ BEAUTY STUDIO'}</p>
                    <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-3xl text-burgundy">{service.name}</h3>
                      {visibleStartingPrice && <p className="text-sm font-medium text-burgundy">Starts at {visibleStartingPrice}</p>}
                    </div>
                    <p className="mt-2 min-h-12 text-sm leading-relaxed text-cocoa/70">{service.description}</p>

                    <div className="mt-5 border-t border-gold/30">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 border-b border-gold/20 py-3 last:border-b-0">
                          <div className="min-w-0">
                            <p className="font-medium text-cocoa">{item.name}</p>
                            {item.description && <p className="mt-0.5 text-xs leading-relaxed text-cocoa/60">{item.description}</p>}
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <span className="font-medium text-burgundy">{formatPrice(item.price) || 'Ask for price'}</span>
                            <a
                              href={bookLink(service, item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-burgundy underline decoration-gold underline-offset-4 transition hover:text-[#8A1632]"
                            >
                              <MessageCircle size={13} /> Book Now
                            </a>
                          </div>
                        </div>
                      ))}
                      {items.length === 0 && <p className="py-4 text-sm text-cocoa/60">Please contact us for current services and pricing.</p>}
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-9 flex flex-col items-center text-center">
          <p className="max-w-3xl text-sm text-cocoa/65">Prices are starting rates. Final prices may vary depending on customer requirements.</p>
          <a href="#booking" className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-burgundy transition hover:gap-3">
            Share your appointment details <ArrowDown size={15} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
