# BPSCVS / EventLens AI — Cloudflare Deployment Guide

This guide walks through deploying the BPSCVS Festival Portal to **Cloudflare Pages** with your custom domain, Supabase database, and automated keep-alive to prevent free-tier pausing.

---

## Prerequisites

1. A **Cloudflare account** (free): https://dash.cloudflare.com/sign-up
2. A **domain** purchased from Cloudflare Registrar (e.g., `bpscvs.org`)
3. A **Supabase project** (free): https://supabase.com
4. A **GitHub account** with this repository pushed to it

---

## Step 1: Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/bpscvs-portal.git
git push -u origin master
```

---

## Step 2: Create Cloudflare Pages Project

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**
2. Select your GitHub repository
3. Configure the build:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
4. Click **Save and Deploy**

---

## Step 3: Set Environment Variables

In **Cloudflare Dashboard** → **Workers & Pages** → **Your Project** → **Settings** → **Environment Variables**, add:

| Variable Name | Value | Required? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (from Supabase Dashboard → Settings → API) | ✅ Yes |
| `AUTH_SECRET` | Any random 32+ character string (e.g., generate at https://generate-secret.vercel.app/32) | ✅ Yes |
| `ADMIN_EMAIL` | `admin@bpscvs.org` (or your preferred admin email) | Optional |
| `ADMIN_PASSWORD` | A strong password of your choice | Optional |
| `PHOTOGRAPHER_EMAIL` | `lens.rohan@bpscvs.org` (or your photographer's email) | Optional |
| `PHOTOGRAPHER_PASSWORD` | A strong password of your choice | Optional |

> **Important**: Set these for **both** Production AND Preview environments.

---

## Step 4: Connect Your Custom Domain

1. Go to **Workers & Pages** → **Your Project** → **Custom Domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `bpscvs.org` or `www.bpscvs.org`)
4. Cloudflare automatically configures DNS and SSL — no manual work needed
5. Wait 1-2 minutes for DNS propagation

Your site is now live at `https://bpscvs.org`!

---

## Step 5: Set Up Supabase Database

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql` from this project
3. Paste and click **Run** — all tables, indexes, and RLS policies are created
4. Go to **Settings** → **API** and copy your Project URL and `anon` public key
5. Paste them into Cloudflare environment variables (Step 3 above)

---

## Step 6: Supabase Keep-Alive (Prevent 7-Day Auto-Pause)

Supabase free tier pauses projects with zero activity for 7 days. To prevent this:

### Option A: UptimeRobot (Recommended — Free Forever)

1. Sign up at https://uptimerobot.com (free)
2. Click **Add New Monitor**
3. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: `BPSCVS Health`
   - **URL**: `https://bpscvs.org/api/health`
   - **Monitoring Interval**: `Every 24 hours` (or every 5 minutes for uptime alerts)
4. Click **Create Monitor**

### Option B: cron-job.org (Alternative — Free)

1. Sign up at https://cron-job.org
2. Create a new cron job:
   - **URL**: `https://bpscvs.org/api/health`
   - **Schedule**: Once every 2 days
3. Save

Either option sends a GET request to `/api/health`, which pings Supabase and resets the 7-day inactivity timer. Your database will **never pause**.

---

## Step 7: Verify Everything Works

Open your live domain and verify:

| Test | URL | Expected Result |
|---|---|---|
| Home Page | `https://bpscvs.org` | Festival landing page with albums and timetable |
| Health Check | `https://bpscvs.org/api/health` | `{"status":"ok","db":"connected"}` |
| Admin Login | `https://bpscvs.org/login` | Login form (use your configured credentials) |
| Admin Panel | `https://bpscvs.org/admin` | Redirects to login if not authenticated |
| Event RSVP | `https://bpscvs.org/event/[id]` | Public RSVP form for residents |

---

## Costs Summary

| Service | Monthly Cost |
|---|---|
| Cloudflare Pages (hosting) | **$0 (Free forever)** |
| Cloudflare Domain (annual) | ~$8-12/year depending on TLD |
| Supabase (database) | **$0 (Free tier, 500MB DB + 1GB storage)** |
| UptimeRobot (keep-alive) | **$0 (Free tier, 50 monitors)** |
| **Total Monthly** | **$0** |

---

## Troubleshooting

### Build fails on Cloudflare
- Ensure Node.js version is set to `18.x` in **Settings** → **Environment Variables** → `NODE_VERSION` = `18`

### Login not working
- Verify `AUTH_SECRET` environment variable is set in Cloudflare
- Check that cookies are set with `secure: true` (automatic in production)

### Photos not loading
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase Storage bucket is set to public

### Face Recognition slow on first load
- This is normal — the AI models (~6MB) download on first use
- After first load, they are cached by Cloudflare CDN with `immutable` headers (instant on repeat visits)
