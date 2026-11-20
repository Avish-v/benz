import { Instagram, MapPin, Mail, MessageCircle, Phone } from 'lucide-react'
import Reveal from './Reveal'
import { useStudioData } from '../context/StudioData'

export default function Contact() {
  const { settings } = useStudioData()
  const whatsapp = (settings.whatsapp || '').replace(/\D/g, '')
  const phone = (settings.phoneTel || settings.phoneDisplay || '').replace(/[^\d+]/g, '')
  const address = settings.address && !/studio address|city, state/i.test(settings.address) ? settings.address : ''
  const instagramUrl = /^https:\/\/(www\.)?instagram\.com\//i.test(settings.instagram || '') && !/YOUR_HANDLE/i.test(settings.instagram) ? settings.instagram : ''
  const items = [
    ...(instagramUrl ? [[Instagram, 'Instagram', settings.instagramHandle || 'Visit our profile', instagramUrl]] : []),
    ...(whatsapp.length >= 10 ? [[MessageCircle, 'WhatsApp', 'Chat with us', `https://wa.me/${whatsapp}`]] : []),
    ...(phone.replace(/\D/g, '').length >= 10 ? [[Phone, 'Call', settings.phoneDisplay || settings.phoneTel, `tel:${phone}`]] : []),
    ...(settings.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email) ? [[Mail, 'Email', settings.email, `mailto:${settings.email}`]] : []),
    ...(address ? [[MapPin, 'Studio', address, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`]] : []),
  ]
  return (
    <section id="contact" className="bg-wine px-5 py-16 text-ivory md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 text-center"><p className="eyebrow">Get In Touch</p><h2 className="h2 mt-3">Visit <span className="gold-text italic">The Studio</span></h2></Reveal>
        <div className={`grid gap-8 ${address ? 'lg:grid-cols-2' : ''}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(([Icon, label, val, href], i) => (
              <Reveal key={label} delay={i * 0.08}>
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="flex h-full flex-col gap-2 rounded-2xl border border-gold/40 p-6 transition hover:-translate-y-1 hover:bg-gold/10">
                  <Icon className="text-gold" /><span className="text-xs uppercase tracking-[0.25em] text-gold">{label}</span><span className="break-words">{val}</span>
                </a>
              </Reveal>
            ))}
          </div>
          {address && <Reveal>
            <div className="h-80 overflow-hidden rounded-2xl border border-gold/40 lg:h-full lg:min-h-[22rem]">
              <iframe title="Studio location map" loading="lazy" className="h-full w-full" referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
            </div>
          </Reveal>}
        </div>
      </div>
    </section>
  )
}
