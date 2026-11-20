import Reveal from './Reveal'
import TiltCard from './TiltCard'
import { goTo } from './Navbar'
import { IMG, SITE } from '../config/site'
import { useStudioData, resolveImageUrl } from '../context/StudioData'

export default function About() {
  const { settings } = useStudioData()
  const clientPhotos = settings.client_photos || []
  return (
    <section id="about" className="bg-blush px-5 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <TiltCard className="relative mx-auto max-w-md">
            <div className="absolute -inset-3 rounded-[2.5rem] border border-gold/70" />
            <img src={resolveImageUrl(settings.owner_photo_url || IMG.about)} alt={settings.owner_photo_url ? settings.owner_name || 'Studio owner' : 'BENZ BEAUTY STUDIO portrait'} loading="lazy" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl" />
            {settings.owner_name && <span className="absolute bottom-4 left-4 rounded-full bg-wine/90 px-4 py-2 text-sm text-ivory">{settings.owner_name}</span>}
          </TiltCard>
        </Reveal>
        <div>
          <Reveal><p className="eyebrow !text-burgundy">{settings.owner_name ? `Meet ${settings.owner_name}` : 'Meet The Artist'}</p><h2 className="h2 mt-3 text-burgundy">The Story Behind <span className="italic">{SITE.name}</span></h2></Reveal>
          <Reveal delay={0.1}><p className="mt-6 text-lg leading-relaxed text-cocoa/85">{settings.studio_intro || `${SITE.name} is a beauty studio built around one belief: ${SITE.tagline} Every client is treated as an individual, and every look is created to make you feel like yourself at your most radiant.`}</p></Reveal>
          {settings.owner_bio && <Reveal delay={0.2}><h3 className="mt-8 font-display text-3xl text-burgundy">{settings.owner_name || 'Our Artist'}</h3><p className="mt-2 text-cocoa/80">{settings.owner_bio}</p></Reveal>}
          {settings.owner_experience && <Reveal delay={0.25}><h3 className="mt-6 font-display text-3xl text-burgundy">Professional Experience</h3><p className="mt-2 text-cocoa/80">{settings.owner_experience}</p></Reveal>}
          {!settings.owner_bio && <Reveal delay={0.2}><h3 className="mt-8 font-display text-3xl text-burgundy">Our Beauty Philosophy</h3>
            <p className="mt-2 text-cocoa/80">Beauty is personal. We enhance your natural features, respect your traditions and pay attention to the details that make your day memorable.</p></Reveal>}
          <Reveal delay={0.3}><h3 className="mt-8 font-display text-3xl text-burgundy">What We Do</h3>
            <p className="mt-2 text-cocoa/80">Professional makeup and beautician services, bridal and traditional mehendi, and saree pleating and draping, all in one place.</p>
            <button onClick={() => goTo('booking')} className="btn mt-8 bg-burgundy text-ivory hover:bg-wine">Book Your Look</button></Reveal>
          {clientPhotos.length > 0 && <div className="mt-10">
            <h3 className="font-display text-3xl text-burgundy">Our Clients</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {clientPhotos.map((photo) => <img key={photo.url || photo} src={resolveImageUrl(photo.url || photo)} alt={photo.title || 'BENZ BEAUTY STUDIO client'} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />)}
            </div>
          </div>}
        </div>
      </div>
    </section>
  )
}
