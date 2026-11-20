begin;

update public.services
set name = 'Bridal Makeup',
    description = 'Makeup looks for parties, engagements, receptions and wedding celebrations.',
    price = '1500',
    image_url = 'images/studio/service-bridal-makeup.webp',
    sort_order = 0
where id = 'makeup' and name = 'Makeup';

update public.services
set name = 'Saree Pleating',
    description = 'Neatly pleated sarees for celebrations, special occasions and bridal looks.',
    price = '400',
    image_url = 'images/studio/service-saree-pleating.webp',
    sort_order = 2
where id = 'saree' and name = 'Saree Styling';

update public.services
set description = 'Henna designs for everyday occasions and bridal celebrations.',
    price = '300',
    image_url = 'images/studio/service-mehendi.webp',
    sort_order = 1
where id = 'mehendi'
  and description = 'Hand-drawn henna designs, from intricate bridal patterns to simple everyday elegance.';

update public.gallery
set category = 'Saree Pleating'
where category = 'Saree Styling' and title = 'Traditional saree styling';

update public.gallery
set category = 'Saree Draping'
where category = 'Saree Styling' and title = 'Client in traditional bridal styling';

insert into public.services (id, name, description, price, image_url, active, sort_order)
values
  ('hairstyle', 'Hairstyle', 'Hairstyling for simple, party and bridal looks.', '500', 'images/studio/service-hairstyle.webp', true, 3),
  ('saree-draping', 'Saree Draping', 'Saree draping for everyday occasions, celebrations and bridal looks.', '500', 'images/studio/service-saree-draping.webp', true, 4)
on conflict (id) do nothing;

insert into public.packages (service_id, name, description, price, active, sort_order)
select seed.service_id, seed.name, seed.description, seed.price, true, seed.sort_order
from (values
  ('makeup', 'Party Makeup', 'Makeup styling for parties and celebrations.', '1500', 0),
  ('makeup', 'Engagement Makeup', 'Makeup styling for engagement celebrations.', '4000', 1),
  ('makeup', 'Reception Makeup', 'Makeup styling for reception celebrations.', '5000', 2),
  ('makeup', 'Bridal Makeup', 'Bridal makeup for your wedding celebration.', '8000', 3),
  ('mehendi', 'Simple Mehendi', 'Simple henna design.', '300', 0),
  ('mehendi', 'Arabic Mehendi', 'Arabic henna design.', '500', 1),
  ('mehendi', 'Both Hands Mehendi', 'Henna designs for both hands.', '1000', 2),
  ('mehendi', 'Bridal Mehendi', 'Bridal henna design.', '3000', 3),
  ('mehendi', 'Full Bridal Mehendi', 'Full bridal henna design.', '5000', 4),
  ('saree', 'Basic Pleating', 'Basic saree pleating.', '400', 0),
  ('saree', 'Pre-Pleating', 'Pre-pleating service for a ready-to-wear saree.', '500', 1),
  ('saree', 'Designer Pleating', 'Designer saree pleating.', '700', 2),
  ('saree', 'Bridal Saree Pleating', 'Saree pleating for bridal wear.', '1000', 3),
  ('hairstyle', 'Simple Hairstyle', 'Simple hairstyling.', '500', 0),
  ('hairstyle', 'Party Hairstyle', 'Hairstyling for parties and celebrations.', '800', 1),
  ('hairstyle', 'Curls Hairstyle', 'Curled hairstyle.', '1000', 2),
  ('hairstyle', 'Bridal Hairstyle', 'Hairstyling for bridal wear.', '1500', 3),
  ('hairstyle', 'Premium Bridal Hairstyle', 'Premium hairstyling for bridal wear.', '2000', 4),
  ('saree-draping', 'Normal Draping', 'Traditional saree draping.', '500', 0),
  ('saree-draping', 'Bridal Draping', 'Saree draping for bridal wear.', '1000', 1),
  ('saree-draping', 'Designer Draping', 'Designer saree draping.', '1200', 2)
) as seed(service_id, name, description, price, sort_order)
where exists (
  select 1 from public.services service where service.id = seed.service_id
)
and not exists (
  select 1 from public.packages existing
  where existing.service_id = seed.service_id and existing.name = seed.name
);

create table if not exists public.studio_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 100),
  content text not null check (char_length(content) between 1 and 1200),
  rating integer not null check (rating between 1 and 5),
  is_published boolean not null default false,
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

alter table public.studio_reviews enable row level security;
drop policy if exists "Public can read published studio reviews" on public.studio_reviews;
create policy "Public can read published studio reviews" on public.studio_reviews
  for select using (is_published or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Studio admins can manage reviews" on public.studio_reviews;
create policy "Studio admins can manage reviews" on public.studio_reviews
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

update public.studio_settings
set whatsapp_number = '917305630117',
    phone_display = '+91 73056 30117',
    phone_tel = '+917305630117',
    email = 'adlinbenzadlin@gmail.com',
    instagram_url = 'https://www.instagram.com/benz_makeover_?evlk=dHIxMnV5ZnJ0Zmgy',
    instagram_handle = '@benz_makeover_'
where id = 1
  and (coalesce(whatsapp_number, '') = '' or whatsapp_number ~ '[xX]');

commit;
