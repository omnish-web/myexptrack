# Deploy the app so you can access it from any device

Your app is **static** (HTML + JS in the browser) and uses **Supabase** for auth and data. To use it from any device you only need to:

1. **Host the app files** at a public URL (HTTPS).
2. **Tell Supabase** to use that URL for sign-in redirects.

No backend server of your own is required — Supabase is already in the cloud.

---

## What to deploy

You only need these files to be served by your host:

- **index.html** (handles auth redirects)
- **ExpTracker-6.html** (main app)

Everything else (docs, backup, supabase folder) is for your reference and does not need to be uploaded.

---

## Which is fastest, safest, and best for making changes later?

| | **Netlify** | **Vercel** | **GitHub Pages** |
|--|-------------|------------|------------------|
| **Fastest to go live (no Git)** | ✅ Drag-and-drop, ~2 min | CLI or Git | Needs Git + repo setup |
| **Speed (site performance)** | Very fast (CDN) | Very fast (CDN) | Fast (CDN) |
| **Safety** | HTTPS, DDoS protection, solid | HTTPS, production-grade | HTTPS, GitHub infra |
| **Making changes later** | Drag-and-drop: manual re-upload each time. **With Git:** push → auto deploy ✅ | **Best with Git:** push → auto deploy, preview URLs | Push to repo → site updates (no extra deploy step) |

**Recommendation: Vercel or Netlify with GitHub**

- **Safest & most convenient long-term:** Connect your project to **GitHub**, then deploy with **Vercel** or **Netlify**. After that, **making changes = push to GitHub** → the site updates automatically. No re-uploading folders or re-dragging files.
- **Fastest first-time (no Git):** **Netlify drag-and-drop** gets you live in minutes, but every future change means dragging the folder again. Fine for rare updates; tedious if you change often.
- **All three are safe** (HTTPS, reputable providers). For a personal expense app, pick by workflow: use **Git + Vercel or Netlify** if you want the smoothest “edit → push → live” loop.

**Summary:** For **fastest, safest, and most convenient when you make changes later**, use **GitHub + Vercel** (or GitHub + Netlify). One-time setup: push repo to GitHub, connect it in Vercel/Netlify. After that, edit locally → push → site updates automatically.

### Recommended workflow (GitHub + Vercel)

1. Create a **GitHub** account (if you don’t have one) and a new repository (e.g. `ReportPilot`).
2. In your project folder, init Git and push:  
   `git init` → add files → `git add .` → `git commit -m "Initial"` → `git remote add origin https://github.com/YOUR_USERNAME/ReportPilot.git` → `git push -u origin main`.
3. Go to **[vercel.com](https://vercel.com)**, sign in with GitHub, click **Add New** → **Project**, and import your `ReportPilot` repo. Leave settings as default and deploy.
4. Add your Vercel URL to **Supabase** → Authentication → URL Configuration (Site URL + Redirect URLs).
5. **Later:** Edit `ExpTracker-6.html` (or any file) locally → `git add .` → `git commit -m "Update"` → `git push`. Vercel will redeploy automatically; your live site updates in about a minute.

---

## Option A: Netlify (simple, free)

1. **Sign up:** Go to [netlify.com](https://www.netlify.com) and create a free account.
2. **Deploy:**
   - In the Netlify dashboard, drag and drop your **ReportPilot** folder (or a folder that contains **only** `index.html` and `ExpTracker-6.html`) into the “Deploy” area.
   - Netlify will give you a URL like `https://something-random-123.netlify.app`.
3. **Use the app:** Open `https://your-site.netlify.app/ExpTracker-6.html` in any browser or device.
4. **Optional:** In Netlify → **Site settings** → **Domain management** you can change the subdomain (e.g. `my-expensetrack.netlify.app`) or add a custom domain.

---

## Option B: Vercel (free, good for Git)

1. **Sign up:** Go to [vercel.com](https://vercel.com) and sign up (e.g. with GitHub).
2. **Deploy:**
   - If you use **Git:** Push your project to GitHub, then in Vercel click “Import Project” and select the repo. Set the **Root Directory** to the folder that contains `index.html` and `ExpTracker-6.html` (e.g. `.` if they are in the repo root).
   - If you don’t use Git: Install the [Vercel CLI](https://vercel.com/docs/cli), run `vercel` in your project folder, and follow the prompts.
3. Vercel will give you a URL like `https://your-project.vercel.app`.
4. **Use the app:** Open `https://your-project.vercel.app/ExpTracker-6.html`.

---

## Option C: GitHub Pages (free, good if you already use GitHub)

1. Push your project to a GitHub repository.
2. In the repo: **Settings** → **Pages** → under “Source” choose **Deploy from a branch**.
3. Select the branch (e.g. `main`) and folder (e.g. **/ (root)**). Save.
4. Your site will be at `https://your-username.github.io/your-repo-name/`.
5. **Use the app:** Open `https://your-username.github.io/your-repo-name/ExpTracker-6.html`.

**Note:** If the repo is **private**, GitHub Pages may still be available depending on your account; for a **public** repo it’s free.

---

## After deployment: Supabase URL configuration

Once you have your **live URL** (e.g. `https://my-expensetrack.netlify.app`):

1. Go to **Supabase Dashboard** → your project → **Authentication** → **URL Configuration**.
2. Set **Site URL** to your app’s base URL, e.g.  
   `https://my-expensetrack.netlify.app`
3. Under **Redirect URLs**, add:
   - `https://my-expensetrack.netlify.app/`
   - `https://my-expensetrack.netlify.app/index.html`
   - `https://my-expensetrack.netlify.app/ExpTracker-6.html`  
   (Use your real URL instead of `my-expensetrack.netlify.app`.)

This makes sign-in (magic link, password reset, etc.) redirect back to your live app instead of localhost.

---

## Optional: Open the app at the root URL

Right now you open the app at `/ExpTracker-6.html`. If you want to open it at the root (e.g. `https://yoursite.netlify.app/`):

- **Netlify:** Add a file `_redirects` in the folder you deploy with:
  ```
  /    /ExpTracker-6.html   200
  ```
- **Vercel:** Add `vercel.json` in the project root:
  ```json
  {
    "rewrites": [{ "source": "/", "destination": "/ExpTracker-6.html" }]
  }
  ```
- **GitHub Pages:** Rename `ExpTracker-6.html` to `index.html` in the repo and keep a separate small `index.html` that redirects to the app, or make the app your only `index.html` (you’d lose the current redirect page unless you duplicate its behavior).

---

## Summary

| Step | Action |
|------|--------|
| 1 | Choose a host (Netlify, Vercel, or GitHub Pages). |
| 2 | Deploy the folder that contains `index.html` and `ExpTracker-6.html`. |
| 3 | Note your live URL (e.g. `https://yoursite.netlify.app`). |
| 4 | In Supabase → Authentication → URL Configuration, set **Site URL** and **Redirect URLs** to that live URL (and the paths above). |
| 5 | Open `https://your-live-url/ExpTracker-6.html` from any device and sign in. |

Your data and auth stay in Supabase; the “live” part is only serving the same HTML/JS from a public URL so you can use the app from anywhere.
