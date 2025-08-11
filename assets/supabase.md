# Supabase Integration Guide — company_data_room_frontend

This frontend uses Supabase for:
- Authentication (passwordless magic links; OAuth optional)
- Database access (via Postgres + RLS)
- Storage (signed URLs for document previews/downloads)
- Realtime (notifications and updates; future iteration)

IMPORTANT: The SupabaseTools API is currently failing due to a missing helper RPC (public.run_sql). Until this is created on your Supabase project, automated configuration cannot run. Please complete the “Bootstrap the helper RPC (required for automation)” section first, then proceed with the rest of the SQL.

----------------------------------------------------------------
Environment Variables (Frontend)

Required in company_data_room_frontend/.env:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Optional:
- REACT_APP_SITE_URL: Sets the site base URL for auth redirect links.
  If omitted, the app falls back to window.location.origin.

Example:
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=eyJhbGciOi...
# REACT_APP_SITE_URL=https://your-frontend.example.com

Also configure in Supabase Dashboard:
- Authentication > URL Configuration:
  Site URL: your production domain or http://localhost:3000
  Add Redirect URLs:
    http://localhost:3000/**
    https://your-frontend.example.com/**
----------------------------------------------------------------

Client Initialization

- src/lib/supabaseClient.js uses @supabase/supabase-js v2 and enables:
  - persistSession
  - autoRefreshToken
  - detectSessionInUrl

Dynamic URL utility and redirect usage:
- src/utils/getURL.js provides a portable origin builder.
- Auth magic link and OAuth flows use: `${getURL()}auth/callback`

Auth Callback Route

- src/modules/auth/AuthCallback.jsx exchanges the code in the URL for a session:
  supabase.auth.exchangeCodeForSession()
- On success, we redirect to /dashboard; on error, to /auth/error

----------------------------------------------------------------
Backend Setup — Database, RLS, Storage

Follow these steps in the Supabase SQL editor (or psql). If an error indicates the entity already exists, you can ignore it.

Step 0) Bootstrap the helper RPC (required for automation)

Note: Our toolchain expects public.run_sql(text). Create it once so future automation can manage changes.

create or replace function public.run_sql(query text)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  execute query into result;
  return result;
end;
$$;

revoke all on function public.run_sql(text) from public;
grant execute on function public.run_sql(text) to anon, authenticated, service_role;

Step 1) Core Tables

-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'user' check (role in ('user','founder','investor','admin')),
  tier text not null default 'public' check (tier in ('public','qualified','nda')),
  created_at timestamptz not null default now()
);

-- Documents metadata
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  path text not null, -- storage object path (e.g., "folder/file.pdf")
  tier text not null default 'public' check (tier in ('public','qualified','nda')),
  storage_bucket text not null default 'documents',
  owner uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Access requests
create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  note text,
  created_at timestamptz not null default now()
);

-- NDA signatures
create table if not exists public.nda_signatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  version text not null default 'v1',
  signed_at timestamptz not null default now()
);

Step 2) RLS and Policies

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.access_requests enable row level security;
alter table public.nda_signatures enable row level security;

-- Compute a user's effective tier
create or replace function public.get_user_tier(uid uuid)
returns text
language plpgsql
security definer
as $$
declare
  t text;
begin
  select coalesce(p.tier, 'public') into t
  from public.profiles p
  where p.id = uid;

  if exists (select 1 from public.nda_signatures s where s.user_id = uid) then
    return 'nda';
  end if;

  return coalesce(t, 'public');
end;
$$;

-- profiles policies
create policy "profiles_self_read" on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles_self_insert" on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_self_update" on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- documents policies
create policy "documents_public_read" on public.documents
for select
to anon, authenticated
using (tier = 'public');

create policy "documents_qualified_read" on public.documents
for select
to authenticated
using (
  (tier = 'qualified' and public.get_user_tier(auth.uid()) in ('qualified','nda'))
  or (tier = 'nda' and public.get_user_tier(auth.uid()) = 'nda')
  or (owner = auth.uid())
);

-- owners can manage their own docs (optional baseline)
create policy "documents_owner_write" on public.documents
for all
to authenticated
using (owner = auth.uid())
with check (owner = auth.uid());

-- access_requests policies
create policy "access_requests_self_rw" on public.access_requests
for all
to authenticated
using (requester = auth.uid())
with check (requester = auth.uid());

-- founders/admins can read all access_requests (adjust ownership model as needed)
create policy "access_requests_broad_read" on public.access_requests
for select
to authenticated
using (
  exists (select 1 from public.profiles p
          where p.id = auth.uid() and p.role in ('founder','admin'))
);

-- nda_signatures policies (self only)
create policy "nda_self_rw" on public.nda_signatures
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

Step 3) Storage

