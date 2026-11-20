import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_PACKAGES, GALLERY, SERVICES, SITE } from '../config/site'
import { supabase, supabaseConfigured } from '../lib/supabase'

const StudioDataContext = createContext(null)

const defaultSettings = {
  ...SITE,
  email: SITE.email,
  studio_intro: 'BENZ BEAUTY STUDIO is a beauty studio built around one belief: Your Beauty, Our Passion. Every client is treated as an individual, and every look is created to make you feel like yourself at your most radiant.',
  owner_name: '',
  owner_bio: '',
  owner_experience: '',
  owner_photo_url: '',
  client_photos: [],
}

const defaultServices = SERVICES.map((service, index) => ({
  id: service.id,
  name: service.title,
  kicker: service.kicker,
  description: service.blurb,
  price: null,
  image_url: service.image,
  active: true,
  sort_order: index,
}))

const defaultPackages = DEFAULT_PACKAGES.map((item) => ({ ...item, image_url: null }))

const defaultGallery = GALLERY.map((item, index) => ({
  id: String(item.id),
  title: item.alt,
  category: item.cat,
  image_url: item.src,
  sort_order: index,
}))

function mapSettings(row) {
  if (!row) return defaultSettings
  return {
    ...defaultSettings,
    ...row,
    name: row.studio_name || defaultSettings.name,
    tagline: row.tagline || defaultSettings.tagline,
    whatsapp: row.whatsapp_number || defaultSettings.whatsapp,
    phoneDisplay: row.phone_display || defaultSettings.phoneDisplay,
    phoneTel: row.phone_tel || defaultSettings.phoneTel,
    email: row.email || defaultSettings.email,
    instagram: row.instagram_url || defaultSettings.instagram,
    instagramHandle: row.instagram_handle || defaultSettings.instagramHandle,
    address: row.address || defaultSettings.address,
    client_photos: Array.isArray(row.client_photos) ? row.client_photos : [],
  }
}

function publicImage(url) {
  if (!url || /^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url
  if (url.startsWith(import.meta.env.BASE_URL) || url.startsWith('/')) return url
  return `${import.meta.env.BASE_URL}${url.replace(/^\/+/, '')}`
}

export function resolveImageUrl(url) {
  return publicImage(url)
}

export function StudioDataProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [services, setServices] = useState(defaultServices)
  const [packages, setPackages] = useState(defaultPackages)
  const [gallery, setGallery] = useState(defaultGallery)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!supabaseConfigured || !supabase) return
    setLoading(true)
    setError('')
    try {
      const [settingsResult, servicesResult, packagesResult, galleryResult, reviewsResult] = await Promise.all([
        supabase.from('studio_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('services').select('*').order('sort_order'),
        supabase.from('packages').select('*').order('sort_order'),
        supabase.from('gallery').select('*').order('sort_order'),
        supabase.from('studio_reviews').select('*').order('created_at', { ascending: false }),
      ])
      const failure = [settingsResult, servicesResult, packagesResult, galleryResult, reviewsResult].find((result) => result.error)
      if (failure?.error) throw failure.error
      setSettings(mapSettings(settingsResult.data))
      setServices((servicesResult.data || []).map((service) => ({
        ...service,
        image_url: publicImage(service.image_url),
        kicker: SERVICES.find((item) => item.id === service.id)?.kicker || '',
      })))
      setPackages(packagesResult.data || [])
      setGallery((galleryResult.data || []).map((item) => ({
        ...item,
        image_url: publicImage(item.image_url),
      })))
      setReviews(reviewsResult.data || [])
    } catch (loadError) {
      setError(loadError.message || 'Could not load studio information.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])
  useEffect(() => {
    if (!supabase) return undefined
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => { refresh() }, 0)
    })
    return () => listener.subscription.unsubscribe()
  }, [refresh])

  const value = useMemo(() => ({
    settings,
    services,
    packages,
    gallery,
    reviews,
    loading,
    error,
    refresh,
    setSettings,
    setServices,
    setPackages,
    setGallery,
  }), [settings, services, packages, gallery, reviews, loading, error, refresh])

  return <StudioDataContext.Provider value={value}>{children}</StudioDataContext.Provider>
}

export function useStudioData() {
  const value = useContext(StudioDataContext)
  if (!value) throw new Error('useStudioData must be used inside StudioDataProvider.')
  return value
}
