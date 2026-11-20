// ======= EDIT THIS FILE WITH THE CLIENT'S REAL DETAILS =======
export const SITE = {
  name: 'BENZ BEAUTY STUDIO',
  tagline: 'Your Beauty, Our Passion.',
  whatsapp: '917305630117',
  phoneDisplay: '+91 73056 30117',
  phoneTel: '+917305630117',
  email: 'adlinbenzadlin@gmail.com',
  instagram: 'https://www.instagram.com/benz_makeover_?evlk=dHIxMnV5ZnJ0Zmgy',
  instagramHandle: '@benz_makeover_',
  address: '',
}
export const hasRealWhatsApp = !/X/i.test(SITE.whatsapp)

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`

export const IMG = {
  hero: publicAsset('images/placeholder-bridal.svg'),
  about: publicAsset('images/studio/about-owner.webp'),
  makeup: publicAsset('images/studio/service-bridal-makeup.webp'),
  mehendi: publicAsset('images/studio/service-mehendi.webp'),
  sareePleating: publicAsset('images/studio/service-saree-pleating.webp'),
  hairstyle: publicAsset('images/studio/service-hairstyle.webp'),
  sareeDraping: publicAsset('images/studio/service-saree-draping.webp'),
}
export const HERO_VIDEO = '' // e.g. publicAsset('videos/hero.mp4') (compressed, <6MB, muted loop)

export const SERVICES = [
  { id: 'makeup', title: 'Bridal Makeup', kicker: 'Makeup Artistry', image: IMG.makeup,
    blurb: 'Makeup looks for parties, engagements, receptions and wedding celebrations.' },
  { id: 'mehendi', title: 'Mehendi', kicker: 'Henna Artistry', image: IMG.mehendi,
    blurb: 'Henna designs for everyday occasions and bridal celebrations.' },
  { id: 'saree', title: 'Saree Pleating', kicker: 'Pleating & Styling', image: IMG.sareePleating,
    blurb: 'Neatly pleated sarees for celebrations, special occasions and bridal looks.' },
  { id: 'hairstyle', title: 'Hairstyle', kicker: 'Hair Styling', image: IMG.hairstyle,
    blurb: 'Hairstyling for simple, party and bridal looks.' },
  { id: 'saree-draping', title: 'Saree Draping', kicker: 'Draping & Styling', image: IMG.sareeDraping,
    blurb: 'Saree draping for everyday occasions, celebrations and bridal looks.' },
]

export const DEFAULT_PACKAGES = [
  { id: 'bridal-makeup-party', service_id: 'makeup', name: 'Party Makeup', description: 'Makeup styling for parties and celebrations.', price: '1500', active: true, sort_order: 0 },
  { id: 'bridal-makeup-engagement', service_id: 'makeup', name: 'Engagement Makeup', description: 'Makeup styling for engagement celebrations.', price: '4000', active: true, sort_order: 1 },
  { id: 'bridal-makeup-reception', service_id: 'makeup', name: 'Reception Makeup', description: 'Makeup styling for reception celebrations.', price: '5000', active: true, sort_order: 2 },
  { id: 'bridal-makeup-bridal', service_id: 'makeup', name: 'Bridal Makeup', description: 'Bridal makeup for your wedding celebration.', price: '8000', active: true, sort_order: 3 },
  { id: 'mehendi-simple', service_id: 'mehendi', name: 'Simple Mehendi', description: 'Simple henna design.', price: '300', active: true, sort_order: 0 },
  { id: 'mehendi-arabic', service_id: 'mehendi', name: 'Arabic Mehendi', description: 'Arabic henna design.', price: '500', active: true, sort_order: 1 },
  { id: 'mehendi-both-hands', service_id: 'mehendi', name: 'Both Hands Mehendi', description: 'Henna designs for both hands.', price: '1000', active: true, sort_order: 2 },
  { id: 'mehendi-bridal', service_id: 'mehendi', name: 'Bridal Mehendi', description: 'Bridal henna design.', price: '3000', active: true, sort_order: 3 },
  { id: 'mehendi-full-bridal', service_id: 'mehendi', name: 'Full Bridal Mehendi', description: 'Full bridal henna design.', price: '5000', active: true, sort_order: 4 },
  { id: 'pleating-basic', service_id: 'saree', name: 'Basic Pleating', description: 'Basic saree pleating.', price: '400', active: true, sort_order: 0 },
  { id: 'pleating-pre', service_id: 'saree', name: 'Pre-Pleating', description: 'Pre-pleating service for a ready-to-wear saree.', price: '500', active: true, sort_order: 1 },
  { id: 'pleating-designer', service_id: 'saree', name: 'Designer Pleating', description: 'Designer saree pleating.', price: '700', active: true, sort_order: 2 },
  { id: 'pleating-bridal', service_id: 'saree', name: 'Bridal Saree Pleating', description: 'Saree pleating for bridal wear.', price: '1000', active: true, sort_order: 3 },
  { id: 'hairstyle-simple', service_id: 'hairstyle', name: 'Simple Hairstyle', description: 'Simple hairstyling.', price: '500', active: true, sort_order: 0 },
  { id: 'hairstyle-party', service_id: 'hairstyle', name: 'Party Hairstyle', description: 'Hairstyling for parties and celebrations.', price: '800', active: true, sort_order: 1 },
  { id: 'hairstyle-curls', service_id: 'hairstyle', name: 'Curls Hairstyle', description: 'Curled hairstyle.', price: '1000', active: true, sort_order: 2 },
  { id: 'hairstyle-bridal', service_id: 'hairstyle', name: 'Bridal Hairstyle', description: 'Hairstyling for bridal wear.', price: '1500', active: true, sort_order: 3 },
  { id: 'hairstyle-premium-bridal', service_id: 'hairstyle', name: 'Premium Bridal Hairstyle', description: 'Premium hairstyling for bridal wear.', price: '2000', active: true, sort_order: 4 },
  { id: 'draping-normal', service_id: 'saree-draping', name: 'Normal Draping', description: 'Traditional saree draping.', price: '500', active: true, sort_order: 0 },
  { id: 'draping-bridal', service_id: 'saree-draping', name: 'Bridal Draping', description: 'Saree draping for bridal wear.', price: '1000', active: true, sort_order: 1 },
  { id: 'draping-designer', service_id: 'saree-draping', name: 'Designer Draping', description: 'Designer saree draping.', price: '1200', active: true, sort_order: 2 },
]

export const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const numeric = Number(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(numeric)
    ? `₹${numeric.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
    : String(value)
}

