# benz

# BENZ BEAUTY STUDIO – React + Vite website

## Run
    npm install
    npm run dev        # development
    npm run build      # production build -> /dist

## Client details (REQUIRED)
Edit `src/config/site.js`: WhatsApp number, phone, Instagram, address, services, gallery.

## Replace photos / videos
- Put files in `public/images` and `public/videos`, then update paths in `src/config/site.js`.
- Hero video: set `HERO_VIDEO` (muted, compressed MP4, under ~6 MB). Compress images to WebP (~200 KB).
- Gallery supports `type: 'video'` entries (see the commented example).

## Notes
- Placeholder SVGs are included; no fake testimonials, qualifications or awards.
- The 3D scene (React Three Fiber) is lazy-loaded, uses fewer particles on mobile, and is off for reduced-motion users.
- Update the canonical link, og tags and JSON-LD in `index.html` once the domain is known.
