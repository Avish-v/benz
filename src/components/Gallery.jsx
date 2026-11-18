import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import Reveal from './Reveal'
import { GALLERY, GALLERY_CATS } from '../config/site'

export default function Gallery() {
  const [cat, setCat] = useState('All')
  const [active, setActive] = useState(null)
  const items = cat === 'All' ? GALLERY : GALLERY.filter((g) => g.cat === cat)
  const step = useCallback((d) => setActive((a) => (a === null ? a : (a + d + items.length) % items.length)), [items.length])
  useEffect(() => {
    if (active === null) return
    const k = (e) => { if (e.key === 'Escape') setActive(null); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }
    document.body.style.overflow = 'hidden'; window.addEventListener('keydown', k)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', k) }
  }, [active, step])
  const cur = active !== null ? items[active] : null
  return (
    <section id="gallery" className="bg-wine px-5 pb-16 pt-10 text-ivory md:pb-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 text-center"><p className="eyebrow">Portfolio</p><h2 className="h2 mt-3">Our <span className="gold-text italic">Gallery</span></h2></Reveal>
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {GALLERY_CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${cat === c ? 'border-gold bg-gold text-wine' : 'border-gold/40 text-ivory/80 hover:border-gold'}`}>{c}</button>
          ))}
        </div>
        {items.length === 0 && <p className="text-center text-ivory/60">Photos coming soon.</p>}
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {items.map((g, i) => (
            <button key={g.id} onClick={() => setActive(i)} className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-gold/30" aria-label={`Open ${g.alt}`}>
              <img src={g.poster || g.src} alt={g.alt} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-110 ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} />
              {g.type === 'video' && <span className="absolute inset-0 flex items-center justify-center bg-black/30"><Play className="text-gold" size={40} /></span>}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wine/90 to-transparent p-3 text-left text-xs uppercase tracking-widest opacity-0 transition group-hover:opacity-100">{g.cat}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {cur && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} role="dialog" aria-modal="true">
            <button className="absolute right-5 top-5 text-ivory" onClick={() => setActive(null)} aria-label="Close"><X size={32} /></button>
            <button className="absolute left-3 text-gold md:left-8" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous"><ChevronLeft size={44} /></button>
            <button className="absolute right-3 text-gold md:right-8" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next"><ChevronRight size={44} /></button>
            <motion.div key={cur.id} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
              {cur.type === 'video'
                ? <video src={cur.src} poster={cur.poster} controls autoPlay playsInline className="max-h-[85vh] max-w-[90vw] rounded-xl" />
                : <img src={cur.src} alt={cur.alt} className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain" />}
              <p className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-gold">{cur.cat}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
