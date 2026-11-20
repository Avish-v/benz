create table if not exists public.studio_settings (
  id integer primary key check (id = 1),
  studio_name text not null default 'BENZ BEAUTY STUDIO',
  tagline text not null default 'Your Beauty, Our Passion.',
  whatsapp_number text not null default '',
  phone_display text not null default '',
  phone_tel text not null default '',
  instagram_url text not null default '',
  instagram_handle text not null default '',
  email text not null default '',
  address text not null default '',
  studio_intro text not null default '',
  owner_name text not null default '',
  owner_bio text not null default '',
  owner_experience text not null default '',
  owner_photo_url text not null default '',
  client_photos jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  name text not null,
  description text not null default '',
  price text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.services(id) on delete cascade,
  name text not null,
  description text not null default '',
  price text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.studio_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 100),
  content text not null check (char_length(content) between 1 and 1200),
  rating integer not null check (rating between 1 and 5),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 20),
  service_id text not null references public.services(id) on delete restrict,
  service_name text not null,
  package_id uuid references public.packages(id) on delete set null,
  package_name text,
  appointment_date date not null check (appointment_date >= current_date),
  appointment_time text not null,
  message text not null default '' check (char_length(message) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists services_active_sort_idx
  on public.services (active, sort_order);
create index if not exists packages_service_sort_idx
  on public.packages (service_id, sort_order);
create index if not exists gallery_sort_idx
  on public.gallery (sort_order);
create index if not exists studio_reviews_published_created_idx
  on public.studio_reviews (is_published, created_at desc);
create index if not exists bookings_created_idx
  on public.bookings (created_at desc);
create index if not exists bookings_status_created_idx
  on public.bookings (status, created_at desc);

alter table public.studio_settings enable row level security;
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.gallery enable row level security;
alter table public.studio_reviews enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Public can read studio settings" on public.studio_settings;
create policy "Public can read studio settings" on public.studio_settings
  for select using (true);
drop policy if exists "Studio admins can update settings" on public.studio_settings;
create policy "Studio admins can update settings" on public.studio_settings
  for update using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services" on public.services
  for select using (active or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Studio admins can manage services" on public.services;
create policy "Studio admins can manage services" on public.services
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read active packages" on public.packages;
create policy "Public can read active packages" on public.packages
  for select using (active or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Studio admins can manage packages" on public.packages;
create policy "Studio admins can manage packages" on public.packages
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read gallery" on public.gallery;
create policy "Public can read gallery" on public.gallery
  for select using (true);
drop policy if exists "Studio admins can manage gallery" on public.gallery;
create policy "Studio admins can manage gallery" on public.gallery
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read published studio reviews" on public.studio_reviews;
create policy "Public can read published studio reviews" on public.studio_reviews
  for select using (is_published or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Studio admins can manage reviews" on public.studio_reviews;
create policy "Studio admins can manage reviews" on public.studio_reviews
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Customers can create booking enquiries" on public.bookings;
create policy "Customers can create booking enquiries" on public.bookings
  for insert with check (
    status = 'pending'
    and char_length(customer_name) between 2 and 100
    and char_length(phone) between 7 and 20
    and char_length(message) <= 1000
  );
drop policy if exists "Studio admins can read booking enquiries" on public.bookings;
create policy "Studio admins can read booking enquiries" on public.bookings
  for select using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Studio admins can update booking enquiries" on public.bookings;
create policy "Studio admins can update booking enquiries" on public.bookings
  for update using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into public.studio_settings (id, studio_name, tagline, studio_intro)
values (
  1,
  'BENZ BEAUTY STUDIO',
  'Your Beauty, Our Passion.',
  'BENZ BEAUTY STUDIO is a beauty studio built around one belief: Your Beauty, Our Passion. Every client is treated as an individual, and every look is created to make you feel like yourself at your most radiant.'
)
on conflict (id) do nothing;

insert into public.services (id, name, description, price, image_url, active, sort_order)
values
  ('makeup', 'Makeup', 'Skin-first makeup and beautician services tailored to your outfit, occasion and personality.', null, 'images/studio/service-makeup.webp', true, 0),
  ('mehendi', 'Mehendi', 'Hand-drawn henna designs, from intricate bridal patterns to simple everyday elegance.', null, 'images/studio/service-mehendi.webp', true, 1),
  ('saree', 'Saree Styling', 'Perfectly pleated and draped sarees that hold their shape and flatter your silhouette.', null, 'images/studio/service-saree.webp', true, 2)
on conflict (id) do nothing;

insert into public.gallery (title, category, image_url, sort_order)
select seed.title, seed.category, seed.image_url, seed.sort_order
from (values
  ('Makeup artist working with a client', 'Bridal Makeup', 'images/studio/gallery1.webp', 0),
  ('Intricate henna design on a hand', 'Mehendi', 'images/studio/gallery2.webp', 1),
  ('Beauty treatment in progress', 'Customer Transformations', 'images/studio/gallery3.webp', 2),
  ('Detailed bridal henna design', 'Mehendi', 'images/studio/gallery4.webp', 3),
  ('Traditional saree styling', 'Saree Styling', 'images/studio/gallery5.webp', 4),
  ('Henna artistry on hands', 'Mehendi', 'images/studio/gallery6.webp', 5),
  ('Client in traditional bridal styling', 'Saree Styling', 'images/studio/gallery7.webp', 6),
  ('Bridal makeup and saree styling', 'Bridal Makeup', 'images/studio/gallery8.webp', 7)
) as seed(title, category, image_url, sort_order)
where not exists (select 1 from public.gallery);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('studio-images', 'studio-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read studio images" on storage.objects;
create policy "Public can read studio images" on storage.objects
  for select using (bucket_id = 'studio-images');
drop policy if exists "Studio admins can upload images" on storage.objects;
create policy "Studio admins can upload images" on storage.objects
  for insert with check (
    bucket_id = 'studio-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
drop policy if exists "Studio admins can update images" on storage.objects;
create policy "Studio admins can update images" on storage.objects
  for update using (
    bucket_id = 'studio-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  ) with check (
    bucket_id = 'studio-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
drop policy if exists "Studio admins can delete images" on storage.objects;
create policy "Studio admins can delete images" on storage.objects
  for delete using (
    bucket_id = 'studio-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
