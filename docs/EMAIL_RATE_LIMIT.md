# "Email rate limit exceeded" when sending magic link

Supabase limits how many **auth emails** (magic links, sign-up, password reset) can be sent in a short time. On the **free tier** this is often around **2 emails per hour** per project. So after a few magic-link requests you can see **"Email rate limit exceeded"**.

---

## What to do right now

### 1. Wait and try again
- **Wait about 1 hour**, then click **"Send magic link"** again once.
- Avoid requesting multiple magic links in a row; each request counts.

### 2. Reuse your existing session
- If you **already signed in** on this device before, your session may still be valid.
- **Open the app from the same browser** (same URL as before, e.g. Live Server).
- If you’re still logged in, you won’t need a new magic link.

### 3. Use the same email
- The limit applies **per project**, not per email. So using a different email doesn’t bypass it; you still share the same hourly quota.
- Waiting is the reliable fix.

---

## For later: reduce how often you need magic links

### Option A: Sign in with password (now in the app)
The app has **“Sign in with password”** and **“Sign up (create account with password)”** on the sign-in screen. Create an account with email + password, then sign in without a magic link.

**Tip:** In Supabase → **Authentication** → **Providers** → **Email**, turn **OFF** “Confirm email” if you want. Then **Sign up** in the app creates the account immediately and you can **Sign in with password** without waiting for an email (and without using the rate limit).

### Option B: Custom SMTP (advanced)
If you configure **custom SMTP** in Supabase (Authentication → Email Templates / SMTP), your own mail server’s limits apply instead of Supabase’s default ones. This is useful for production, not required for local development.

---

## Summary

| Situation | What to do |
|-----------|------------|
| **Just hit “rate limit exceeded”** | Wait ~1 hour, then request **one** magic link. |
| **Need to use the app now** | Use the same browser/URL where you’re already signed in, if possible. |
| **Want to avoid this in future** | Use **Sign in with password** (already in the app) or set up custom SMTP (Option B). |
