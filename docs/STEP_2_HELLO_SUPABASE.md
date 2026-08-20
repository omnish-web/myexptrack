# Step 2: “Hello Supabase” — Test connection from the app

This is **Phase 2**. You’ll paste your Supabase keys into the app and click a button to confirm the app can talk to Supabase.

**Before you start:** You must have:
- Finished **Step 0** (Supabase URL and anon key).
- Finished **Step 1** (run `supabase/schema.sql` in the SQL Editor so the 7 tables exist).

---

## 2.1 Paste your keys in the app

1. Open **`ExpTracker-6.html`** in your editor.
2. Near the **top of the big `<script>` block** (around lines 582–585), you’ll see:

   ```javascript
   const SUPABASE_URL = '';      // e.g. https://abcdefgh.supabase.co
   const SUPABASE_ANON_KEY = ''; // long string from Project Settings → API → anon public
   ```

3. **Replace the empty strings** with your real values:
   - **SUPABASE_URL:** Your Project URL (e.g. `https://abcdefghijk.supabase.co`). Keep the quotes.
   - **SUPABASE_ANON_KEY:** Your anon public key (the long string). Keep the quotes.

   Example (fake values):

   ```javascript
   const SUPABASE_URL = 'https://abcdefghijk.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...';
   ```

4. Save the file.

---

## 2.2 Open the app and click “Test Supabase connection”

1. Open **`ExpTracker-6.html`** in your browser:
   - Double‑click the file, or  
   - Right‑click → “Open with” → your browser (Chrome, Edge, Firefox, etc.).

2. You’ll see the **splash screen** (“Connecting…”, “Initializing App…”).
3. Below the main message there is a green button: **“Test Supabase connection”**.
4. Click it.

---

## 2.3 What should happen

- **If keys are correct and tables exist:**  
  You should see a green toast (or alert): **“Supabase connected! Tables are ready.”**

- **If you didn’t paste keys:**  
  You’ll see a message asking you to paste your Supabase URL and anon key in the script.

- **If the key or URL is wrong:**  
  You’ll see an error message (e.g. “Invalid API key” or “Connection failed”). Double‑check:
  - No extra spaces inside the quotes.
  - Full URL including `https://`.
  - The **anon public** key, not the service_role key.

- **If you see “relation 'public.expenses' does not exist”:**  
  You haven’t run the schema yet. Go back to [STEP_1_DATABASE.md](./STEP_1_DATABASE.md) and run `supabase/schema.sql` in the SQL Editor.

---

## Checklist

- [ ] I pasted my **Project URL** into `SUPABASE_URL` and saved.
- [ ] I pasted my **anon public** key into `SUPABASE_ANON_KEY` and saved.
- [ ] I opened `ExpTracker-6.html` in the browser.
- [ ] I clicked **“Test Supabase connection”**.
- [ ] I saw **“Supabase connected! Tables are ready.”** (or fixed any error).

When all are done, **Phase 2** is complete.

**Next:** Phase 3 — we’ll add sign‑in with email (magic link) so each user has their own data. When you’re ready, say: **“Supabase test works, ready for Phase 3”**.
