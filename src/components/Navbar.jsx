import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { SITE } from '../config/site'

const LINKS = [['home', 'Home'], ['services', 'Services'], ['gallery', 'Gallery'], ['about', 'About'], ['reviews', 'Reviews'], ['booking', 'Book'], ['contact', 'Contact']]
export const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f)
  }, [])
  const click = (id) => { setOpen(false); setTimeout(() => goTo(id), 150) }
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-wine/90 backdrop-blur-md py-2 shadow-lg' : 'py-4'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <button onClick={() => click('home')} className="flex items-center gap-3" aria-label="Home">
          <Logo size={44} draw={false} />
          <span className="hidden font-display text-lg tracking-[0.25em] text-ivory sm:block">{SITE.name}</span>
        </button>
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map(([id, label]) => (
            <li key={id}><button onClick={() => click(id)} className="text-xs uppercase tracking-[0.25em] text-ivory/85 transition hover:text-gold">{label}</button></li>
          ))}
        </ul>
        <button className="text-ivory lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={28} /></button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-wine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute right-5 top-5 text-ivory" onClick={() => setOpen(false)} aria-label="Close menu"><X size={30} /></button>
            {LINKS.map(([id, label], i) => (
              <motion.button key={id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}
                onClick={() => click(id)} className="font-display text-4xl text-ivory hover:text-gold">{label}</motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
