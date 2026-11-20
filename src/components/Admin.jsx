import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Images, LogOut, Mail, Package, Pencil, Plus, Save, Settings, Shield, Sparkles, Star, Trash2, Upload, Users } from 'lucide-react'
import { useStudioData } from '../context/StudioData'
import { formatPrice } from '../config/site'
import { supabase, supabaseConfigured } from '../lib/supabase'

const TABS = [
  ['home', 'Overview', BarChart3],
  ['gallery', 'Gallery', Images],
  ['about', 'About', Users],
  ['services', 'Services & Packages', Sparkles],
  ['reviews', 'Reviews', Star],
  ['bookings', 'Enquiries', Mail],
  ['contact', 'Contact settings', Settings],
]
const STATUSES = ['pending', 'contacted', 'confirmed', 'cancelled']
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const blankService = { name: '', description: '', price: '', image_url: '', active: true }
const blankPackage = { service_id: '', name: '', description: '', price: '', image_url: '', active: true }
const moneyLabel = (value) => formatPrice(value) || 'Not set'

async function uploadImage(file, folder) {
  if (!file) throw new Error('Choose an image file.')
  if (!IMAGE_TYPES.has(file.type)) throw new Error('Upload a JPG, PNG, or WebP image.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be 5 MB or smaller.')
  if (!supabase) throw new Error('Supabase is not configured.')

  const image = await createImageBitmap(file)
  const ratio = Math.min(1, 2000 / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * ratio))
  canvas.height = Math.max(1, Math.round(image.height * ratio))
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
  image.close()
  const optimized = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not optimize this image.')), 'image/webp', 0.86)
  })
  const path = `${folder}/${crypto.randomUUID()}.webp`
  const { error } = await supabase.storage.from('studio-images').upload(path, optimized, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from('studio-images').getPublicUrl(path).data.publicUrl
}

async function removeStoredImage(url) {
  if (!supabase || !url) return
  const marker = '/storage/v1/object/public/studio-images/'
  const position = url.indexOf(marker)
  if (position < 0) return
  const path = decodeURIComponent(url.slice(position + marker.length))
  const { error } = await supabase.storage.from('studio-images').remove([path])
  if (error) throw error
}

function PageMessage({ children, error = false }) {
  return <p role={error ? 'alert' : 'status'} className={`rounded-xl p-3 text-sm ${error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-900'}`}>{children}</p>
}

function TextInput({ label, value, onChange, type = 'text', ...props }) {
  return <label className="block text-sm text-cocoa/80">{label}<input className="field mt-1" type={type} value={value ?? ''} onChange={onChange} {...props} /></label>
}

function TextArea({ label, value, onChange, ...props }) {
  return <label className="block text-sm text-cocoa/80">{label}<textarea className="field mt-1" rows="4" value={value ?? ''} onChange={onChange} {...props} /></label>
}

