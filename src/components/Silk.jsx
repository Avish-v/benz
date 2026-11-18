import { motion } from 'framer-motion'
// Flowing silk-fabric wave divider between sections
export default function Silk({ fill = '#FAF3E8', flip = false }) {
  const d = 'M0,60 C240,0 480,120 720,60 C960,0 1200,120 1440,60 L1440,120 L0,120 Z'
  return (
    <div className={`relative -mt-[1px] h-16 w-full overflow-hidden md:h-24 ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <motion.svg viewBox="0 0 2880 120" preserveAspectRatio="none" className="absolute bottom-0 h-full w-[200%]"
        animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
        <g><path d={d} fill={fill} opacity=".45" transform="translate(0,-10)" /><path d={d} fill={fill} /></g>
        <g transform="translate(1440,0)"><path d={d} fill={fill} opacity=".45" transform="translate(0,-10)" /><path d={d} fill={fill} /></g>
      </motion.svg>
    </div>
  )
}
