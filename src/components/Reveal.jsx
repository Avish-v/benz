import { motion } from 'framer-motion'
export default function Reveal({ children, delay = 0, y = 40, className = '' }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
export function WordReveal({ text, className = '', delay = 0, animate = true }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.25em]">
          <motion.span className="inline-block" initial={{ y: '110%' }} animate={animate ? { y: 0 } : {}}
            transition={{ duration: 1, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>
        </span>
      ))}
    </span>
  )
}
