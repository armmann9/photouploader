# Project Changelog & Audit Remediation History

This file tracks all security, database, performance, and stability modifications across deployment remediation phases. Each entry summarizes what changed, which files were touched, why the change was made, and how to undo it if necessary.

---

## Phase 1 — Authentication & Network Security (Completed)
- **`src/app/login/page.tsx`**: Removed 1-click administrative bypass button and plaintext password hint to enforce genuine credential validation.
- **`src/app/api/auth/login/route.ts` & `src/lib/serverSession.ts`**: Introduced server-side HMAC-signed session tokens in secure HTTP-only cookies (`bpscvs_session_token`) with 7-day expiration.
- **`src/middleware.ts`**: Added Next.js server-side route middleware guarding `/admin/*` and `/studio/*` routes against unauthenticated access.
- **`src/lib/authContext.tsx`**: Replaced client-side `localStorage` role spoofing with server-side cookie verification endpoint (`/api/auth/session`).
- **`next.config.mjs`**: Restricted image proxy `remotePatterns` strictly to `images.unsplash.com` and Supabase storage domains to eliminate SSRF risks.

---

## Phase 2 — Data Integrity & Crash Prevention (Completed)
- **`src/lib/faceRecognition.ts`**: Fixed browser memory leak during bulk photo indexing by invoking `URL.revokeObjectURL()` on processed image blobs.
- **`src/lib/db.ts`**: Wrapped all browser `localStorage.setItem` invocations with a safe quota error handler (`safeLocalStorageSet`) to prevent `QuotaExceededError` crashes.
- **Scope Modification**: Safely removed resident photo upload modal and crowdsourced moderation dependencies (only admins and photographers upload photos via `BulkUploader.tsx`).

---

## Phase 3 — Database Management & Caching

### Item 1 & Item 2: Migration Script, Missing Tables & Row Level Security (RLS)
* **Date**: September 2026
* **Files Touched**:
  1. [`migrations/phase3_changes.sql`](file:///c:/Users/sahill/OneDrive/Desktop/photouploader/migrations/phase3_changes.sql) (New)
  2. [`supabase-schema.sql`](file:///c:/Users/sahill/OneDrive/Desktop/photouploader/supabase-schema.sql) (Modified)
* **One-Line Plain-English Summaries**:
  - `migrations/phase3_changes.sql`: Created dedicated SQL migration script for missing tables (`rsvps`, `event_analytics`, `committee_members`, `emergency_contacts`), performance indexes, and included a complete reverse rollback SQL script to undo all changes.
  - `supabase-schema.sql`: Updated master schema with missing colony tables, locked down RLS so only authenticated admins can edit/delete, and secured the `increment_event_photo_count` function with `SET search_path = public`.
* **Why**:
  - Eliminates silent database query failures when residents RSVP or when admins manage events and helplines.
  - Prevents public anonymous users from dropping or tampering with colony event data, while preserving public viewing and resident RSVP registrations.
  - Provides a self-contained, instant rollback mechanism via SQL.
* **How to Undo (Rollback)**:
  - In Supabase: Run the `DOWN / REVERSE MIGRATION` SQL block at the bottom of `migrations/phase3_changes.sql`.
  - In Git: `git revert 4240e9c`

### Item 3, Item 4 & Item 5: Column Mapping & AI Model Caching Headers
* **Date**: September 2026
* **Files Touched**:
  1. [`src/lib/db.ts`](file:///c:/Users/sahill/OneDrive/Desktop/photouploader/src/lib/db.ts) (Verified / Mapped)
  2. [`next.config.mjs`](file:///c:/Users/sahill/OneDrive/Desktop/photouploader/next.config.mjs) (Modified)
* **One-Line Plain-English Summaries**:
  - `src/lib/db.ts`: Standardized photographer contact field mapping to PostgreSQL `photographer_contact` (snake_case) in event creation and update queries.
  - `next.config.mjs`: Added HTTP response headers caching `/models/*` for 1 year (`Cache-Control: public, max-age=31536000, immutable`) to eliminate redundant 12MB face recognition neural net downloads.
  - `Item 3 (Indexes)`: Verified that all B-Tree and GIN indexes (`idx_photos_event_id`, `idx_photos_tags`, `idx_photos_faces`, `idx_events_slug`, `idx_rsvps_event_id`) are fully active in `migrations/phase3_changes.sql` and `supabase-schema.sql`.
* **Why**:
  - Without snake_case mapping, Supabase silently ignored `photographerContact` on event insertions.
  - Without caching headers, static 12MB neural net weights were re-fetched across sessions, consuming client bandwidth.
* **How to Undo (Rollback)**:
  - Remove `headers()` method in `next.config.mjs`.
  - In Git: `git revert <commit-hash>`.

