import { SITE } from '../config/site'
import { useStudioData } from '../context/StudioData'

export default function Footer() {
  const { settings } = useStudioData()
  return (
    <footer className="bg-cocoa px-5 py-8 text-center text-sm text-ivory/70">
      <p className="font-display text-2xl tracking-[0.25em] gold-text">{settings.name || SITE.name}</p>
      <p className="mt-1 italic">{settings.tagline || SITE.tagline}</p>
      <p className="mt-4 text-xs">© {new Date().getFullYear()} {settings.name || SITE.name}. All rights reserved.</p>
      <a href={`${import.meta.env.BASE_URL}admin`} className="mt-3 inline-block text-xs text-ivory/40 underline underline-offset-4 hover:text-gold">Admin</a>
    </footer>
  )
}
