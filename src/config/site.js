// ======= EDIT THIS FILE WITH THE CLIENT'S REAL DETAILS =======
export const SITE = {
  name: 'BENZ BEAUTY STUDIO',
  tagline: 'Your Beauty, Our Passion.',
  whatsapp: '91XXXXXXXXXX',            // country code + number, digits only (e.g. 919876543210)
  phoneDisplay: '+91 XXXXX XXXXX',
  phoneTel: '+91XXXXXXXXXX',
  instagram: 'https://www.instagram.com/YOUR_HANDLE',
  instagramHandle: '@your_handle',
  address: 'Studio address, City, State, India', // used for text AND Google Maps embed
}
export const hasRealWhatsApp = !/X/i.test(SITE.whatsapp)

export const IMG = {
  hero: '/images/placeholder-bridal.svg',
  about: '/images/placeholder-bridal.svg',
  makeup: '/images/placeholder-makeup.svg',
  mehendi: '/images/placeholder-mehendi.svg',
  saree: '/images/placeholder-saree.svg',
}
export const HERO_VIDEO = '' // e.g. '/videos/hero.mp4' (compressed, <6MB, muted loop)

export const SERVICES = [
  { id: 'makeup', title: 'Makeup', kicker: 'Beautician & Makeup Artistry', image: IMG.makeup,
    blurb: 'Skin-first makeup and beautician services tailored to your outfit, occasion and personality.',
    items: [
      ['Bridal Makeup', 'A complete look for your wedding day.'],
      ['Reception Makeup', 'Glamorous styling for the evening celebration.'],
      ['Engagement Makeup', 'Fresh, radiant looks for your ring ceremony.'],
      ['Party Makeup', 'Statement looks for every special night.'],
      ['Traditional Makeup', 'Classic looks for festivals and family functions.'] ] },
  { id: 'mehendi', title: 'Mehendi', kicker: 'Henna Artistry', image: IMG.mehendi,
    blurb: 'Hand-drawn henna designs, from intricate bridal patterns to simple everyday elegance.',
    items: [
      ['Bridal Mehendi', 'Detailed full-hand and feet designs for brides.'],
      ['Arabic Mehendi', 'Flowing, bold floral patterns.'],
      ['Traditional Mehendi', 'Timeless motifs rooted in Indian heritage.'],
      ['Simple Mehendi', 'Light, quick designs for any occasion.'],
      ['Customized Designs', 'Designs created around your own ideas.'] ] },
  { id: 'saree', title: 'Saree Styling', kicker: 'Pleating & Draping', image: IMG.saree,
    blurb: 'Perfectly pleated and draped sarees that hold their shape and flatter your silhouette.',
    items: [
      ['Saree Pleating', 'Neat, even pleats for a flawless fall.'],
      ['Bridal Saree Draping', 'Elegant draping for the bride.'],
      ['Traditional Saree Styling', 'Regional and classic draping styles.'],
      ['Function & Event Styling', 'Styled sarees for weddings and events.'] ] },
]

export const GALLERY_CATS = ['All', 'Bridal Makeup', 'Mehendi', 'Saree Styling', 'Customer Transformations']
// type: 'image' | 'video'. For video add poster. Replace src with client files.
export const GALLERY = [
  { id: 1, cat: 'Bridal Makeup', type: 'image', src: '/images/placeholder-bridal.svg', alt: 'Bridal makeup sample' },
  { id: 2, cat: 'Mehendi', type: 'image', src: '/images/placeholder-mehendi.svg', alt: 'Mehendi sample' },
  { id: 3, cat: 'Saree Styling', type: 'image', src: '/images/placeholder-saree.svg', alt: 'Saree styling sample' },
  { id: 4, cat: 'Customer Transformations', type: 'image', src: '/images/placeholder-transform.svg', alt: 'Transformation sample' },
  { id: 5, cat: 'Bridal Makeup', type: 'image', src: '/images/placeholder-makeup.svg', alt: 'Makeup sample' },
  { id: 6, cat: 'Mehendi', type: 'image', src: '/images/placeholder-bridal.svg', alt: 'Mehendi sample 2' },
  { id: 7, cat: 'Saree Styling', type: 'image', src: '/images/placeholder-makeup.svg', alt: 'Saree sample 2' },
  { id: 8, cat: 'Customer Transformations', type: 'image', src: '/images/placeholder-saree.svg', alt: 'Transformation sample 2' },
  // { id: 9, cat: 'Bridal Makeup', type: 'video', src: '/videos/reel1.mp4', poster: '/images/placeholder-bridal.svg', alt: 'Bridal reel' },
]
