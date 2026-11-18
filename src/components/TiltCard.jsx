import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
export default function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 })
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left) / r.width - 0.5); y.set((e.clientY - r.top) / r.height - 0.5) }
  const leave = () => { x.set(0); y.set(0) }
  return (
    <motion.div onMouseMove={move} onMouseLeave={leave} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: 'preserve-3d' }} className={className}>
      {children}
    </motion.div>
  )
}
