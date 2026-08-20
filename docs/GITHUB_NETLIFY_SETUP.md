# Connect ReportPilot to GitHub and Netlify (push → auto deploy)

You have: **GitHub account**, **new repository**, **Netlify site** (with Supabase redirect already set).  
Goal: **Push code to GitHub** → **Netlify builds from GitHub** so you never drag-and-drop again.

---

## Part 1: Push your project to GitHub

Do this **once** from your ReportPilot folder (PowerShell or Command Prompt).

### 1. Open terminal in your project folder

```powershell
cd "c:\Users\hp\Documents\ReportPilot"
```

### 2. Initialize Git (if not already)

```powershell
git init
```

If you see "Reinitialized existing Git repository", that's fine. If you see "Initialized empty Git repository", you're good.

### 3. Add all files and commit

```powershell
git add .
git status
```

You should see your files listed. **Do not** see `my-supabase-keys.txt` (it's in `.gitignore` so it won't be pushed — that's correct).

```powershell
git commit -m "Initial commit - expense tracker with Supabase"
```

### 4. Connect to your GitHub repository

Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPO_NAME` with the repo you created (e.g. `ReportPilot`):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Example: if your GitHub user is `johndoe` and repo is `ReportPilot`:

```powershell
git remote add origin https://github.com/johndoe/ReportPilot.git
```

If you get **"remote origin already exists"**, use:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 5. Push to GitHub

GitHub’s default branch is often `main`. Use the branch name your repo shows (e.g. `main` or `master`):

```powershell
git branch -M main
git push -u origin main
```

GitHub will ask you to **sign in**. Use your GitHub username and a **Personal Access Token** (not your GitHub password):

- Go to **GitHub.com** → your profile (top right) → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.
- Give it a name (e.g. "ReportPilot"), check **repo**, then generate and **copy the token**.
- When the terminal asks for **password**, paste that token (nothing will show as you paste — that’s normal). Press Enter.

After a successful push, your code is on GitHub.

---

## Part 2: Make Netlify build from GitHub (instead of drag-and-drop)

### 1. Open Netlify

Go to [app.netlify.com](https://app.netlify.com) and sign in.

### 2. Add a new site from Git (or link existing site)

**Option A — You already have a site from drag-and-drop and want to switch it to Git:**

1. Go to **Site configuration** (or **Site settings**) for that site.
2. Under **Build & deploy** → **Continuous deployment**, click **Link repository** (or **Manage repository** → **Link repository**).
3. Choose **GitHub** and authorize Netlify if asked.
4. Select your **GitHub account** → select the repository you just pushed (e.g. `ReportPilot`).
5. **Build settings** (Netlify usually fills these for static sites):
   - **Branch to deploy:** `main`
   - **Build command:** leave empty
   - **Publish directory:** `.` (a single dot = root)
6. Click **Save** or **Deploy site**.

**Option B — You want a brand‑new site from Git:**

1. Click **Add new site** → **Import an existing project**.
2. Click **Deploy with GitHub** and authorize Netlify.
3. Choose the repository (e.g. `ReportPilot`).
4. **Build settings:**
   - **Branch:** `main`
   - **Build command:** leave empty
   - **Publish directory:** `.`
5. Click **Deploy site**.

If you use **Option A**, Netlify may ask whether to “replace” the current deploy with the one from Git — choose **yes** so future updates come from GitHub.

### 3. Supabase redirect (you already did this)

Your Netlify URL is already in Supabase → **Authentication** → **URL Configuration** (Site URL + Redirect URLs). No change needed unless your Netlify URL changed.

---

## Part 3: Making changes from now on

1. Edit your files in Cursor (e.g. `ExpTracker-6.html`).
2. In the terminal (from your project folder):

   ```powershell
   cd "c:\Users\hp\Documents\ReportPilot"
   git add .
   git commit -m "Describe what you changed"
   git push
   ```

3. Netlify will detect the push and **automatically deploy**. In 1–2 minutes your live site will show the changes. No more drag-and-drop.

---

## Quick reference

| Step | Command / action |
|------|-------------------|
| First-time push | `git init` → `git add .` → `git commit -m "Initial"` → `git remote add origin https://github.com/USER/REPO.git` → `git push -u origin main` |
| Netlify | Site → Build & deploy → Link repository → choose GitHub repo → Publish directory: `.` |
| Every change later | `git add .` → `git commit -m "Message"` → `git push` |

If any step fails, copy the exact error message and you can troubleshoot from there.
