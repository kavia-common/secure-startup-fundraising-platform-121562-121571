# Supabase Integration Guide — company_data_room_frontend

This frontend uses Supabase for:
- Authentication (passwordless magic links)
- Database access (via Postgres + RLS)
- Storage (signed URLs for document previews/downloads)
- Realtime (notifications and updates; to be added in future iterations)

## Environment Variables

Set the following variables in the frontend `.env` file:

- REACT_APP_SUPABASE_URL: The project API URL from Supabase settings
- REACT_APP_SUPABASE_KEY: The public anon key from Supabase API settings

Optional:
- REACT_APP_SITE_URL: Explicit site URL to be used as `emailRedirectTo` for magic link callbacks.
  If omitted, the app will fall back to `window.location.origin`.

Example `.env`:

REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=eyJhbGciOi...

# REACT_APP_SITE_URL=https://your-frontend.example.com

## Client Initialization

The client is initialized in `src/lib/supabaseClient.js`:

- Uses `@supabase/supabase-js` v2.x
- Persists sessions and auto-refreshes tokens
- Warns in development when environment variables are missing

## Auth Flows

- Passwordless: `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })`
- The `AuthProvider` in `src/modules/auth/AuthContext.jsx` exposes:
  - `signInWithEmail(email)`
  - `signOut()`
  - `user`, `session`, and `loading` state

## Routing and Guards

- All routes are declared in `src/routes/AppRouter.jsx`
- `TierGuard` gates protected routes (placeholder logic: requires authenticated user)
- Future: upgrade `TierGuard` to enforce `public | qualified | nda` tiers using fields from the backend via RLS-protected endpoints

## Storage and Signed URLs (Planned)

- The `DocumentViewer` module will request short-lived signed URLs for previews
- Direct downloads can be suppressed in the UI; previews are time-bounded

## Realtime (Planned)

- The notifications module will subscribe to relevant channels for:
  - Access request status changes
  - NDA completion events
  - Document updates
