import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Gallery from './components/Gallery'
import About from './components/About'
import Booking from './components/Booking'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Silk from './components/Silk'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Admin from './components/Admin'
import Reviews from './components/Reviews'
import { StudioDataProvider } from './context/StudioData'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  return (
    <StudioDataProvider>
      {window.location.pathname.replace(/\/+$/, '').endsWith('/admin')
        ? <Admin />
        : <PublicSite />}
    </StudioDataProvider>
  )
}

function PublicSite() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 2200); return () => clearTimeout(t) }, [])
  useEffect(() => { if (!loading) setTimeout(() => ScrollTrigger.refresh(), 100) }, [loading])
  return (
    <>
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
      <Navbar />
      <main>
        <Hero ready={!loading} />
        <Silk fill="#FAF3E8" />
        <Services />
        <Silk fill="#3E0713" />
        <Gallery />
        <Silk fill="#F4D9D6" flip />
        <About />
        <Silk fill="#3E0713" />
        <Reviews />
        <Silk fill="#FAF3E8" />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
