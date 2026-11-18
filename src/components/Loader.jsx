import { motion } from 'framer-motion'
import Logo from './Logo'
export default function Loader() {
  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-wine"
      initial={{ clipPath: 'inset(0 0 0% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
      <Logo size={120} />
      <p className="mt-6 font-display text-2xl tracking-[0.3em] gold-text">BENZ BEAUTY STUDIO</p>
      <div className="mt-8 h-px w-48 overflow-hidden bg-gold/20">
        <motion.div className="h-full bg-gold" initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 2, ease: 'easeInOut' }} />
      </div>
    </motion.div>
  )
}
