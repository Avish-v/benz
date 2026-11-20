import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ChevronDown } from 'lucide-react'
import { WordReveal } from './Reveal'
import { goTo } from './Navbar'
import { HERO_VIDEO, IMG, SITE } from '../config/site'
const Hero3D = lazy(() => import('./Hero3D'))

export default function Hero({ ready }) {
  const bg = useRef(), content = useRef(), root = useRef()
  const [mobile, setMobile] = useState(false)
  const [show3D, setShow3D] = useState(false)
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 768px)').matches)
    setShow3D(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const ctx = gsap.context(() => {
      gsap.to(bg.current, { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(content.current, { yPercent: -15, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const move = (e) => gsap.to(bg.current, { x: (e.clientX / innerWidth - 0.5) * -25, duration: 1, overwrite: 'auto' })
    window.addEventListener('mousemove', move); return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <section id="home" ref={root} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-wine">
      <div ref={bg} className="absolute -inset-10 will-change-transform">
        {HERO_VIDEO
          ? <video className="h-full w-full object-cover" src={HERO_VIDEO} poster={IMG.hero} autoPlay muted loop playsInline preload="metadata" />
          : <img src={IMG.hero} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-wine/80 via-wine/40 to-wine/90" />
      <div className="pointer-events-none absolute inset-0">{show3D && <Suspense fallback={null}><Hero3D mobile={mobile} /></Suspense>}</div>
      <div ref={content} className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center">
        <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="eyebrow mb-6">{SITE.name}</motion.p>
        <h1 className="font-display text-5xl font-medium leading-[1.05] text-ivory sm:text-6xl md:text-8xl">
          <WordReveal text="Where Beauty Meets" animate={ready} delay={0.3} /><br />
          <WordReveal text="Artistry." className="gold-text italic" animate={ready} delay={0.8} />
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-6 text-sm uppercase tracking-[0.3em] text-blush sm:text-base">Bridal Makeup | Mehendi | Saree Pleating | Hairstyle | Saree Draping</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.6 }} className="mt-3 font-display text-xl italic text-gold">{SITE.tagline}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.8 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="btn btn-gold" onClick={() => goTo('services')}>Explore Services</button>
          <button className="btn btn-ghost" onClick={() => goTo('booking')}>Book Appointment</button>
        </motion.div>
      </div>
      <button onClick={() => goTo('services')} aria-label="Scroll down" className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-gold"><ChevronDown /></button>
    </section>
  )
}
