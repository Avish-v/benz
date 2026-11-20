import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import Reveal from './Reveal'
import { useStudioData } from '../context/StudioData'
import { formatPrice } from '../config/site'
import { supabase, supabaseConfigured } from '../lib/supabase'

const TIMES = ['Early Morning (4–7 AM)', 'Morning (7–11 AM)', 'Afternoon (11 AM–3 PM)', 'Evening (3–7 PM)', 'Night (7 PM onwards)']
const initialForm = { name: '', phone: '', serviceId: '', packageId: '', date: '', time: '', message: '' }
const FieldError = ({ children }) => children ? <p className="mt-1 text-xs text-red-700">{children}</p> : null

function localDateString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export default function Booking() {
  const { services, packages, settings } = useStudioData()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [requestReady, setRequestReady] = useState(false)
  const [formError, setFormError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const today = localDateString()
  const selectedService = services.find((service) => service.id === form.serviceId)
  const availablePackages = useMemo(
    () => packages.filter((item) => item.service_id === form.serviceId && item.active),
    [packages, form.serviceId],
  )

  useEffect(() => {
    const selectPackage = (event) => {
      setForm((current) => ({
        ...current,
        serviceId: event.detail.serviceId || '',
        packageId: event.detail.packageId || '',
      }))
      setRequestReady(false)
    }
    window.addEventListener('benz:booking-select', selectPackage)
    return () => window.removeEventListener('benz:booking-select', selectPackage)
  }, [])

  const update = (key) => (event) => {
    const value = event.target.value
    setForm((current) => ({ ...current, [key]: value, ...(key === 'serviceId' ? { packageId: '' } : {}) }))
    setRequestReady(false)
    setFormError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name'
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 15) nextErrors.phone = 'Enter a valid phone number'
    if (!selectedService) nextErrors.serviceId = 'Choose a service'
    if (!form.date || form.date < today) nextErrors.date = 'Choose today or a future date'
    if (!form.time) nextErrors.time = 'Choose a preferred time'
    if (availablePackages.length && !form.packageId) nextErrors.packageId = 'Choose a package or ask us to recommend one'
    setErrors(nextErrors)
    setFormError('')
    setRequestReady(false)
    if (Object.keys(nextErrors).length) return

    const whatsappNumber = (settings.whatsapp || '').replace(/\D/g, '')
    if (whatsappNumber.length < 10) {
      setFormError('The studio WhatsApp number has not been configured yet. Please contact the studio directly.')
      return
    }

    const selectedPackage = availablePackages.find((item) => item.id === form.packageId)
    const bookingText = [
      `Hello ${settings.name || 'BENZ BEAUTY STUDIO'}! I'd like to request an appointment.`,
      '',
      `*Name:* ${form.name.trim()}`,
      `*Phone:* ${form.phone.trim()}`,
      `*Service:* ${selectedService.name}`,
      `*Package:* ${selectedPackage?.name || 'Not selected'}`,
      ...(selectedPackage?.price ? [`*Starting price:* ${formatPrice(selectedPackage.price)}`] : []),
      `*Appointment date:* ${form.date}`,
      `*Preferred time:* ${form.time}`,
      `*Additional message:* ${form.message.trim() || '-'}`,
      '',
      'Please let me know if this time is available.',
    ].join('\n')
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(bookingText)}`
    setWhatsappUrl(url)

    const whatsappWindow = window.open('about:blank', '_blank')
    if (whatsappWindow) whatsappWindow.opener = null
    try {
      if (supabaseConfigured && supabase) {
        const { error } = await supabase.from('bookings').insert({
          customer_name: form.name.trim(),
          phone: form.phone.trim(),
          service_id: selectedService.id,
          service_name: selectedService.name,
          package_id: selectedPackage?.id || null,
          package_name: selectedPackage?.name || null,
          appointment_date: form.date,
          appointment_time: form.time,
          message: form.message.trim(),
          status: 'pending',
        })
        if (error) throw error
      }
      if (whatsappWindow) whatsappWindow.location.replace(url)
      setRequestReady(true)
    } catch (saveError) {
      whatsappWindow?.close()
      setFormError(`Your enquiry could not be saved, so WhatsApp was not opened. ${saveError.message}`)
    }
  }

  return (
    <section id="booking" className="bg-ivory px-5 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow !text-burgundy">Reserve Your Date</p>
          <h2 className="h2 mt-3 text-burgundy">Book an <span className="italic">Appointment</span></h2>
          <p className="mt-3 text-cocoa/70">Your request is sent to the studio on WhatsApp. The studio will contact you to confirm availability.</p>
        </Reveal>
        <Reveal>
          <form onSubmit={submit} noValidate className="grid gap-5 rounded-[2rem] border border-gold/50 bg-white/60 p-6 shadow-xl backdrop-blur md:grid-cols-2 md:p-10">
            <div>
              <label className="mb-1 block text-sm" htmlFor="booking-name">Full Name</label>
              <input id="booking-name" className="field" value={form.name} onChange={update('name')} autoComplete="name" required maxLength={100} />
              <FieldError>{errors.name}</FieldError>
            </div>
            <div>
              <label className="mb-1 block text-sm" htmlFor="booking-phone">Phone Number</label>
              <input id="booking-phone" type="tel" inputMode="tel" className="field" value={form.phone} onChange={update('phone')} autoComplete="tel" required maxLength={20} />
              <FieldError>{errors.phone}</FieldError>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm" htmlFor="booking-service">Required Service</label>
              <select id="booking-service" className="field" value={form.serviceId} onChange={update('serviceId')} required>
                <option value="">Select a service</option>
                {services.filter((service) => service.active).map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </select>
              <FieldError>{errors.serviceId}</FieldError>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm" htmlFor="booking-package">Package</label>
              <select id="booking-package" className="field" value={form.packageId} onChange={update('packageId')} disabled={!selectedService || !availablePackages.length}>
                <option value="">{availablePackages.length ? 'Select a package' : 'No package selected'}</option>
                {availablePackages.map((item) => <option key={item.id} value={item.id}>{item.name}{item.price ? ` — ${item.price}` : ''}</option>)}
              </select>
              <FieldError>{errors.packageId}</FieldError>
            </div>
            <div>
              <label className="mb-1 block text-sm" htmlFor="booking-date">Appointment Date</label>
              <input id="booking-date" type="date" min={today} className="field" value={form.date} onChange={update('date')} required />
              <FieldError>{errors.date}</FieldError>
            </div>
            <div>
              <label className="mb-1 block text-sm" htmlFor="booking-time">Preferred Time</label>
              <select id="booking-time" className="field" value={form.time} onChange={update('time')} required>
                <option value="">Select time</option>
                {TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
              <FieldError>{errors.time}</FieldError>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm" htmlFor="booking-message">Additional Message</label>
              <textarea id="booking-message" rows="4" maxLength={1000} className="field" value={form.message} onChange={update('message')} />
            </div>
            {formError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800 md:col-span-2">{formError}</p>}
            <button type="submit" className="btn bg-burgundy text-ivory hover:bg-wine md:col-span-2"><MessageCircle size={18} /> Send Booking on WhatsApp</button>
            {requestReady && <p role="status" className="flex flex-col items-center justify-center gap-2 text-center text-sm text-burgundy md:col-span-2">
              <span className="flex items-center gap-2"><CheckCircle2 size={18} /> Request prepared. Press Send in WhatsApp to contact the studio.</span>
              <span>Opening WhatsApp does not confirm your appointment; the studio will confirm with you.</span>
              <a className="underline underline-offset-4" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp manually</a>
            </p>}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