export const GALLERY_CATS = ['All', 'Bridal Makeup', 'Mehendi', 'Saree Pleating', 'Hairstyle', 'Saree Draping', 'Customer Transformations']
// type: 'image' | 'video'. For video add poster. Replace src with client files.
export const GALLERY = [
  { id: 1, cat: 'Bridal Makeup', type: 'image', src: publicAsset('images/studio/gallery1.webp'), alt: 'Makeup artist working with a client' },
  { id: 2, cat: 'Mehendi', type: 'image', src: publicAsset('images/studio/gallery2.webp'), alt: 'Intricate henna design on a hand' },
  { id: 3, cat: 'Customer Transformations', type: 'image', src: publicAsset('images/studio/gallery3.webp'), alt: 'Beauty treatment in progress' },
  { id: 4, cat: 'Mehendi', type: 'image', src: publicAsset('images/studio/gallery4.webp'), alt: 'Detailed bridal henna design' },
  { id: 5, cat: 'Saree Pleating', type: 'image', src: publicAsset('images/studio/gallery5.webp'), alt: 'Traditional saree styling' },
  { id: 6, cat: 'Mehendi', type: 'image', src: publicAsset('images/studio/gallery6.webp'), alt: 'Henna artistry on hands' },
  { id: 7, cat: 'Saree Draping', type: 'image', src: publicAsset('images/studio/gallery7.webp'), alt: 'Client in traditional bridal styling' },
  { id: 8, cat: 'Bridal Makeup', type: 'image', src: publicAsset('images/studio/gallery8.webp'), alt: 'Bridal makeup and saree styling' },
  // { id: 9, cat: 'Bridal Makeup', type: 'video', src: publicAsset('videos/reel1.mp4'), poster: publicAsset('images/placeholder-bridal.svg'), alt: 'Bridal reel' },
]
