# Expense Tracker: Migration to Supabase (Step-by-Step)

This roadmap takes you from **Google Sheets + Apps Script** to **Supabase + local-first** slowly, one step at a time. You can stop after any step and still have something that works.

---

## How to use this roadmap

- **Do one phase at a time.** Don’t jump ahead.
- **Check off** each step when you’re done (edit the file and add `[x]`).
- If something is unclear, stop and ask before changing code.
- **Back up** your current `ExpTracker-6.html` and `ExpTracker-6.js` (e.g. copy to a folder called `backup`) before we change the app.

---

## Phase 0: Prerequisites

Get accounts and keys ready. No code changes yet.

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **0.1** | Create a Supabase account (free) | [STEP_0_SUPABASE_SETUP.md](./STEP_0_SUPABASE_SETUP.md) |
| **0.2** | Create a new project and get **Project URL** and **anon key** | Same doc |
| **0.3** | Save the URL and key somewhere safe (we’ll add them to the app later) | Same doc |

When Phase 0 is done, you’ll have:
- A Supabase project
- **Project URL** (looks like `https://xxxxx.supabase.co`)
- **anon public** key (long string)

---

## Phase 1: Database in Supabase

We create the tables that will replace your Google Sheets.

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **1.1** | Open Supabase → SQL Editor | [STEP_1_DATABASE.md](./STEP_1_DATABASE.md) |
| **1.2** | Run the schema script (copy from `supabase/schema.sql`) | Same doc |
| **1.3** | Confirm in Table Editor that tables exist | Same doc |

When Phase 1 is done, you’ll have:
- Tables: `expenses`, `categories`, `sources`, `recurring`, `budgets`, `pending_transactions`, `balance_snapshots`
- Row Level Security (RLS) so each user only sees their own data

---

## Phase 2: “Hello Supabase” in the app

We connect the app to Supabase **without** removing Google yet. You’ll see that the app can talk to Supabase.

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **2.1** | Add Supabase JS client (one script tag) to the HTML | (instructions in Phase 2 doc) |
| **2.2** | Add a small config object with your URL and anon key | Same |
| **2.3** | Add a “Test connection” button that fetches from Supabase and shows a message | Same |

When Phase 2 is done:
- The app will load Supabase and show a success/error message when you click “Test connection”.

---

## Phase 3: Sign in with Supabase (replace “Connecting…”)

We add real sign-in so each user has their own data.

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **3.1** | On load: if not signed in, show email + “Send magic link” | (instructions in Phase 3 doc) |
| **3.2** | After sign-in, get the user and store `user.id` for API calls | Same |
| **3.3** | Hide the old “Connecting…” flow when using Supabase | Same |

When Phase 3 is done:
- Opening the app shows “Sign in with email” → magic link → then the app.

---

## Phase 4: Load data from Supabase instead of Google

We replace **only** the “load initial data” path: the app will read from Supabase (and later from IndexedDB).

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **4.1** | Create a function `fetchInitialDataFromSupabase()` that calls your Supabase tables | (Phase 4 doc) |
| **4.2** | Make the app call this instead of `google.script.run.getInitialData()` when using Supabase | Same |
| **4.3** | Shape the response like the old `getInitialData()` (expenses, categories, sources, etc.) so the rest of the UI doesn’t break | Same |

When Phase 4 is done:
- After sign-in, the dashboard loads from Supabase (may be empty until we add save).

---

## Phase 5: Save data to Supabase (one feature at a time)

We replace each “save” path one by one so you can test as we go.

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **5.1** | Save a single transaction (Entry tab) → Supabase `expenses` | (Phase 5 doc) |
| **5.2** | Save categories and sources (Settings) → Supabase | Same |
| **5.3** | Save budgets, scheduled, pending, snapshot | Same |

When Phase 5 is done:
- All create/update/delete operations go to Supabase instead of Google.

---

## Phase 6: Local-first (IndexedDB + sync)

We make the app fast and offline-friendly by using the browser’s local database first, then syncing to Supabase.

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **6.1** | Add Dexie.js and define IndexedDB tables mirroring Supabase | (Phase 6 doc) |
| **6.2** | On load: fetch from Supabase, write into IndexedDB, then read from IndexedDB for the UI | Same |
| **6.3** | On save: write to IndexedDB first, then push to Supabase in the background | Same |

When Phase 6 is done:
- The app feels instant (reads/writes from IndexedDB) and syncs to Supabase for multi-device.

---

## Phase 7: Remove Google completely + polish

| Step | What you’ll do | Doc / File |
|------|----------------|------------|
| **7.1** | Remove all `google.script.run` calls and the old splash “Connecting…” for Google | (Phase 7 doc) |
| **7.2** | Add “Export from Google Sheets” (CSV) and “Import into Supabase” in Settings | Same |
| **7.3** | Optional: sync status indicator, offline toast, error messages | Same |

When Phase 7 is done:
- The app runs 100% on Supabase + IndexedDB; no Google dependency.

---

## Where you are now

- **Phases 0–4 are done** (Supabase project, tables, sign-in, load data from Supabase).
- **To run the app and complete magic-link sign-in:** use a local server and set Supabase redirect URL. See **[PRESENT_CONDITION_AND_SETUP.md](./PRESENT_CONDITION_AND_SETUP.md)** for the exact steps.
- **Next:** Phase 5 — wire saving (transactions, categories, etc.) to Supabase so add/edit/delete work without Google. When ready, say “Ready for Phase 5”.
