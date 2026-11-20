import { MessageCircle, Star } from 'lucide-react'
import Reveal from './Reveal'
import { SITE } from '../config/site'
import { useStudioData } from '../context/StudioData'

export default function Reviews() {
  const { reviews, settings } = useStudioData()
  const visibleReviews = reviews.filter((review) => review.is_published)
  const whatsapp = (settings.whatsapp || SITE.whatsapp).replace(/\D/g, '')
  const message = encodeURIComponent(`Hello ${settings.name || SITE.name}, I would like to share feedback about my experience.`)

  return (
    <section id="reviews" className="bg-wine px-5 py-16 text-ivory md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow">A Little Love</p>
          <h2 className="h2 mt-3">Client <span className="gold-text italic">Reviews</span></h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ivory/70">A selection of feedback shared by our clients.</p>
        </Reveal>

        {visibleReviews.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleReviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.06}>
                <article className="h-full rounded-2xl border border-gold/35 bg-white/[0.06] p-6">
                  <div className="flex gap-1 text-gold" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <Star key={starIndex} size={16} fill={starIndex < review.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <blockquote className="mt-4 leading-relaxed text-ivory/90">“{review.content}”</blockquote>
                  <p className="mt-5 text-sm font-medium text-gold">{review.customer_name}</p>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-xl rounded-2xl border border-gold/30 bg-white/[0.05] px-6 py-8 text-center text-sm text-ivory/75">
            Client reviews will appear here as they are shared with the studio.
          </p>
        )}

        {whatsapp.length >= 10 && (
          <Reveal className="mt-8 text-center">
            <a href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <MessageCircle size={17} /> Share your experience
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
