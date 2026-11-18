import { motion } from 'framer-motion'
export default function Logo({ size = 90, draw = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Benz Beauty Studio logo">
      <motion.circle cx="50" cy="50" r="46" stroke="#D4AF7A" strokeWidth="1.5"
        initial={draw ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
      <motion.circle cx="50" cy="50" r="40" stroke="#D4AF7A" strokeOpacity=".4" strokeWidth=".8"
        initial={draw ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: .2 }} />
      <motion.text x="50" y="64" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="44" fontWeight="600" fill="#D4AF7A"
        initial={draw ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: .8, duration: .8 }}>B</motion.text>
    </svg>
  )
}
