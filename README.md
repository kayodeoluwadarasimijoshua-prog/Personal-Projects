# Dara Personal-Project — Authentication with Supabase

A professional, responsive authentication system with **real Supabase database integration**, email verification via OTP, and a demo mode fallback.

## Features

- **Supabase Auth Integration** — Sign up, login, and email OTP verification powered by Supabase
- **Real Email Verification** — Users receive a 6-digit code via email to verify their account
- **Sign Up Page** — Full name, email, password with strength meter, terms checkbox
- **Email Verification Page** — 6-digit OTP input with auto-focus, paste support, resend cooldown
- **Login Page** — Email & password with show/hide toggle, remember me, forgot password
- **Dashboard** — Stats, activity feed, quick actions after successful login
- **Demo Mode** — Try the full UI without Supabase using local in-memory state
- **Setup Guide** — If Supabase isn't configured, a step-by-step setup guide is shown
- **Responsive Design** — Looks great on mobile and desktop
- **Animations** — Smooth transitions using Framer Motion

## Setup Supabase

1. Create a free project at [supabase.com](https://supabase.com/dashboard)
2. Go to **Settings → API** and copy your **Project URL** and **anon public key**
3. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. In Supabase Dashboard → **Authentication → Providers → Email**:
   - Enable "Confirm email" to require email verification
   - This sends a 6-digit OTP code to users when they sign up

5. Restart the dev server:

```bash
npm run dev
```

## How It Works

### With Supabase Configured:
1. **Sign up** → Supabase creates the user and sends a verification email
2. **Verify email** → Enter the 6-digit OTP code from the email
3. **Login** → Authenticate with Supabase using email + password
4. **Dashboard** → Shown when authenticated (persists via Supabase session)
5. **Logout** → Signs out via Supabase

### Without Supabase (Demo Mode):
1. A setup guide is shown with instructions
2. Click "Try Demo Mode" to use local in-memory state
3. All features work the same but with a visible demo code

## Tech Stack

- React 19
- Tailwind CSS 4
- Supabase JS Client (`@supabase/supabase-js`)
- Framer Motion
- Lucide React Icons
- Vite

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

1. Push your code to GitHub
2. Enable GitHub Pages in repo Settings → Pages
3. Set source to the `dist` folder or use a GitHub Action
4. Make sure your `.env` variables are set in the build environment

> **Note:** Never commit your `.env` file. Add it to `.gitignore`.