export default function Admin() {
  const { settings, services, packages, gallery, reviews, refresh, error: dataError } = useStudioData()
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('home')
  const [bookings, setBookings] = useState([])
  const [notice, setNotice] = useState('')
  const [failure, setFailure] = useState('')

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false)
      return undefined
    }
    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) setFailure(error.message)
      setSession(data?.session || null)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setNotice('')
      setFailure('')
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const isAdmin = session?.user?.app_metadata?.role === 'admin'
  const loadBookings = async () => {
    if (!supabase) return
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setBookings(data || [])
  }
  const reloadBookings = async () => {
    try {
      await loadBookings()
      setFailure('')
    } catch (loadError) {
      setFailure(loadError.message || 'Could not load booking enquiries.')
    }
  }

  useEffect(() => {
    if (!isAdmin) return
    reloadBookings()
  }, [isAdmin])

  const run = async (action, successMessage, refreshData = true) => {
    setNotice('')
    setFailure('')
    try {
      await action()
      if (refreshData) await refresh()
      setNotice(successMessage)
      return true
    } catch (actionError) {
      setFailure(actionError.message || 'The requested change could not be saved.')
      return false
    }
  }

  const login = async (event) => {
    event.preventDefault()
    setFailure('')
    setNotice('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setFailure(error.message)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) setFailure(error.message)
    else setSession(null)
  }

  if (!supabaseConfigured) {
    return <AdminShell><SetupMessage /></AdminShell>
  }
  if (authLoading) return <AdminShell><p className="text-center text-cocoa/70">Checking admin session…</p></AdminShell>
  if (!session) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-md rounded-[2rem] border border-gold/50 bg-white p-8 shadow-xl">
          <div className="mb-6 text-center"><Shield className="mx-auto text-burgundy" size={34} /><p className="eyebrow !text-burgundy">BENZ BEAUTY STUDIO</p><h1 className="mt-2 font-display text-4xl text-burgundy">Admin sign in</h1></div>
          <form onSubmit={login} className="grid gap-4">
            <TextInput label="Email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextInput label="Password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            {failure && <PageMessage error>{failure}</PageMessage>}
            <button type="submit" className="btn bg-burgundy text-ivory hover:bg-wine">Sign in</button>
          </form>
          <p className="mt-5 text-center text-xs text-cocoa/60">Admin accounts are created in Supabase. Public sign-up is not enabled here.</p>
        </div>
      </AdminShell>
    )
  }
  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-lg rounded-[2rem] border border-gold/50 bg-white p-8 text-center shadow-xl">
          <Shield className="mx-auto text-burgundy" size={34} /><h1 className="mt-3 font-display text-3xl text-burgundy">Admin access required</h1>
          <p className="mt-3 text-sm text-cocoa/70">This account is authenticated but is not assigned the admin role. Set <code>app_metadata.role</code> to <code>admin</code> for this user in Supabase, then sign in again.</p>
          <button onClick={logout} className="btn mt-6 bg-burgundy text-ivory hover:bg-wine">Sign out</button>
        </div>
      </AdminShell>
    )
  }

  return (
    <div className="min-h-screen bg-ivory text-cocoa">
      <header className="border-b border-gold/40 bg-wine px-4 py-4 text-ivory md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div><p className="eyebrow">BENZ BEAUTY STUDIO</p><h1 className="font-display text-3xl">Admin dashboard</h1></div>
          <div className="flex items-center gap-3"><span className="hidden text-sm text-ivory/70 sm:block">{session.user.email}</span><button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-sm hover:bg-white/10"><LogOut size={16} /> Log out</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-2" aria-label="Dashboard sections">
          {TABS.map(([id, label, Icon]) => <button key={id} onClick={() => { setTab(id); setNotice(''); setFailure('') }} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${tab === id ? 'border-burgundy bg-burgundy text-ivory' : 'border-gold/50 bg-white text-burgundy hover:bg-gold/10'}`}><Icon size={16} />{label}</button>)}
        </nav>
        {dataError && <PageMessage error>{dataError}</PageMessage>}
        {failure && <div className="mb-4"><PageMessage error>{failure}</PageMessage></div>}
        {notice && <div className="mb-4"><PageMessage>{notice}</PageMessage></div>}
        {tab === 'home' && <DashboardHome services={services} packages={packages} gallery={gallery} bookings={bookings} onLoad={reloadBookings} />}
        {tab === 'gallery' && <GalleryManagement gallery={gallery} run={run} />}
        {tab === 'about' && <AboutManagement settings={settings} run={run} />}
        {tab === 'services' && <CatalogManagement services={services} packages={packages} run={run} />}
        {tab === 'reviews' && <ReviewManagement reviews={reviews} run={run} />}
        {tab === 'bookings' && <BookingManagement bookings={bookings} run={run} onLoad={reloadBookings} />}
        {tab === 'contact' && <ContactManagement settings={settings} run={run} />}
      </main>
    </div>
  )
}

function AdminShell({ children }) {
  return <main className="min-h-screen bg-ivory px-5 py-12"><a href={import.meta.env.BASE_URL} className="mx-auto mb-8 block max-w-4xl text-sm text-burgundy underline underline-offset-4">← Return to the website</a>{children}</main>
}

function SetupMessage() {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-gold/50 bg-white p-8 shadow-xl">
      <Shield className="text-burgundy" size={34} /><h1 className="mt-3 font-display text-3xl text-burgundy">Admin setup required</h1>
      <p className="mt-3 text-cocoa/75">Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, apply <code>supabase/schema.sql</code>, and create an admin user before signing in.</p>
    </div>
  )
}

function DashboardHome({ services, packages, gallery, bookings, onLoad }) {
  const summary = useMemo(() => [
    ['Gallery images', gallery.length, Images],
    ['Services', services.length, Sparkles],
    ['Packages', packages.length, Package],
    ['Booking enquiries', bookings.length, Mail],
    ['Pending enquiries', bookings.filter((item) => item.status === 'pending').length, Users],
    ['Confirmed enquiries', bookings.filter((item) => item.status === 'confirmed').length, BarChart3],
  ], [gallery, services, packages, bookings])
  return (
    <section>
      <h2 className="font-display text-3xl text-burgundy">Overview</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map(([label, count, Icon]) => <article key={label} className="rounded-2xl border border-gold/40 bg-white p-5 shadow-sm"><Icon className="text-burgundy" /><p className="mt-3 text-sm text-cocoa/65">{label}</p><p className="font-display text-4xl text-burgundy">{count}</p></article>)}
      </div>
      {!bookings.length && <p className="mt-5 text-sm text-cocoa/65">No booking enquiries yet.</p>}
      <button onClick={onLoad} className="mt-5 text-sm text-burgundy underline underline-offset-4">Refresh enquiry counts</button>
    </section>
  )
}

function GalleryManagement({ gallery, run }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Bridal Makeup')
  const [file, setFile] = useState(null)
  const [edits, setEdits] = useState({})
  const submit = async (event) => {
    event.preventDefault()
    if (!file || !title.trim() || !category.trim()) return
    await run(async () => {
      const imageUrl = await uploadImage(file, 'gallery')
      const { error } = await supabase.from('gallery').insert({ title: title.trim(), category: category.trim(), image_url: imageUrl, sort_order: (gallery.at(-1)?.sort_order ?? -1) + 1 })
      if (error) {
        await removeStoredImage(imageUrl)
        throw error
      }
      setTitle('')
      setFile(null)
    }, 'Gallery photo added.')
  }
  const replace = (item, nextFile) => run(async () => {
    const imageUrl = await uploadImage(nextFile, 'gallery')
    const { error } = await supabase.from('gallery').update({ image_url: imageUrl }).eq('id', item.id)
    if (error) {
      await removeStoredImage(imageUrl)
      throw error
    }
    await removeStoredImage(item.image_url)
  }, 'Gallery photo replaced.')
  const rename = (item, values) => run(async () => {
    const { error } = await supabase.from('gallery').update(values).eq('id', item.id)
    if (error) throw error
  }, 'Gallery details updated.')
  const remove = (item) => run(async () => {
    const { error } = await supabase.from('gallery').delete().eq('id', item.id)
    if (error) throw error
    await removeStoredImage(item.image_url)
  }, 'Gallery photo deleted.')
  const move = (item, direction) => run(async () => {
    const index = gallery.findIndex((entry) => entry.id === item.id)
    const other = gallery[index + direction]
    if (!other) return
    const { error: firstError } = await supabase.from('gallery').update({ sort_order: other.sort_order }).eq('id', item.id)
    if (firstError) throw firstError
    const { error: secondError } = await supabase.from('gallery').update({ sort_order: item.sort_order }).eq('id', other.id)
    if (secondError) throw secondError
  }, 'Gallery order updated.')
  return (
    <section>
      <h2 className="font-display text-3xl text-burgundy">Gallery management</h2>
      <form onSubmit={submit} className="mt-5 grid gap-4 rounded-2xl border border-gold/40 bg-white p-5 sm:grid-cols-2">
        <TextInput label="Photo title" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} />
        <TextInput label="Category" required maxLength={80} value={category} onChange={(event) => setCategory(event.target.value)} />
        <label className="block text-sm sm:col-span-2">Photo (JPG, PNG, WebP; up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className="field mt-1" onChange={(event) => setFile(event.target.files?.[0] || null)} required /></label>
        <button className="btn bg-burgundy text-ivory hover:bg-wine sm:col-span-2"><Plus size={16} /> Add photo</button>
      </form>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item, index) => <article key={item.id} className="overflow-hidden rounded-2xl border border-gold/40 bg-white">
          <img src={item.image_url} alt={item.title} className="aspect-[4/3] w-full object-cover" />
          <div className="grid gap-3 p-4">
            <TextInput label="Photo title" value={edits[item.id]?.title ?? item.title} onChange={(event) => setEdits((current) => ({ ...current, [item.id]: { ...current[item.id], title: event.target.value } }))} maxLength={120} />
            <TextInput label="Category" value={edits[item.id]?.category ?? item.category} onChange={(event) => setEdits((current) => ({ ...current, [item.id]: { ...current[item.id], category: event.target.value } }))} maxLength={80} />
            <div className="mt-4 flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-gold/50 px-3 py-2 text-xs"><Upload size={14} /> Replace<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => event.target.files?.[0] && replace(item, event.target.files[0])} /></label>
              <button onClick={() => rename(item, {
                title: (edits[item.id]?.title ?? item.title).trim(),
                category: (edits[item.id]?.category ?? item.category).trim(),
              }).then((saved) => { if (saved) setEdits((current) => { const next = { ...current }; delete next[item.id]; return next }) })} className="inline-flex items-center gap-1 rounded-full border border-gold/50 px-3 py-2 text-xs"><Save size={14} /> Save details</button>
              <button onClick={() => move(item, -1)} disabled={index === 0} className="rounded-full border border-gold/50 px-3 py-2 text-xs disabled:opacity-40">Move up</button>
              <button onClick={() => move(item, 1)} disabled={index === gallery.length - 1} className="rounded-full border border-gold/50 px-3 py-2 text-xs disabled:opacity-40">Move down</button>
              <button onClick={() => remove(item)} className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs text-red-700"><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </article>)}
      </div>
    </section>
  )
}

function AboutManagement({ settings, run }) {
  const [form, setForm] = useState(settings)
  const [ownerPhoto, setOwnerPhoto] = useState(null)
  const [clientPhoto, setClientPhoto] = useState(null)
  useEffect(() => setForm(settings), [settings])
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const save = (event) => {
    event.preventDefault()
    run(async () => {
      let uploadedPhoto = ''
      const patch = {
        studio_intro: form.studio_intro || '',
        owner_name: form.owner_name || '',
        owner_bio: form.owner_bio || '',
        owner_experience: form.owner_experience || '',
      }
      if (ownerPhoto) {
        uploadedPhoto = await uploadImage(ownerPhoto, 'about')
        patch.owner_photo_url = uploadedPhoto
      }
      const { error } = await supabase.from('studio_settings').update(patch).eq('id', 1)
      if (error) {
        await removeStoredImage(uploadedPhoto)
        throw error
      }
      if (ownerPhoto && settings.owner_photo_url) await removeStoredImage(settings.owner_photo_url)
      setOwnerPhoto(null)
    }, 'About information updated.')
  }
  const addClientPhoto = () => {
    if (!clientPhoto) return
    run(async () => {
      const url = await uploadImage(clientPhoto, 'about/clients')
      const photos = [...(settings.client_photos || []), { url, title: 'Studio client' }]
      const { error } = await supabase.from('studio_settings').update({ client_photos: photos }).eq('id', 1)
      if (error) {
        await removeStoredImage(url)
        throw error
      }
      setClientPhoto(null)
    }, 'Client photo added.')
  }
  const replaceClientPhoto = (photo, file) => run(async () => {
    const url = await uploadImage(file, 'about/clients')
    const photos = (settings.client_photos || []).map((item) => (item.url || item) === (photo.url || photo) ? { ...item, url } : item)
    const { error } = await supabase.from('studio_settings').update({ client_photos: photos }).eq('id', 1)
    if (error) {
      await removeStoredImage(url)
      throw error
    }
    await removeStoredImage(photo.url || photo)
  }, 'Client photo replaced.')
  const removeClientPhoto = (photo) => run(async () => {
    const photos = (settings.client_photos || []).filter((item) => (item.url || item) !== (photo.url || photo))
    const { error } = await supabase.from('studio_settings').update({ client_photos: photos }).eq('id', 1)
    if (error) throw error
    await removeStoredImage(photo.url || photo)
  }, 'Client photo removed.')
  return (
    <section>
      <h2 className="font-display text-3xl text-burgundy">About management</h2>
      <form onSubmit={save} className="mt-5 grid gap-4 rounded-2xl border border-gold/40 bg-white p-5 md:grid-cols-2">
        <div className="md:col-span-2"><TextArea label="Studio introduction" value={form.studio_intro} onChange={set('studio_intro')} maxLength={1500} /></div>
        <TextInput label="Owner name" value={form.owner_name} onChange={set('owner_name')} maxLength={100} />
        <TextInput label="Professional experience" value={form.owner_experience} onChange={set('owner_experience')} maxLength={300} />
        <div className="md:col-span-2"><TextArea label="Owner information" value={form.owner_bio} onChange={set('owner_bio')} maxLength={1500} /></div>
        <label className="block text-sm md:col-span-2">Owner photograph (JPG, PNG, WebP; up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className="field mt-1" onChange={(event) => setOwnerPhoto(event.target.files?.[0] || null)} /></label>
        {settings.owner_photo_url && <img src={settings.owner_photo_url} alt="Current owner photo" className="max-h-56 rounded-xl object-cover md:col-span-2" />}
        <button className="btn bg-burgundy text-ivory hover:bg-wine md:col-span-2"><Save size={16} /> Save About</button>
      </form>
      <div className="mt-8 rounded-2xl border border-gold/40 bg-white p-5">
        <h3 className="font-display text-2xl text-burgundy">Client photographs</h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input type="file" accept="image/jpeg,image/png,image/webp" className="field" onChange={(event) => setClientPhoto(event.target.files?.[0] || null)} />
          <button type="button" onClick={addClientPhoto} className="btn shrink-0 bg-burgundy text-ivory hover:bg-wine"><Plus size={16} /> Add photo</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(settings.client_photos || []).map((photo) => <div key={photo.url || photo} className="relative">
            <img src={photo.url || photo} alt={photo.title || 'Studio client'} className="aspect-square w-full rounded-xl object-cover" />
            <label className="absolute left-2 top-2 cursor-pointer rounded-full bg-white/90 p-2 text-burgundy" aria-label="Replace client photo"><Upload size={16} /><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => event.target.files?.[0] && replaceClientPhoto(photo, event.target.files[0])} /></label>
            <button onClick={() => removeClientPhoto(photo)} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-700" aria-label="Remove client photo"><Trash2 size={16} /></button>
          </div>)}
        </div>
      </div>
    </section>
  )
}

function CatalogManagement({ services, packages, run }) {
  const [service, setService] = useState(blankService)
  const [editingService, setEditingService] = useState('')
  const [serviceFile, setServiceFile] = useState(null)
  const [item, setItem] = useState(blankPackage)
  const [editingPackage, setEditingPackage] = useState('')
  const [packageFile, setPackageFile] = useState(null)
  const setServiceField = (key) => (event) => setService((current) => ({ ...current, [key]: event.target.value }))
  const setPackageField = (key) => (event) => setItem((current) => ({ ...current, [key]: event.target.value }))
  const editService = (record) => {
    setEditingService(record.id)
    setService({ name: record.name, description: record.description || '', price: record.price || '', image_url: record.image_url || '', active: record.active })
    setServiceFile(null)
  }
  const saveService = (event) => {
    event.preventDefault()
    run(async () => {
      const imageUrl = serviceFile ? await uploadImage(serviceFile, 'services') : service.image_url
      const values = { name: service.name.trim(), description: service.description.trim(), price: service.price.trim() || null, image_url: imageUrl || null, active: service.active }
      const result = editingService
        ? await supabase.from('services').update(values).eq('id', editingService)
        : await supabase.from('services').insert({ ...values, id: crypto.randomUUID(), sort_order: services.length })
      if (result.error) {
        if (serviceFile) await removeStoredImage(imageUrl)
        throw result.error
      }
      if (editingService && serviceFile && service.image_url) await removeStoredImage(service.image_url)
      setService(blankService)
      setServiceFile(null)
      setEditingService('')
    }, editingService ? 'Service updated.' : 'Service added.')
  }
  const editPackage = (record) => {
    setEditingPackage(record.id)
    setItem({ service_id: record.service_id, name: record.name, description: record.description || '', price: record.price || '', image_url: record.image_url || '', active: record.active })
    setPackageFile(null)
  }
  const savePackage = (event) => {
    event.preventDefault()
    run(async () => {
      const imageUrl = packageFile ? await uploadImage(packageFile, 'packages') : item.image_url
      const values = { service_id: item.service_id, name: item.name.trim(), description: item.description.trim(), price: item.price.trim() || null, image_url: imageUrl || null, active: item.active }
      const result = editingPackage
        ? await supabase.from('packages').update(values).eq('id', editingPackage)
        : await supabase.from('packages').insert({ ...values, sort_order: packages.filter((entry) => entry.service_id === item.service_id).length })
      if (result.error) {
        if (packageFile) await removeStoredImage(imageUrl)
        throw result.error
      }
      if (editingPackage && packageFile && item.image_url) await removeStoredImage(item.image_url)
      setItem(blankPackage)
      setPackageFile(null)
      setEditingPackage('')
    }, editingPackage ? 'Package updated.' : 'Package added.')
  }
  const deletePackage = (record) => run(async () => {
    const { error } = await supabase.from('packages').delete().eq('id', record.id)
    if (error) throw error
    await removeStoredImage(record.image_url)
  }, 'Package deleted.')
  const toggleService = (record) => run(async () => {
    const { error } = await supabase.from('services').update({ active: !record.active }).eq('id', record.id)
    if (error) throw error
  }, 'Service visibility updated.')
  const togglePackage = (record) => run(async () => {
    const { error } = await supabase.from('packages').update({ active: !record.active }).eq('id', record.id)
    if (error) throw error
  }, 'Package visibility updated.')
  const deleteService = (record) => run(async () => {
    const { error } = await supabase.from('services').delete().eq('id', record.id)
    if (error) throw error
    await removeStoredImage(record.image_url)
  }, 'Service deleted.')
  return (
    <section className="grid gap-8 xl:grid-cols-2">
      <div>
        <h2 className="font-display text-3xl text-burgundy">Services</h2>
        <form onSubmit={saveService} className="mt-4 grid gap-3 rounded-2xl border border-gold/40 bg-white p-5">
          <TextInput label="Service name" required maxLength={100} value={service.name} onChange={setServiceField('name')} />
          <TextArea label="Description" value={service.description} onChange={setServiceField('description')} maxLength={1000} />
          <TextInput label="Starting rate (INR, optional)" type="number" min="0" step="1" value={service.price} onChange={setServiceField('price')} />
          <label className="block text-sm">Service photograph (JPG, PNG, WebP; up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className="field mt-1" onChange={(event) => setServiceFile(event.target.files?.[0] || null)} /></label>
          <div className="flex flex-wrap gap-3"><button className="btn bg-burgundy text-ivory hover:bg-wine"><Save size={16} /> {editingService ? 'Save service' : 'Add service'}</button>{editingService && <button type="button" onClick={() => { setEditingService(''); setService(blankService); setServiceFile(null) }} className="rounded-full border border-gold px-5 py-3 text-sm">Cancel</button>}</div>
        </form>
        <div className="mt-4 space-y-3">
          {services.map((record) => <article key={record.id} className="flex gap-3 rounded-2xl border border-gold/40 bg-white p-4">
            {record.image_url && <img src={record.image_url} alt="" className="h-20 w-20 rounded-xl object-cover" />}
            <div className="min-w-0 flex-1"><p className="font-medium text-burgundy">{record.name}</p><p className="line-clamp-2 text-sm text-cocoa/65">{record.description}</p><p className="mt-1 text-xs">{moneyLabel(record.price)} · {record.active ? 'Active' : 'Hidden'}</p><div className="mt-2 flex gap-3 text-xs"><button onClick={() => editService(record)} className="inline-flex items-center gap-1 text-burgundy"><Pencil size={13} /> Edit</button><button onClick={() => toggleService(record)} className="underline">{record.active ? 'Disable' : 'Enable'}</button><button onClick={() => deleteService(record)} className="text-red-700">Delete</button></div></div>
          </article>)}
        </div>
      </div>
      <div>
        <h2 className="font-display text-3xl text-burgundy">Packages</h2>
        <form onSubmit={savePackage} className="mt-4 grid gap-3 rounded-2xl border border-gold/40 bg-white p-5">
          <label className="block text-sm">Service<select className="field mt-1" value={item.service_id} onChange={setPackageField('service_id')} required><option value="">Select a service</option>{services.map((record) => <option key={record.id} value={record.id}>{record.name}</option>)}</select></label>
          <TextInput label="Package name" required maxLength={100} value={item.name} onChange={setPackageField('name')} />
          <TextArea label="Description" value={item.description} onChange={setPackageField('description')} maxLength={1000} />
          <TextInput label="Price in INR" type="number" min="0" step="1" value={item.price} onChange={setPackageField('price')} />
          <label className="block text-sm">Optional package image (JPG, PNG, WebP; up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className="field mt-1" onChange={(event) => setPackageFile(event.target.files?.[0] || null)} /></label>
          <div className="flex flex-wrap gap-3"><button className="btn bg-burgundy text-ivory hover:bg-wine"><Save size={16} /> {editingPackage ? 'Save package' : 'Add package'}</button>{editingPackage && <button type="button" onClick={() => { setEditingPackage(''); setItem(blankPackage); setPackageFile(null) }} className="rounded-full border border-gold px-5 py-3 text-sm">Cancel</button>}</div>
        </form>
        <div className="mt-4 space-y-3">
          {packages.map((record) => <article key={record.id} className="flex gap-3 rounded-2xl border border-gold/40 bg-white p-4">
            {record.image_url && <img src={record.image_url} alt="" className="h-20 w-20 rounded-xl object-cover" />}
            <div className="min-w-0 flex-1"><p className="font-medium text-burgundy">{record.name}</p><p className="text-xs text-cocoa/60">{services.find((serviceRecord) => serviceRecord.id === record.service_id)?.name}</p><p className="mt-1 text-xs">{moneyLabel(record.price)} · {record.active ? 'Active' : 'Hidden'}</p><div className="mt-2 flex gap-3 text-xs"><button onClick={() => editPackage(record)} className="inline-flex items-center gap-1 text-burgundy"><Pencil size={13} /> Edit</button><button onClick={() => togglePackage(record)} className="underline">{record.active ? 'Disable' : 'Enable'}</button><button onClick={() => deletePackage(record)} className="text-red-700">Delete</button></div></div>
          </article>)}
        </div>
      </div>
    </section>
  )
}

function BookingManagement({ bookings, run, onLoad }) {
  useEffect(() => { onLoad() }, [])
  const updateStatus = (booking, status) => run(async () => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', booking.id)
    if (error) throw error
    await onLoad()
  }, 'Enquiry status updated.', false)
  return (
    <section>
      <h2 className="font-display text-3xl text-burgundy">Booking enquiries</h2>
      {bookings.length === 0 ? <p className="mt-4 text-sm text-cocoa/65">There are no booking enquiries yet.</p> : (
        <div className="mt-5 space-y-4">
          {bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-gold/40 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h3 className="font-display text-2xl text-burgundy">{booking.customer_name}</h3><a href={`tel:${booking.phone}`} className="text-sm text-burgundy underline">{booking.phone}</a></div>
              <label className="text-xs uppercase tracking-widest">Status<select value={booking.status} onChange={(event) => updateStatus(booking, event.target.value)} className="field mt-1 min-w-40">
                {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select></label>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-cocoa/55">Service</dt><dd>{booking.service_name}</dd></div>
              <div><dt className="text-cocoa/55">Package</dt><dd>{booking.package_name || 'Not selected'}</dd></div>
              <div><dt className="text-cocoa/55">Appointment</dt><dd>{booking.appointment_date} · {booking.appointment_time}</dd></div>
              <div><dt className="text-cocoa/55">Received</dt><dd>{new Date(booking.created_at).toLocaleString()}</dd></div>
              <div className="sm:col-span-2"><dt className="text-cocoa/55">Message</dt><dd className="whitespace-pre-wrap">{booking.message || '—'}</dd></div>
            </dl>
          </article>)}
        </div>
      )}
    </section>
  )
}

function ReviewManagement({ reviews, run }) {
  const [form, setForm] = useState({ customer_name: '', content: '', rating: '5', is_published: false })
  const [editingId, setEditingId] = useState('')
  const set = (key) => (event) => {
    const value = key === 'is_published' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [key]: value }))
  }
  const edit = (review) => {
    setEditingId(review.id)
    setForm({
      customer_name: review.customer_name,
      content: review.content,
      rating: String(review.rating),
      is_published: review.is_published,
    })
  }
  const reset = () => {
    setEditingId('')
    setForm({ customer_name: '', content: '', rating: '5', is_published: false })
  }
  const save = (event) => {
    event.preventDefault()
    run(async () => {
      const values = {
        customer_name: form.customer_name.trim(),
        content: form.content.trim(),
        rating: Number(form.rating),
        is_published: form.is_published,
      }
      const result = editingId
        ? await supabase.from('studio_reviews').update(values).eq('id', editingId)
        : await supabase.from('studio_reviews').insert(values)
      if (result.error) throw result.error
      reset()
    }, editingId ? 'Review updated.' : 'Review saved.')
  }
  const remove = (review) => run(async () => {
    const { error } = await supabase.from('studio_reviews').delete().eq('id', review.id)
    if (error) throw error
    if (editingId === review.id) reset()
  }, 'Review deleted.')

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="font-display text-3xl text-burgundy">Client reviews</h2>
      <p className="mt-2 text-sm text-cocoa/65">Only add genuine feedback provided by a client. Keep a review unpublished until you have permission to display it.</p>
      <form onSubmit={save} className="mt-5 grid gap-4 rounded-2xl border border-gold/40 bg-white p-5 md:grid-cols-2">
        <TextInput label="Client name or initials" required maxLength={100} value={form.customer_name} onChange={set('customer_name')} />
        <label className="block text-sm text-cocoa/80">Rating
          <select className="field mt-1" value={form.rating} onChange={set('rating')} required>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
          </select>
        </label>
        <div className="md:col-span-2"><TextArea label="Review text" required value={form.content} onChange={set('content')} maxLength={1200} /></div>
        <label className="flex items-center gap-2 text-sm text-cocoa/80 md:col-span-2">
          <input type="checkbox" checked={form.is_published} onChange={set('is_published')} className="accent-burgundy" />
          Client has approved displaying this review on the public website
        </label>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button className="btn bg-burgundy text-ivory hover:bg-wine"><Save size={16} /> {editingId ? 'Save review' : 'Add review'}</button>
          {editingId && <button type="button" onClick={reset} className="rounded-full border border-gold px-5 py-3 text-sm">Cancel</button>}
        </div>
      </form>
      <div className="mt-5 space-y-3">
        {reviews.map((review) => <article key={review.id} className="rounded-2xl border border-gold/40 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="font-medium text-burgundy">{review.customer_name}</h3><p className="text-sm text-gold">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} <span className="text-cocoa/60">{review.rating}/5</span></p></div>
            <span className={`rounded-full px-3 py-1 text-xs ${review.is_published ? 'bg-green-50 text-green-800' : 'bg-gold/20 text-burgundy'}`}>{review.is_published ? 'Published' : 'Awaiting approval'}</span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-cocoa/80">{review.content}</p>
          <div className="mt-4 flex gap-4 text-sm"><button onClick={() => edit(review)} className="inline-flex items-center gap-1 text-burgundy"><Pencil size={14} /> Edit</button><button onClick={() => remove(review)} className="text-red-700">Delete</button></div>
        </article>)}
        {reviews.length === 0 && <p className="text-sm text-cocoa/60">No reviews have been added. This section stays empty until genuine client feedback is entered.</p>}
      </div>
    </section>
  )
}

function ContactManagement({ settings, run }) {
  const [form, setForm] = useState(settings)
  useEffect(() => setForm(settings), [settings])
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const save = (event) => {
    event.preventDefault()
    run(async () => {
      const { error } = await supabase.from('studio_settings').update({
        instagram_url: form.instagram || '',
        instagram_handle: form.instagramHandle || '',
        whatsapp_number: (form.whatsapp || '').replace(/\D/g, ''),
        phone_display: form.phoneDisplay || '',
        phone_tel: form.phoneTel || '',
        email: form.email || '',
        address: form.address || '',
      }).eq('id', 1)
      if (error) throw error
    }, 'Contact information updated.')
  }
  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="font-display text-3xl text-burgundy">Contact settings</h2>
      <form onSubmit={save} className="mt-5 grid gap-4 rounded-2xl border border-gold/40 bg-white p-5 md:grid-cols-2">
        <TextInput label="Instagram profile URL" type="url" value={form.instagram} onChange={set('instagram')} placeholder="https://www.instagram.com/your-handle/" />
        <TextInput label="Instagram handle" value={form.instagramHandle} onChange={set('instagramHandle')} maxLength={100} />
        <TextInput label="WhatsApp number (country code + digits)" value={form.whatsapp} onChange={set('whatsapp')} inputMode="tel" placeholder="Country code followed by number" />
        <TextInput label="Phone display text" value={form.phoneDisplay} onChange={set('phoneDisplay')} maxLength={40} />
        <TextInput label="Phone link (tel:)" value={form.phoneTel} onChange={set('phoneTel')} inputMode="tel" maxLength={30} />
        <TextInput label="Email" type="email" value={form.email} onChange={set('email')} />
        <div className="md:col-span-2"><TextArea label="Studio address (optional)" value={form.address} onChange={set('address')} maxLength={300} /></div>
        <button className="btn bg-burgundy text-ivory hover:bg-wine md:col-span-2"><Save size={16} /> Save contact settings</button>
      </form>
    </section>
  )
}
