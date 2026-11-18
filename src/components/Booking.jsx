import { useState } from 'react'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import Reveal from './Reveal'
import { hasRealWhatsApp, SERVICES, SITE } from '../config/site'

const TIMES = ['Early Morning (4–7 AM)', 'Morning (7–11 AM)', 'Afternoon (11 AM–3 PM)', 'Evening (3–7 PM)', 'Night (7 PM onwards)']
const init = { name: '', phone: '', service: '', date: '', time: '', message: '' }
const Err = ({ m }) => (m ? <p className="mt-1 text-xs text-red-700">{m}</p> : null)

export default function Booking() {
  const [f, setF] = useState(init)
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const today = new Date().toISOString().split('T')[0]

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Please enter your name'
    if (!/^[+]?[0-9\s-]{10,15}$/.test(f.phone.trim())) er.phone = 'Enter a valid phone number'
    if (!f.service) er.service = 'Choose a service'
    if (!f.date) er.date = 'Choose a date'
    if (!f.time) er.time = 'Choose a time'
    setErr(er); if (Object.keys(er).length) return
    const text = `Hello ${SITE.name}! I'd like to book an appointment.\n\n*Name:* ${f.name}\n*Phone:* ${f.phone}\n*Service:* ${f.service}\n*Event Date:* ${f.date}\n*Preferred Time:* ${f.time}\n*Message:* ${f.message || '-'}`
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setSent(true)
  }

  return (
    <section id="booking" className="bg-ivory px-5 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-10 text-center"><p className="eyebrow !text-burgundy">Reserve Your Date</p><h2 className="h2 mt-3 text-burgundy">Book an <span className="italic">Appointment</span></h2>
          <p className="mt-3 text-cocoa/70">Fill in the details and your booking request opens directly in WhatsApp.</p></Reveal>
        {!hasRealWhatsApp && <p className="mb-4 rounded-lg bg-gold/20 p-3 text-center text-sm text-burgundy">Developer note: set the real WhatsApp number in <code>src/config/site.js</code>.</p>}
        <Reveal>
          <form onSubmit={submit} noValidate className="grid gap-5 rounded-[2rem] border border-gold/50 bg-white/60 p-6 shadow-xl backdrop-blur md:grid-cols-2 md:p-10">
            <div><label className="mb-1 block text-sm" htmlFor="name">Full Name</label><input id="name" className="field" value={f.name} onChange={set('name')} autoComplete="name" /><Err m={err.name} /></div>
            <div><label className="mb-1 block text-sm" htmlFor="phone">Phone Number</label><input id="phone" type="tel" inputMode="tel" className="field" value={f.phone} onChange={set('phone')} autoComplete="tel" /><Err m={err.phone} /></div>
            <div className="md:col-span-2"><label className="mb-1 block text-sm" htmlFor="service">Required Service</label>
              <select id="service" className="field" value={f.service} onChange={set('service')}><option value="">Select a service</option>
                {SERVICES.map((s) => <optgroup key={s.id} label={s.title}>{s.items.map(([n]) => <option key={n} value={`${s.title} – ${n}`}>{n}</option>)}</optgroup>)}</select><Err m={err.service} /></div>
            <div><label className="mb-1 block text-sm" htmlFor="date">Event Date</label><input id="date" type="date" min={today} className="field" value={f.date} onChange={set('date')} /><Err m={err.date} /></div>
            <div><label className="mb-1 block text-sm" htmlFor="time">Preferred Time</label>
              <select id="time" className="field" value={f.time} onChange={set('time')}><option value="">Select time</option>{TIMES.map((t) => <option key={t}>{t}</option>)}</select><Err m={err.time} /></div>
            <div className="md:col-span-2"><label className="mb-1 block text-sm" htmlFor="message">Additional Message</label><textarea id="message" rows="4" className="field" value={f.message} onChange={set('message')} /></div>
            <button type="submit" className="btn bg-burgundy text-ivory hover:bg-wine md:col-span-2"><MessageCircle size={18} /> Send Booking on WhatsApp</button>
            {sent && <p className="flex items-center justify-center gap-2 text-sm text-burgundy md:col-span-2"><CheckCircle2 size={18} /> WhatsApp opened. Please press send to confirm your request.</p>}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
