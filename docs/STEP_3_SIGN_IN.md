# Step 3: Sign in with email (magic link) — Done

Phase 3 is implemented in the app. Here’s what was added and how to use it.

---

## What’s in the app now

1. **Sign-in screen**  
   When you open the app and Supabase is configured (URL + anon key set), you see:
   - “Sign in” title  
   - Email input  
   - “Send magic link” button  

2. **Magic link**  
   After you enter your email and click “Send magic link”:
   - Supabase sends an email with a link.
   - You click the link; the app loads and you’re signed in (your data loads from Supabase).

3. **Sign out**  
   When you’re signed in, a **“Sign out”** link appears in the header (next to the theme toggle). Click it to sign out and return to the sign-in screen.

4. **Data source**  
   When signed in, the app loads **all data from Supabase** (expenses, categories, sources, schedules, budgets, pending, snapshot). Saving still goes to Google for now; we’ll switch that in Phase 5.

---

## One-time Supabase setting: Enable Email auth

For “Send magic link” to work, Email must be enabled in your Supabase project:

1. Open your project at **supabase.com** → your project.
2. Go to **Authentication** → **Providers** (in the left sidebar).
3. Find **Email** and turn it **ON** if it isn’t already.
4. (Optional) Under **Email**, you can enable **“Confirm email”** — with magic link, users confirm by clicking the link, so you can leave it as you prefer.

No other auth providers are required.

---

## How to test

1. Open **ExpTracker-6.html** in your browser (double‑click or use a local server).
2. You should see the **sign-in** screen (email + “Send magic link”).
3. Enter your email and click **“Send magic link”**.
4. Check your inbox (and spam). Open the link from Supabase.
5. The app should reload and show the **dashboard** (empty until you add data). The **“Sign out”** link should appear in the header.
6. Click **“Sign out”** to return to the sign-in screen.

---

## If the magic link doesn’t open the app

- If you open the app as a **file** (`file:///...`), the link from the email might not land back in your app.  
- Prefer opening the app from a **local server** (e.g. VS Code “Live Server” or `npx serve`) so the URL is like `http://localhost:3000/ExpTracker-6.html`.  
- In Supabase: **Authentication** → **URL Configuration** → add that URL (e.g. `http://localhost:3000`) to **Redirect URLs** so the magic link can redirect there.

---

## Next: Phase 4 & 5

- **Phase 4** is already in place: after sign-in we load data from Supabase.
- **Phase 5** will switch **saving** from Google to Supabase (one feature at a time).

When you’re ready to move on, say: **“Ready for Phase 5”** and we’ll start wiring **Save transaction** (and then the rest) to Supabase.
