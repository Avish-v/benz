import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count }) {
  const ref = useRef()
  const pos = useMemo(() => { const a = new Float32Array(count * 3); for (let i = 0; i < a.length; i++) a[i] = (Math.random() - 0.5) * (i % 3 === 2 ? 6 : 14); return a }, [count])
  useFrame((st, d) => { ref.current.rotation.y += d * 0.03; ref.current.position.y = Math.sin(st.clock.elapsedTime / 4) * 0.2 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial color="#E6C98F" size={0.045} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Petals({ count }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geo = useMemo(() => {
    const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.12, 0.08, 0.12, 0.3, 0, 0.42); s.bezierCurveTo(-0.12, 0.3, -0.12, 0.08, 0, 0)
    return new THREE.ShapeGeometry(s)
  }, [])
  const data = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 12, y: Math.random() * 9 - 4.5, z: (Math.random() - 0.5) * 4,
    v: 0.2 + Math.random() * 0.35, sw: Math.random() * 6, r: Math.random() * 3, s: 0.5 + Math.random() * 0.7 })), [count])
  useFrame((st, d) => {
    const t = st.clock.elapsedTime
    data.forEach((p, i) => {
      p.y -= p.v * d; if (p.y < -4.8) p.y = 4.8
      dummy.position.set(p.x + Math.sin(t * 0.6 + p.sw) * 0.5, p.y, p.z)
      dummy.rotation.set(t * 0.5 + p.r, t * 0.4 + p.sw, t * 0.3)
      dummy.scale.setScalar(p.s); dummy.updateMatrix(); mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]}>
      <meshBasicMaterial color="#F4C2C2" side={THREE.DoubleSide} transparent opacity={0.75} />
    </instancedMesh>
  )
}

function Ornament({ small }) {
  const g = useRef(), a = useRef(), b = useRef(), c = useRef()
  useFrame((st, d) => {
    a.current.rotation.x += d * 0.35; b.current.rotation.y += d * 0.3; c.current.rotation.z += d * 0.2
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, st.pointer.x * 0.5, 0.05)
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -st.pointer.y * 0.3, 0.05)
    g.current.position.y = (small ? 1.1 : 0.2) + Math.sin(st.clock.elapsedTime * 0.8) * 0.12
  })
  return (
    <group ref={g} position={small ? [0, 1.1, -1] : [2.6, 0.2, -1]} scale={small ? 0.7 : 1}>
      <mesh ref={a}><torusGeometry args={[1.3, 0.025, 12, 100]} /><meshStandardMaterial color="#D4AF7A" metalness={0.95} roughness={0.25} /></mesh>
      <mesh ref={b}><torusGeometry args={[1.0, 0.025, 12, 100]} /><meshStandardMaterial color="#D4AF7A" metalness={0.95} roughness={0.25} /></mesh>
      <mesh ref={c}><torusKnotGeometry args={[0.45, 0.04, 120, 10, 3, 4]} /><meshStandardMaterial color="#D4AF7A" metalness={0.95} roughness={0.25} /></mesh>
    </group>
  )
}

export default function Hero3D({ mobile }) {
  return (
    <Canvas dpr={[1, mobile ? 1.5 : 2]} camera={{ position: [0, 0, 5], fov: 55 }} gl={{ alpha: true, antialias: !mobile, powerPreference: 'high-performance' }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 4]} intensity={40} color="#F1DDB0" />
      <pointLight position={[-4, -2, 3]} intensity={20} color="#F4C2C2" />
      <Particles count={mobile ? 120 : 320} />
      <Petals count={mobile ? 14 : 34} />
      <Ornament small={mobile} />
    </Canvas>
  )
}
