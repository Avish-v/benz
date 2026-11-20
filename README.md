# BENZ BEAUTY STUDIO

The existing React + Vite website, with a Supabase-powered admin dashboard and persistent WhatsApp booking enquiries.

## Run locally

```powershell
npm ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
npm run build
```

Set the project URL and publishable/anon key in `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

These are frontend configuration values, not server secrets. Never put a Supabase service-role key in a `VITE_` variable or the frontend.

## Configure persistent data and image storage

1. In your Supabase project, open **Project Settings → API** (or **API Keys**) and copy the Project URL and the **publishable** key (or legacy `anon` key). Put them in `.env.local` as shown above. The anon/publishable key is designed for browser use; never use a `service_role` or secret key in this app.
2. In the Supabase **SQL Editor**, for a new project run [`supabase/schema.sql`](./supabase/schema.sql) and then [`supabase/upgrade-services-reviews.sql`](./supabase/upgrade-services-reviews.sql). If the project already has the original site schema, run only the upgrade script. The scripts use `create ... if not exists`, replace only named policies, preserve existing content, and seed missing package rows; the upgrade is safe to re-run.
3. In **Authentication → Settings**, disable public sign-ups. In **Authentication → Users**, choose **Add user** and create the studio admin with the studio's email and a strong password. Do not build or enable public admin registration.
4. Open that user in **Authentication → Users**, edit **app metadata** to exactly `{"role":"admin"}`, and save. This claim is controlled by the project owner (unlike user-editable metadata) and is what the dashboard and RLS/storage policies authorize. Sign out and back in after changing the role so a new access token is issued.
5. In **Storage**, confirm that the SQL setup created the public `studio-images` bucket. Public visitors can read images; only users with the admin app-metadata role can upload, replace or delete them. The bucket enforces image MIME types and a 5 MB limit, and the dashboard resizes uploads to WebP.
6. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel **Settings → Environment Variables** for Production, Preview and Development. Use only the publishable/anon key. Run `npm run build`, then redeploy. The Vercel rewrite serves the `/admin` route.
7. Run `npm run dev`, visit `/admin`, and sign in. Add the owner's biography and any further studio information. Client photos and reviews should only be published with the client's permission.

The `admins` role is stored in Supabase Auth `app_metadata`; the project intentionally does not create a duplicate admin-password table. Booking customer data is only readable or manageable by admins, and new public enquiries are restricted to pending status by RLS.

Public booking enquiries are written to `bookings` before WhatsApp opens. A WhatsApp message is a request only; the studio must confirm the appointment. Admin access to enquiry records is restricted by row-level security. Uploaded admin images are resized to WebP and stored in the persistent Supabase Storage bucket.

## Studio photos and service data

- The eight original gallery photos and five correctly named service photos are optimized in `public/images/studio/`.
- The five categories are Bridal Makeup, Mehendi, Saree Pleating, Hairstyle and Saree Draping. Their listed prices are starting rates; final prices may vary depending on customer requirements. Each price-list item opens WhatsApp with its category, selected service and price.
- The supplied `client photo about.jpg` is used for the About portrait; the service images map to the corresponding `service 1makeup.jpg`, `service2mehendhi.jpg`, `service 3sareepleating.jpg`, `service4hairstyling.jpg` and `service 5sareedraping.jpg` files. Replace the About portrait through the dashboard if the studio wants to feature a different owner photo.
- Add, update or reorder persistent gallery records from `/admin`. The public gallery includes a keyboard-accessible image lightbox.
- Manage real reviews in the dashboard. Reviews are private by default and appear publicly only after the studio marks them approved for display. No sample or fabricated testimonials are included.

## Deployment notes

- The Vercel build command is `npm run build`; output directory: `dist`.
- Apply the Supabase schema before using public bookings or the admin dashboard.
- After deploying frontend environment-variable changes, trigger a fresh Vercel build so Vite includes the project URL and anon key.
- No production deployment is performed from this local workspace; deploy through the connected Vercel project after configuring its Supabase credentials.

### Connect GitHub and deploy to Vercel

1. Import the GitHub repository into Vercel and select the Vite framework preset.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings for Production, Preview and Development. Use the key for the same Supabase project URL; never add a service-role key.
4. Deploy. Connect the production branch (normally `main`) so Vercel automatically builds each push. Keep the existing `.vercel.app` address until a custom domain is verified.

### Add a custom domain later

1. In Vercel, open the project **Settings → Domains**, add the purchased apex domain and, if desired, its `www` hostname.
2. Vercel displays the exact DNS records needed for that project and domain. Add those records at the domain provider's DNS management page; use Vercel's displayed values rather than copying generic records.
3. Wait for Vercel to report the domain as verified and HTTPS as active. Select the preferred primary hostname in Vercel; configure the other hostname to redirect to it.
4. Keep the Vercel-provided domain available as a fallback. The canonical and Open Graph URLs are derived from the active site origin and Vite base path, so they follow the verified domain without embedding a temporary deployment hostname in source.