-- Create a private bucket for documents
select storage.create_bucket('documents', public := false);

-- Baseline storage policies (list/insert/update/delete owner or founder only)
-- For a stricter model, require signed URL reads only and restrict standard selects.
-- Here we allow read via signed URLs or explicit select if allowed by tier (via RPC below).

-- Optional: deny direct client reads; rely on signed URLs (recommended)
-- Realtime select on storage.objects still requires a policy, but signed URLs bypass RLS.
-- You can keep select policies minimal and funnel reads through the RPC.

-- Example: Allow founders to manage objects in 'documents'
create policy "storage_founder_manage" on storage.objects
for all
to authenticated
using (
  bucket_id = 'documents' and
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'founder')
)
with check (
  bucket_id = 'documents' and
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'founder')
);

Step 4) Signed URL RPC (recommended path for clients)

-- Provide a safe server-side check and return a short-lived signed URL
create or replace function public.get_document_signed_url(doc_id uuid, expires_seconds int default 300)
returns text
language plpgsql
security definer
as $$
declare
  obj_path text;
  bucket text;
  required_tier text;
  url text;
begin
  select d.path, d.storage_bucket, d.tier
  into obj_path, bucket, required_tier
  from public.documents d
  where d.id = doc_id;

  if obj_path is null then
    raise exception 'Document not found';
  end if;

  -- Check access
  if required_tier = 'public' then
    -- ok
  elsif required_tier = 'qualified' and public.get_user_tier(auth.uid()) not in ('qualified','nda') then
    raise exception 'Access denied';
  elsif required_tier = 'nda' and public.get_user_tier(auth.uid()) <> 'nda' then
    raise exception 'Access denied';
  end if;

  select url
  into url
  from storage.generate_signed_url(bucket, obj_path, expires_seconds);

  return url;
end;
$$;

Grants (adjust as needed):
grant execute on function public.get_document_signed_url(uuid, int) to authenticated;

Step 5) Seed/Admin Notes

- Create a founder profile for your primary admin account:
  insert into public.profiles (id, email, role, tier)
  values ('<your-auth-user-uuid>', '<you@example.com>', 'founder', 'nda')
  on conflict (id) do update set email = excluded.email, role = excluded.role, tier = excluded.tier;

- If you want to auto-provision a profile on first login, add a trigger on auth.users.

----------------------------------------------------------------
Frontend Integration Summary

- Dynamic URL helper: src/utils/getURL.js
- Auth redirect uses: `${getURL()}auth/callback`
- Auth callback route: src/modules/auth/AuthCallback.jsx
- Error screen: src/modules/auth/AuthError.jsx
- Router updates: /auth/callback and /auth/error routes registered

Storage Usage (Frontend)

- Generate signed URLs by calling RPC public.get_document_signed_url(document_id).
- Do not store or expose permanent links; the viewer should use the short-lived URL.

----------------------------------------------------------------
Troubleshooting

Issue: Supabase tool automation fails with "Could not find the function public.run_sql(query) in the schema cache" (PGRST202).
Resolution: Run “Step 0” to create the helper function. After that, automated tools can list/create tables and apply policies.

Issue: Magic link redirects back but user is not logged in.
- Ensure Authentication > URL Configuration includes your Site URL and wildcard Redirect URLs.
- Confirm REACT_APP_SITE_URL (optional) is set correctly in production builds.
- Verify that the /auth/callback route exists and exchangeCodeForSession runs.

New: Role-aware redirects and admin login
- Magic link requests can include an intended next path that is appended to the callback URL, e.g.:
  emailRedirectTo = `${getURL()}auth/callback?next=/admin`
- The Auth callback will:
  1) Exchange the code for a session.
  2) Fetch the user's profile role from public.profiles.
  3) If no profile exists, send the user to /auth/signup (preserving ?next=...).
  4) If role=admin, route to /admin; else honor ?next=...; else route founders to /dashboard and investors to /.
- New routes for discoverability:
  - /auth (or /auth/login): role-oriented sign-in (Investor, Founder) using magic links.
  - /auth/admin: dedicated admin magic link entry point.
  - /auth/signup: simple role selection (founder/investor) to create a profile record.

Issue: 401/403 when requesting signed URLs.
- Confirm the user’s tier and NDA signature state.
- Ensure policies and grants exist and get_user_tier returns expected values.
- Validate that documents.tier is set correctly.

----------------------------------------------------------------
Checklist (Post-Setup)

- [ ] Run SQL: Step 0 through Step 5 in Supabase.
- [ ] Create private 'documents' bucket.
- [ ] Add redirect URLs to Supabase Auth settings.
- [ ] Set environment variables and redeploy the frontend.
- [ ] Upload at least one test document and insert a public documents row.
- [ ] Verify magic-link login flow using the new auth callback route.
