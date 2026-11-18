import { SITE } from '../config/site'
export default function Footer() {
  return (
    <footer className="bg-cocoa px-5 py-8 text-center text-sm text-ivory/70">
      <p className="font-display text-2xl tracking-[0.25em] gold-text">{SITE.name}</p>
      <p className="mt-1 italic">{SITE.tagline}</p>
      <p className="mt-4 text-xs">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
    </footer>
  )
}
