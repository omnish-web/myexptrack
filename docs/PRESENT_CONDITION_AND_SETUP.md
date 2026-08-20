# Present condition & what to set up

This doc reflects the **current state** of the project and the **exact steps** to run the app with Supabase and complete sign-in.

---

## 1. What’s already done (in the project)

| Item | Status |
|------|--------|
| **Supabase project** | You have a project; URL and anon key are in the app. |
| **Database tables** | Schema has been run in Supabase (you saw “Tables are ready”). |
| **App → Supabase** | App has Supabase client, config, and “Test Supabase connection” button. |
| **Sign-in flow** | Email + “Send magic link” is in the app; after sign-in, data loads from Supabase. |
| **Sign out** | “Sign out” appears in the header when signed in. |
| **Redirect helper** | `index.html` in the project redirects `http://localhost:3000/#access_token=...` to the app page and keeps the hash. |

So: **Phases 0–4 are done in code.** The only thing that was blocking you was **no server running on localhost** when the magic link tried to open.

---

## 2. What still uses Google (not yet migrated)

- **All saving/updating/deleting** still goes to Google (when the app runs in Google Apps Script).
- When you run the app **locally with Supabase**, you can **sign in and see the dashboard**, but **saving a transaction, category, budget, etc. still calls `google.script.run`** — and that **does not exist** when the app is opened as a local file or from a local server. So:
  - **Viewing** after sign-in works (data comes from Supabase).
  - **Adding/editing/deleting** will fail until we implement **Phase 5** (save to Supabase instead of Google).

---

## 3. What you need to set up (two things)

### A. Run the app from a local web server

The magic link redirects to a URL (e.g. `http://localhost:3000` or `http://127.0.0.1:5500`). That URL must be **served by a running server**; otherwise you get “localhost refused to connect.”

**Pick one way to run the server:**

- **Option 1 – Live Server (simplest if you use Cursor)**  
  1. Install the **Live Server** extension in Cursor (Extensions → search “Live Server” → Install).  
  2. In the file tree, **right‑click** `ExpTracker-6.html`.  
  3. Click **“Open with Live Server”**.  
  4. The app opens in the browser. Note the address bar (e.g. `http://127.0.0.1:5500/ExpTracker-6.html` or `http://localhost:5500/ExpTracker-6.html`).  
  5. **Keep that tab/window open** and use the app from that URL.

- **Option 2 – Python (if Python is installed)**  
  1. Open PowerShell and run:  
     `cd "c:\Users\hp\Documents\ReportPilot"`  
     then:  
     `python -m http.server 3000`  
     (or `py -m http.server 3000` if `python` doesn’t work).  
  2. Leave the window open. In the browser open: **http://localhost:3000/ExpTracker-6.html**.

- **Option 3 – Node (if Node is installed)**  
  1. In PowerShell:  
     `cd "c:\Users\hp\Documents\ReportPilot"`  
     then:  
     `npx serve . -p 3000`  
  2. Open **http://localhost:3000/ExpTracker-6.html**.

More detail: see **`docs/RUN_LOCAL_SERVER.md`**.

### B. Match Supabase redirect URL to how you open the app

Supabase must redirect the magic link to the **same origin** (same port and path) you use to open the app.

- **If you use Live Server (e.g. port 5500)**  
  1. Supabase Dashboard → your project → **Authentication** → **URL Configuration**.  
  2. Under **Redirect URLs**, add (adjust if your URL is different):  
     - `http://127.0.0.1:5500/ExpTracker-6.html`  
     - `http://localhost:5500/ExpTracker-6.html`  
  3. Save.  
  4. When you request a magic link, Supabase will redirect to that URL with `#access_token=...` and the app will finish sign-in.

- **If you use Python or Node on port 3000**  
  1. In **Redirect URLs** add:  
     - `http://localhost:3000/ExpTracker-6.html`  
     - `http://localhost:3000`  
  2. When the link goes to `http://localhost:3000/#access_token=...`, the server serves `index.html`, which redirects to `ExpTracker-6.html` with the hash so sign-in completes.

---

## 4. Step-by-step: from “now” to “signed in”

1. **Start the server** (Live Server, Python, or Node) so the app is available at one URL (e.g. `http://127.0.0.1:5500/ExpTracker-6.html` or `http://localhost:3000/ExpTracker-6.html`).  
2. **Add that URL** (and, for port 3000, `http://localhost:3000`) to Supabase **Redirect URLs** as above.  
3. **Open the app** in the browser from that URL (don’t double‑click the HTML file).  
4. You should see the **sign-in** screen (email + “Send magic link”).  
5. Enter your email and click **“Send magic link”**.  
6. Check your email and **click the link**.  
7. The browser should open your app URL with `#access_token=...`; the app loads and you’re signed in (dashboard with data from Supabase).  
8. **Sign out** (header link) to return to the sign-in screen.

If the link still opens a “can’t be reached” or “refused to connect” page, the URL in the link is not being served: fix the server (same port) or the Redirect URL in Supabase so they match.

---

## 5. What’s next after this works

- **Phase 5** will switch **saving** (transactions, categories, sources, budgets, scheduled, pending, snapshot) from Google to Supabase so that when you run the app locally, add/edit/delete will work without Google.  
- Then Phase 6 (local-first with IndexedDB) and Phase 7 (remove Google completely, optional import from Sheets) can follow.

When sign-in and dashboard load work reliably, say you’re **ready for Phase 5** and we’ll wire the first save (e.g. “Save transaction”) to Supabase.
