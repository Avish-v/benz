import { MessageCircle } from 'lucide-react'
import { SITE } from '../config/site'
export default function FloatingWhatsApp() {
  return (
    <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110">
      <MessageCircle />
    </a>
  )
}
